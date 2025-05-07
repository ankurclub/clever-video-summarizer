import re

def convert_vtt_to_srt(vtt_path, srt_path):
    with open(vtt_path, 'r', encoding='utf-8') as vtt_file:
        lines = vtt_file.readlines()

    srt_lines = []
    counter = 1
    timestamp_pattern = re.compile(r"(\d{2}:\d{2}:\d{2})\.(\d{3}) --> (\d{2}:\d{2}:\d{2})\.(\d{3})")

    buffer = []
    for line in lines:
        line = line.strip()

        # Skip headers and metadata
        if (
            line.startswith("WEBVTT") or
            line.startswith("Kind:") or
            line.startswith("Language:") or
            line.startswith("Transcriber:") or
            line.startswith("Reviewer:") or
            line == ""
        ):
            continue

        match = timestamp_pattern.match(line)
        if match:
            if buffer:
                srt_lines.extend(buffer)
                srt_lines.append("")  # Blank line between blocks
                buffer = []

            start_time = f"{match.group(1)},{match.group(2)}"
            end_time = f"{match.group(3)},{match.group(4)}"

            srt_lines.append(str(counter))
            srt_lines.append(f"{start_time} --> {end_time}")
            counter += 1
        else:
            buffer.append(line)

    if buffer:
        srt_lines.extend(buffer)
        srt_lines.append("")

    with open(srt_path, 'w', encoding='utf-8') as srt_file:
        srt_file.write("\n".join(srt_lines))


def extract_clean_text_from_srt(srt_path, clean_txt_path):
    with open(srt_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    clean_lines = []
    timestamp_pattern = re.compile(r"^\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}$")

    for line in lines:
        line = line.strip()
        if not line or line.isdigit() or timestamp_pattern.match(line):
            continue
        clean_lines.append(line)

    with open(clean_txt_path, 'w', encoding='utf-8') as out_file:
        out_file.write("\n".join(clean_lines))


# Example usage
if __name__ == "__main__":
    convert_vtt_to_srt("example.vtt", "output.srt")
    extract_clean_text_from_srt("output.srt", "Clean_Text.txt")
