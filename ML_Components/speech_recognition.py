from resemblyzer import VoiceEncoder, preprocess_wav
from scipy.spatial.distance import cosine
import numpy as np
from speechbrain.inference.speaker import SpeakerRecognition
import io
import soundfile as sf
import os
import tempfile
import torch
import torch.nn.functional as F
# # ---------- Step 1: Update Your Audio File Paths ----------
# # ⚠️ Update these paths with the correct filenames you uploaded to Colab
# reference_audio_path = ""  # Reference voice sample
# test_audio_path = ""  # Test voice sample

# # ---------- Step 2: Speaker Verification using Resemblyzer ----------

# # Initialize Resemblyzer encoder
# encoder = VoiceEncoder()

# # Load and preprocess the audio files
# wav_ref = preprocess_wav(reference_audio_path)
# wav_test = preprocess_wav(test_audio_path)

# # Compute speaker embeddings
# embedding_ref = encoder.embed_utterance(wav_ref)
# embedding_test = encoder.embed_utterance(wav_test)

# # Compute cosine similarity for speaker verification
# cosine_sim = 1 - cosine(embedding_ref, embedding_test)
# print("🔹 Resemblyzer Cosine Similarity:", cosine_sim)

# # ---------- Step 3: Speaker Verification using SpeechBrain ----------

# # Load SpeechBrain speaker recognition model
# verification = SpeakerRecognition.from_hparams(
#     source="speechbrain/spkrec-ecapa-voxceleb",
#     savedir="pretrained_models/spkrec-ecapa-voxceleb"
# )

# # Compare the two audio files using SpeechBrain
# score, prediction = verification.verify_files(reference_audio_path, test_audio_path)

# # Convert SpeechBrain's score to a similarity score (higher = more similar)
# sim_sbrain = 1 / (1 + score)
# print("🔹 Normalized SpeechBrain Similarity:", sim_sbrain)

# # ---------- Step 4: Combine Scores for Higher Accuracy ----------

# # Average the scores from both models
# combined_score = (cosine_sim + sim_sbrain) / 2
# print("🔹 Combined Similarity Score:", combined_score)

# # Set a threshold for matching (experiment with this value for best results)
# threshold = 0.8  # Adjust based on your dataset

# # Final decision
# if combined_score >= threshold:
#     print("✅ Match: The voices belong to the same speaker.")
# else:
#     print("❌ No Match: The voices are different.")
    

def get_voice_embedding(audio_file:bytes) -> np.ndarray:
    audio_stream = io.BytesIO(audio_file)
    wav, sr = sf.read(audio_stream)

    wav = preprocess_wav(wav, source_sr=sr)
    encoder= VoiceEncoder()
    embedding = encoder.embed_utterance(wav)
    return embedding

def compare_voice_and_embedding(embedding:np.ndarray, audio_file:bytes) -> float:
    savedir = os.path.join(tempfile.gettempdir(), "spkrec_model")
    os.makedirs(savedir, exist_ok=True)
    audio_stream = io.BytesIO(audio_file)
    wav, sr = sf.read(audio_stream)
    wav = preprocess_wav(wav, source_sr=sr)
    encoder= VoiceEncoder()
    embedding_test = encoder.embed_utterance(wav)
    cosine_sim = 1 - cosine(embedding, embedding_test)
    embedding1 = torch.tensor(embedding, dtype=torch.float32)
    embedding2 = torch.tensor(embedding_test, dtype=torch.float32)
    score= F.cosine_similarity(embedding1.unsqueeze(0), embedding2.unsqueeze(0))
    combined_score = (cosine_sim + score) / 2
    threshold = 0.8
    if combined_score < threshold:
        return {"is_match": False, "combined_score": combined_score}
    else:
        return {"is_match": True, "combined_score": combined_score}