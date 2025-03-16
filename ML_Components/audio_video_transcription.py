#requirements to be added : 


# pydub==0.25.1
# SpeechRecognition==3.14.1
# moviepy==1.0.3
# gTTS==2.5.4
# playsound==1.3.0

# ----------------------------------------------- #
import os
from pydub import AudioSegment
from moviepy.editor import VideoFileClip
import speech_recognition as sr
from gtts import gTTS
from IPython.display import Audio, display  # Use IPython to play audio in Colab

def extract_audio(input_path, output_audio_path="audio.wav"):
    """
    Extracts audio from a video file using MoviePy or converts an audio file to WAV using pydub.
    Converts to 16 kHz, mono to improve recognition accuracy.
    """
    file_ext = os.path.splitext(input_path)[-1].lower()

    # Handle video files with MoviePy
    if file_ext in [".mp4", ".avi", ".mov", ".mkv", ".flv"]:
        try:
            print("Detected video file. Extracting audio using MoviePy...")
            video = VideoFileClip(input_path)
            audio = video.audio
            audio.write_audiofile(output_audio_path)
            video.close()
        except Exception as e:
            print("Error extracting audio from video:", e)
            return None

    # Convert audio to 16kHz mono
    try:
        print("Converting to 16 kHz mono for better recognition...")
        audio = AudioSegment.from_file(output_audio_path)
        audio = audio.set_frame_rate(16000).set_channels(1)
        output_audio_path = "converted_audio.wav"
        audio.export(output_audio_path, format="wav")
        print("Audio successfully converted and saved as:", output_audio_path)
        return output_audio_path
    except Exception as e:
        print("Error processing audio file:", e)
        return None

def transcribe_audio(audio_path, language="en"):
    """
    Transcribes the extracted audio using Google Speech Recognition.
    Supports English ('en'), Hindi ('hi'), and Marathi ('mr').
    """
    recognizer = sr.Recognizer()
    
    with sr.AudioFile(audio_path) as source:
        print("Analyzing audio...")
        recognizer.adjust_for_ambient_noise(source, duration=1)  # Reduce background noise
        audio_data = recognizer.record(source)  # Capture the full audio
        
    try:
        transcript = recognizer.recognize_google(audio_data, language=language)
        return transcript
    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand the audio.")
        return None
    except sr.RequestError as e:
        print("Error with Google Speech Recognition:", e)
        return None

def text_to_speech(text, language="en"):
    """
    Converts text to speech using Google TTS and plays the audio.
    Supports English, Hindi, and Marathi.
    """
    try:
        tts = gTTS(text=text, lang=language)
        output_tts_path = "output.mp3"
        tts.save(output_tts_path)
        print("Playing synthesized speech...")
        display(Audio(output_tts_path, autoplay=True))  # Play in Colab
    except Exception as e:
        print("Error in text-to-speech:", e)

def process_file(input_path, language="en"):
    """
    Processes an audio or video file: extracts audio, transcribes it, and converts the transcription to speech.
    Returns the transcribed text.
    """
    audio_path = extract_audio(input_path)
    
    if audio_path:
        transcript = transcribe_audio(audio_path, language=language)
        
        if transcript:
            print(f"Transcription ({language}):", transcript)
            text_to_speech(transcript, language=language)
            return transcript  # Return transcription for further use
        else:
            print("Transcription failed.")
            return None
    else:
        print("Audio extraction failed.")
        return None

# Example usage: Process Hindi or Marathi audio/video
transcribed_text = process_file("/marathi_text.mp4", language="mr")  # Change language as needed
print("Final Transcription:", transcribed_text)
