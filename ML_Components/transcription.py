import os
import logging
import tempfile
import ctypes.util
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Retrieve ffmpeg settings from environment
ffmpeg_path = os.getenv("FFMPEG_BINARY")
if not ffmpeg_path:
    raise EnvironmentError("FFMPEG_BINARY not set in environment. Please add it to your .env file.")

os.environ["FFMPEG_BINARY"] = ffmpeg_path

# Optionally, add ffmpeg's directory to PATH using FFMPEG_DIR (or the directory of the ffmpeg binary)
ffmpeg_dir = os.getenv("FFMPEG_DIR", os.path.dirname(ffmpeg_path))
os.environ["PATH"] = f"{ffmpeg_dir};" + os.environ.get("PATH", "")

from pydub import AudioSegment
AudioSegment.converter = os.environ["FFMPEG_BINARY"]

# --- Monkey Patch for Windows ---
if os.name == "nt":
    import ctypes
    _original_find_library = ctypes.util.find_library
    def my_find_library(name):
        lib = _original_find_library(name)
        if lib is None and name == "c":
            return "msvcrt.dll"
        return lib
    ctypes.util.find_library = my_find_library
# --- End Patch ---

import whisper

# Explicitly set the ffmpeg path on Windows (redundant but for safety)
if os.name == "nt":
    AudioSegment.converter = os.environ["FFMPEG_BINARY"]

logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s")


def process_file(file_data: bytes, file_ext: str, model_size="base"):
    """
    Processes an uploaded audio/video file from raw bytes, converts it if necessary, and transcribes it.
    The transcription task is set to "translate" so that any Hindi, Marathi, or other non-English input
    is automatically translated to English.
    """
    try:
        logging.debug(f"Starting file processing. File extension: {file_ext} | Data size: {len(file_data)} bytes")
        # Create a temporary file in the system temp directory
        temp_file_path = os.path.join(tempfile.gettempdir(), "temp_file" + file_ext)
        with open(temp_file_path, "wb") as temp_file:
            temp_file.write(file_data)

        logging.info(f"Temporary file saved at: {temp_file_path}")
        # Convert and extract audio if needed
        temp_audio_path = convert_to_wav(temp_file_path)
        if not temp_audio_path:
            logging.error("Failed to convert/extract audio.")
            return None

        logging.info("Loading Whisper model...")
        model = whisper.load_model(model_size)
        logging.info("Whisper model loaded successfully.")

        logging.info("Starting transcription with translation task (output will be in English)...")
        # Use the "translate" task so that non-English speech is translated to English.
        result = model.transcribe(temp_audio_path, task="translate")
        detected_language = result.get("language", "unknown")
        logging.info(f"Transcription completed. Detected language: {detected_language}")
        logging.debug(f"Detected language: {detected_language}")

        # Cleanup temporary files
        os.remove(temp_file_path)
        os.remove(temp_audio_path)

        logging.debug(f"Transcribed text (first 100 chars): {result.get('text', '')[:100]}...")
        return result["text"]

    except Exception as e:
        logging.error(f"Error processing file: {e}", exc_info=True)
        return None


def convert_to_wav(input_path):
    """
    Converts input audio/video file to WAV (16kHz mono) for Whisper processing.
    Returns the path to the converted file.
    """
    try:
        temp_wav_path = input_path + ".wav"
        logging.info("Converting audio to 16 kHz mono...")
        audio = AudioSegment.from_file(input_path)
        audio = audio.set_frame_rate(16000).set_channels(1)
        audio.export(temp_wav_path, format="wav")
        logging.info(f"Conversion successful. WAV file at: {temp_wav_path}")
        return temp_wav_path

    except Exception as e:
        logging.error(f"Error converting audio: {e}", exc_info=True)
        return None
