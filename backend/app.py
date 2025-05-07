from subtitle_converter import convert_vtt_to_srt, extract_clean_text_from_srt
from flask import Flask, request, jsonify
from deep_translator import GoogleTranslator
import os
import yt_dlp as youtube_dl
import whisper
import torch
from transformers import pipeline
from flask_cors import CORS
import uuid
import tempfile
import shutil
import re
import atexit
import time
import threading
import psutil
import traceback

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:8080"}})

# Create temporary directory for all downloads
TEMP_DIR = tempfile.mkdtemp(prefix="video_processor_")
print(f"Created temporary directory: {TEMP_DIR}")

# Load Whisper model for transcription
whisper_model = whisper.load_model("base")

# Load BART model for summarization
print("Loading BART summarization model... (This may take time)")
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Device set to use {device}")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn", device=0 if device == "cuda" else -1)
print("Model loaded successfully!")

# Simple in-memory queue system
processing_queue = []
queue_lock = threading.Lock()

@app.route("/")
def home():
    return "✅ Backend is running successfully!"

# Clean up all temporary files when the server exits
@atexit.register
def cleanup_temp_directory():
    if os.path.exists(TEMP_DIR):
        shutil.rmtree(TEMP_DIR)
        print(f"Deleted temporary directory: {TEMP_DIR}")

# --- Queue Management Functions ---
def add_to_queue(job_id, job_type, data):
    with queue_lock:
        queue_position = len(processing_queue)
        processing_queue.append({
            "id": job_id,
            "type": job_type,
            "data": data,
            "status": "queued",
            "submitted_at": time.time()
        })
        return queue_position

def get_queue_position(job_id):
    with queue_lock:
        for i, job in enumerate(processing_queue):
            if job["id"] == job_id:
                return i
        return -1  # Not found

def process_next_in_queue():
    with queue_lock:
        for i, job in enumerate(processing_queue):
            if job["status"] == "queued":
                job["status"] = "processing"
                return job
        return None

# Route to check server storage capacity
@app.route("/check_storage", methods=["GET"])
def check_storage():
    try:
        # Get disk usage of the partition where TEMP_DIR is located
        disk_usage = psutil.disk_usage(os.path.dirname(TEMP_DIR))
        used_percentage = disk_usage.percent
        
        # Get queue length
        queue_length = len(processing_queue)
        
        return jsonify({
            "total_space_gb": disk_usage.total / (1024 * 1024 * 1024),
            "used_space_gb": disk_usage.used / (1024 * 1024 * 1024),
            "free_space_gb": disk_usage.free / (1024 * 1024 * 1024),
            "used_percentage": used_percentage,
            "queue_length": queue_length,
            "is_busy": used_percentage > 80 or queue_length > 0
        })
    except Exception as e:
        print(f"Error checking storage: {e}")
        # Return a fallback response if we can't check storage
        return jsonify({
            "used_percentage": 50,  # Default to 50%
            "queue_length": 0,
            "is_busy": False,
            "error": str(e)
        })

# --- Helper Functions ---
def chunk_text(text, max_tokens=500):
    words = text.split()
    chunks = []
    while words:
        chunk = words[:max_tokens]
        chunks.append(" ".join(chunk))
        words = words[max_tokens:]
    return chunks

# Helper function to clean up temporary files
def cleanup_files(files_list):
    for file_path in files_list:
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                print(f"Deleted: {file_path}")
        except Exception as e:
            print(f"Error deleting {file_path}: {e}")

# Helper function to convert VTT subtitles to clean text without timestamps
def clean_subtitle_text(vtt_content):
    # Improved cleaning function to handle more subtitle formats
    # Remove all timestamp patterns like <00:00:00.000> or [00:00:00.000]
    clean_text = re.sub(r'<\d+:\d+:\d+\.\d+>', '', vtt_content)
    clean_text = re.sub(r'\[\d+:\d+:\d+\.\d+\]', '', clean_text)
    
    # Remove WebVTT headers and metadata
    lines = clean_text.splitlines()
    clean_lines = []
    is_content = False
    current_paragraph = []
    
    for line in lines:
        line = line.strip()
        
        # Skip header lines, timestamps, and index numbers
        if not line or line.startswith("WEBVTT") or "-->" in line or line.isdigit() or re.match(r'^\d+:\d+:\d+', line):
            if current_paragraph and is_content:
                clean_lines.append(" ".join(current_paragraph))
                current_paragraph = []
            continue
            
        # Skip lines that are just tags or formatting
        if re.match(r'^<.*>$', line) or line == "Kind: captions" or line == "Language: en":
            continue
            
        is_content = True
        current_paragraph.append(line)
        
        # Create paragraph breaks on empty lines
        if len(current_paragraph) > 5:  # Group about 5 lines into a paragraph
            clean_lines.append(" ".join(current_paragraph))
            current_paragraph = []
    
    # Add the last paragraph if it exists
    if current_paragraph:
        clean_lines.append(" ".join(current_paragraph))
    
    # Clean up any remaining HTML-like tags (common in subtitles)
    result = "\n\n".join(clean_lines)
    result = re.sub(r'</?c>', '', result)  # Remove <c> and </c> tags
    result = re.sub(r'</?[a-zA-Z][^>]*>', '', result)  # Remove other HTML-like tags
    
    # Remove duplicate lines that often appear in subtitles
    lines = result.split('\n\n')
    unique_lines = []
    for i, line in enumerate(lines):
        if i == 0 or line.strip() != lines[i-1].strip():
            unique_lines.append(line)
    
    return "\n\n".join(unique_lines)

# 1️⃣ GET SUBTITLE (Extract YouTube Subtitles)
@app.route("/get_subtitle", methods=["POST"])
def get_subtitle():
    data = request.get_json()
    print("Received request data:", data)

    if not data or "video_url" not in data:
        return jsonify({"error": "No video URL provided"}), 400

    video_url = data["video_url"]
    print("Processing video:", video_url)
    
    # Generate unique filename to avoid conflicts
    unique_id = uuid.uuid4().hex
    subtitle_base = os.path.join(TEMP_DIR, f"subtitle_{unique_id}")
    
    try:
        ydl_opts = {
            "skip_download": True,
            "writesubtitles": True,
            "subtitleslangs": ["en", "en-US", "en.*"],
            "outtmpl": subtitle_base
        }

        with youtube_dl.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])
        
        # Look for any subtitle files with the unique base name
        subtitle_files = [f for f in os.listdir(TEMP_DIR) if f.startswith(os.path.basename(subtitle_base)) and f.endswith(".vtt")]
        
        if subtitle_files:
            subtitle_file = os.path.join(TEMP_DIR, subtitle_files[0])
            with open(subtitle_file, "r", encoding="utf-8") as f:
                subtitles = f.read()
            
            # Clean up temp files after reading content
            cleanup_files([os.path.join(TEMP_DIR, f) for f in subtitle_files])
            
            print("Subtitles fetched successfully!")
            return jsonify({"subtitles": subtitles})
        else:
            print("Subtitles not found! Returning error status.")
            return jsonify({"error": "No subtitles found for this video"}), 404

    except Exception as e:
        print("Error downloading subtitles:", e)
        return jsonify({"error": str(e)}), 500

# 2️⃣ GET TRANSCRIPTION (Transcribe Uploaded Audio)
@app.route("/get_transcription", methods=["POST"])
def get_transcription():
    print("Received request for transcription...")

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    audio_file = request.files["file"]
    if audio_file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    try:
        audio_path = os.path.join(TEMP_DIR, f"{uuid.uuid4().hex}_{audio_file.filename}")
        audio_file.save(audio_path)
        print(f"Audio saved at: {audio_path}")

        # Add error handling around the transcription process
        try:
            result = whisper_model.transcribe(audio_path)
            transcription = result.get("text", "")
            print("Transcription completed!")
        except Exception as transcription_error:
            print(f"Error during transcription process: {transcription_error}")
            print(f"Stack trace: {traceback.format_exc()}")
            # Check if it's a file format issue
            return jsonify({
                "error": f"Failed to transcribe file: The file format may not be supported or the file may be corrupted. Details: {str(transcription_error)}"
            }), 500

        # Clean up the temporary audio file
        os.remove(audio_path)
        print("Temp file deleted!")

        return jsonify({"transcription": transcription})

    except Exception as e:
        print(f"General error during transcription: {e}")
        print(f"Stack trace: {traceback.format_exc()}")
        return jsonify({"error": f"Failed to process file: {str(e)}"}), 500

# 3️⃣ GET TRANSCRIPTION FROM URL (Auto download & transcribe YouTube audio)
@app.route("/get_transcription_from_url", methods=["POST"])
def get_transcription_from_url():
    print("Received transcription request from URL...")

    try:
        data = request.get_json()
        video_url = data.get("url")

        if not video_url:
            return jsonify({"error": "No URL provided!"}), 400

        print(f"Downloading from: {video_url}")

        # Create unique filenames
        base_filename = uuid.uuid4().hex
        audio_path = os.path.join(TEMP_DIR, f"{base_filename}.mp3")

        # Download audio and transcribe
        print("Downloading audio for transcription...")
        ydl_opts = {
            "format": "bestaudio/best",
            "outtmpl": audio_path,
            "postprocessors": [
                {
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": "192",
                }
            ],
            # Don't add additional extension
            "nopostoverwrites": True,
        }

        with youtube_dl.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])

        print(f"Audio saved: {audio_path}")

        # Check if file exists before transcribing
        if not os.path.exists(audio_path):
            mp3_path = f"{audio_path}.mp3"  # Check with additional .mp3 extension
            if os.path.exists(mp3_path):
                audio_path = mp3_path
            else:
                print(f"Audio file not found at: {audio_path} or {mp3_path}")
                return jsonify({"error": "Failed to download audio"}), 500

        # Transcribe the audio file
        try:
            result = whisper_model.transcribe(audio_path)
            transcription = result.get("text", "")
            print("Transcription completed!")
        except Exception as transcription_error:
            print(f"Error during transcription process: {transcription_error}")
            print(f"Stack trace: {traceback.format_exc()}")
            return jsonify({
                "error": f"Failed to transcribe audio: {str(transcription_error)}"
            }), 500

        # Cleanup
        if os.path.exists(audio_path):
            os.remove(audio_path)
            print("Temporary audio file cleaned up")

        return jsonify({"transcription": transcription})

    except Exception as e:
        print(f"General error during transcription from URL: {e}")
        print(f"Stack trace: {traceback.format_exc()}")
        return jsonify({"error": f"Failed to process URL: {str(e)}"}), 500

# 4️⃣ GET SUMMARY FUNCTION 
@app.route("/get_summary", methods=["POST"])
def get_summary():
    print("Received request for summary...")

    # ✅ Handle invalid JSON gracefully
    try:
        data = request.get_json(silent=True)
    except Exception as e:
        print("Failed to parse JSON:", e)
        return jsonify({"error": "Invalid JSON format"}), 400

    # ✅ Validate input text
    if not data or not data.get("text") or not data["text"].strip():
        return jsonify({"error": "No text provided"}), 400

    text = data["text"].strip()
    print(f"Input text length: {len(text)} characters")
    
    # Increase max length from 15K to 25K characters
    max_length = 25000  # Increased from 15K to 25K
    
    # Check if this is a long content request
    is_long_content = data.get("is_long_content", False)
    
    if len(text) > max_length:
        print(f"Text too long ({len(text)} chars), truncating to {max_length} characters")
        text = text[:max_length] + "..."

    # ✅ Adjust chunking for BART model compatibility
    def chunk_text(text, max_tokens=250):  # Maintained at 250 tokens per chunk
        words = text.split()
        chunks = []
        while words:
            chunk = words[:max_tokens]
            chunks.append(" ".join(chunk))
            words = words[max_tokens:]
        return chunks

    try:
        chunks = chunk_text(text)
        print(f"Split text into {len(chunks)} chunks for processing")
        summarized_chunks = []

        for i, chunk in enumerate(chunks):
            chunk_len = len(chunk.split())
            print(f"Processing chunk {i + 1}/{len(chunks)}: {chunk_len} words")

            # Skip empty chunks
            if chunk_len < 10:
                print(f"Skipping chunk {i + 1} (too short)")
                continue

            # ✅ Use more appropriate min/max length settings for better summaries
            min_length = max(30, min(80, chunk_len // 4))  # Slightly increased minimum length
            max_length = max(min_length + 50, min(200, chunk_len // 2))  # More generous maximum length

            try:
                print(f"Summarizing chunk {i + 1}/{len(chunks)} (min={min_length}, max={max_length})...")
                # Set shorter timeout for each chunk summarization
                summary = summarizer(
                    chunk,
                    max_length=max_length,
                    min_length=min_length,
                    do_sample=False,
                    truncation=True  # Ensure truncation is explicitly enabled
                )
                summarized_text = summary[0]["summary_text"].strip()
                print(f"Chunk {i + 1} summary length: {len(summarized_text)} chars")
                
                # Only add non-empty summaries
                if summarized_text:
                    summarized_chunks.append(summarized_text)
                    
            except Exception as e:
                print(f"Error summarizing chunk {i + 1}: {e}")
                # Instead of adding error message, add a shortened version of the original text
                # This helps ensure we always provide content even if summarization fails
                if chunk_len > 100:
                    # Take first 2 sentences if summarization fails
                    sentences = re.split(r'[.!?]+', chunk)
                    shortened = '. '.join(sentences[:2]) + '.'
                    summarized_chunks.append(shortened)
                else:
                    # If the chunk is already short, just use it directly
                    summarized_chunks.append(chunk)
        
        # If we didn't get any summaries, return a helpful error
        if not summarized_chunks:
            print("No summary chunks were generated successfully")
            return jsonify({"error": "Failed to generate summary"}), 500

        final_summary = "\n\n".join(summarized_chunks).strip()
        print(f"Final summary generated: {len(final_summary)} characters")

        # Use a more informative note for long content
        if is_long_content:
            final_summary += "\n\n(Note: This summary represents content from selected portions as the original was too long to process in full.)"
        elif len(text) > max_length:
            final_summary += "\n\n(Note: The original text was truncated before summarization due to length constraints.)"

        return jsonify({"summary": final_summary})
        
    except Exception as e:
        print(f"Global error in summary generation: {e}")
        
        # Fallback to extractive summary when BART fails
        try:
            print("Attempting extractive summary fallback...")
            # Fix the regex pattern to be Python-compatible
            sentences = re.split(r'[.!?]\s+', text)
            
            # For long content, extract more sentences
            numSentences = min(len(sentences), 30 if is_long_content else 20)
            
            # Take some sentences from beginning, middle and end for better coverage
            extracted_sentences = []
            # Beginning (40%)
            beginning_count = numSentences * 4 // 10
            extracted_sentences.extend(sentences[:beginning_count])
            
            # Middle (30%)
            if len(sentences) > 30:
                middle_start = len(sentences) // 2 - (numSentences * 15 // 100)
                middle_count = numSentences * 3 // 10
                extracted_sentences.extend(sentences[middle_start:middle_start + middle_count])
            
            # End (30%)
            if len(sentences) > 20:
                extracted_sentences.extend(sentences[-1 * (numSentences * 3 // 10):])
            
            extractive_summary = ' '.join(extracted_sentences)
            
            if is_long_content:
                note = "(Note: This is an extractive summary generated from key portions of your content, as the full content was too long to process completely.)"
            else:
                note = "(Note: This is an extractive summary generated due to processing limitations with the original content.)"
                
            return jsonify({
                "summary": f"{extractive_summary.strip()}\n\n{note}",
                "is_fallback": True
            })
        except Exception as fallback_error:
            print(f"Even fallback summary failed: {fallback_error}")
            return jsonify({"error": f"Failed to generate summary: {str(e)}"}), 500

# 5️⃣ GET TRANSLATION FUNCTION 
@app.route("/translate", methods=["POST"])
def translate_text():
    try:
        print("📝 Received translation request")
        
        if not request.is_json:
            print("❌ Invalid request: Not JSON format")
            return jsonify({"error": "Request must be JSON"}), 400
            
        data = request.get_json()
        
        # Validate input
        text = data.get("text", "").strip()
        target_lang = data.get("target_lang")
        
        print(f"🔤 Translation requested to {target_lang}, text length: {len(text)}")
        
        if not text:
            print("❌ Empty text provided for translation")
            return jsonify({"error": "Missing or empty text parameter"}), 400
            
        if not target_lang:
            print("❌ No target language specified")
            return jsonify({"error": "Missing target_lang parameter"}), 400
        
        try:
            print(f"🔄 Starting translation to {target_lang}")
            
            # IMPORTANT: The GoogleTranslator has a 5000 character limit
            # If text is longer than 5000 characters, split into chunks and translate separately
            MAX_CHUNK_SIZE = 4500  # Use slightly less than 5000 to be safe
            
            # If text is short enough, translate directly
            if len(text) <= MAX_CHUNK_SIZE:
                translator = GoogleTranslator(source='auto', target=target_lang)
                translated = translator.translate(text)
                
                if not translated or len(translated.strip()) == 0:
                    print("❌ Translation API returned empty result")
                    return jsonify({"error": "Translation failed - empty result"}), 500
                    
                print(f"✅ Translation completed: {len(translated)} characters")
                return jsonify({"translated_text": translated})
            
            # For longer texts, split by paragraphs and translate each paragraph
            print(f"🔄 Long text detected ({len(text)} chars), breaking into chunks of max {MAX_CHUNK_SIZE} characters")
            paragraphs = text.split('\n\n')
            translated_paragraphs = []
            current_chunk = ""
            
            for i, para in enumerate(paragraphs):
                # If adding this paragraph would exceed the chunk size, translate the current chunk first
                if len(current_chunk) + len(para) + 2 > MAX_CHUNK_SIZE and current_chunk:
                    print(f"🔄 Translating chunk {len(translated_paragraphs)+1}: {len(current_chunk)} characters")
                    translator = GoogleTranslator(source='auto', target=target_lang)
                    chunk_translation = translator.translate(current_chunk)
                    if chunk_translation and chunk_translation.strip():
                        translated_paragraphs.append(chunk_translation)
                    current_chunk = ""
                
                # If the paragraph itself is too long, split it into sentences
                if len(para) > MAX_CHUNK_SIZE:
                    print(f"🔄 Paragraph {i+1} is too long ({len(para)} chars), splitting into sentences")
                    sentences = re.split(r'(?<=[.!?])\s+', para)
                    sentence_chunk = ""
                    
                    for sentence in sentences:
                        # If sentence itself is too long (rare but possible)
                        if len(sentence) > MAX_CHUNK_SIZE:
                            # If we can't split further, translate in smaller chunks
                            if sentence_chunk:
                                translator = GoogleTranslator(source='auto', target=target_lang)
                                chunk_translation = translator.translate(sentence_chunk)
                                if chunk_translation and chunk_translation.strip():
                                    translated_paragraphs.append(chunk_translation)
                            
                            # Split the long sentence into smaller pieces
                            print(f"🔄 Sentence is too long ({len(sentence)} chars), splitting it")
                            for i in range(0, len(sentence), MAX_CHUNK_SIZE):
                                sub_chunk = sentence[i:i+MAX_CHUNK_SIZE]
                                translator = GoogleTranslator(source='auto', target=target_lang)
                                chunk_translation = translator.translate(sub_chunk)
                                if chunk_translation and chunk_translation.strip():
                                    translated_paragraphs.append(chunk_translation)
                            
                            sentence_chunk = ""
                        # If adding this sentence would exceed chunk size, translate current chunk first
                        elif len(sentence_chunk) + len(sentence) + 1 > MAX_CHUNK_SIZE:
                            translator = GoogleTranslator(source='auto', target=target_lang)
                            chunk_translation = translator.translate(sentence_chunk)
                            if chunk_translation and chunk_translation.strip():
                                translated_paragraphs.append(chunk_translation)
                            sentence_chunk = sentence
                        else:
                            if sentence_chunk:
                                sentence_chunk += " " + sentence
                            else:
                                sentence_chunk = sentence
                    
                    # Translate any remaining sentences
                    if sentence_chunk:
                        translator = GoogleTranslator(source='auto', target=target_lang)
                        chunk_translation = translator.translate(sentence_chunk)
                        if chunk_translation and chunk_translation.strip():
                            translated_paragraphs.append(chunk_translation)
                else:
                    # If current_chunk is empty, start with this paragraph
                    if not current_chunk:
                        current_chunk = para
                    # Otherwise append this paragraph to current_chunk
                    else:
                        current_chunk += "\n\n" + para
            
            # Translate any remaining text in the current chunk
            if current_chunk:
                print(f"🔄 Translating final chunk: {len(current_chunk)} characters")
                translator = GoogleTranslator(source='auto', target=target_lang)
                chunk_translation = translator.translate(current_chunk)
                if chunk_translation and chunk_translation.strip():
                    translated_paragraphs.append(chunk_translation)
            
            # Join all translated paragraphs
            final_translated_text = "\n\n".join(translated_paragraphs)
            
            if not final_translated_text or len(final_translated_text.strip()) == 0:
                print("❌ All translation chunks failed")
                return jsonify({"error": "Translation failed - all chunks returned empty results"}), 500
            
            print(f"✅ Full translation completed: {len(final_translated_text)} characters")
            return jsonify({"translated_text": final_translated_text})
            
        except Exception as translation_error:
            print(f"❌ Translation API error: {translation_error}")
            return jsonify({"error": f"Translation API error: {str(translation_error)}"}), 500

    except Exception as e:
        print(f"❌ Global translation error: {e}")
        traceback.print_exc()  # Print full stack trace for debugging
        return jsonify({"error": f"Translation error: {str(e)}"}), 500

# Run Flask app
if __name__ == "__main__":
    app.run(debug=True, port=5000)
