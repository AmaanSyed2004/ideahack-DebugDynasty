"""
transcription.py

This module handles extracting audio from a file and transcribing it using Whisper.
Install the following dependencies before running:
    
    pip install openai-whisper torch pydub moviepy

Note: pydub and moviepy require ffmpeg. Make sure ffmpeg is installed.
"""

import os
import whisper
from pydub import AudioSegment
from moviepy.editor import VideoFileClip

def extract_audio(input_path, output_audio_path="converted_audio.wav"):
    """
    Extracts audio from a video or converts an existing audio file to WAV (16kHz mono).
    Returns the path to the converted audio file.
    """
    file_ext = os.path.splitext(input_path)[-1].lower()

    # If the input is a video, extract audio
    if file_ext in [".mp4", ".avi", ".mov", ".mkv", ".flv"]:
        try:
            print("Detected video file. Extracting audio...")
            video = VideoFileClip(input_path)
            audio = video.audio
            audio.write_audiofile(output_audio_path, logger=None)
            video.close()
            input_path = output_audio_path  # Use extracted audio for further processing
        except Exception as e:
            print("Error extracting audio:", e)
            return None

    # Convert audio to 16 kHz mono WAV format
    try:
        print("Converting to 16 kHz mono for Whisper...")
        audio = AudioSegment.from_file(input_path)
        audio = audio.set_frame_rate(16000).set_channels(1)
        converted_audio_path = "converted_audio.wav"
        audio.export(converted_audio_path, format="wav")
        return converted_audio_path
    except Exception as e:
        print("Error processing audio:", e)
        return None

def transcribe_audio_whisper(audio_path, model_size="base"):
    """
    Transcribes audio using OpenAI's Whisper model.
    Returns the transcribed text.
    """
    try:
        print("Loading Whisper model...")
        model = whisper.load_model(model_size)
        print("Transcribing audio...")
        result = model.transcribe(audio_path)
        return result["text"]
    except Exception as e:
        print("Error during transcription:", e)
        return None

def process_file(input_path):
    """
    Processes an audio/video file: extracts audio, converts, and transcribes.
    Returns the transcription text or None on error.
    """
    audio_path = extract_audio(input_path)
    if audio_path:
        transcript = transcribe_audio_whisper(audio_path)
        if transcript:
            print("Transcription:", transcript)
            return transcript
    return None

if __name__ == "__main__":
    # Example usage: replace 'your_file_path' with an actual file path.
    file_path = "./complain.mov"
    transcript = process_file(file_path)
    print("Final Transcript:", transcript)
