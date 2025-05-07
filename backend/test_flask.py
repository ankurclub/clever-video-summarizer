
# Simple script to test if Flask is properly installed

try:
    from flask import Flask
    print("✅ Flask is successfully installed!")
    
    app = Flask(__name__)
    print("✅ Flask app was created successfully!")
    
except ImportError:
    print("❌ Flask is not installed. Please run the install_requirements.sh script.")
