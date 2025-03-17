from deepface import DeepFace
import os
import cv2
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def get_arcface_embedding(image_path, enforce_detection=True):
    """
    Extract the face embedding from an image using the pre-trained ArcFace model
    with RetinaFace as the detector for robust and accurate face detection.
    
    Args:
        image_path (str): Path to the input image.
        enforce_detection (bool): If True, errors if no face is detected.
    
    Returns:
        list: The face embedding vector, or None if no face is found.
    """
    # Check if the file exists first.
    if not os.path.exists(image_path):
        print(f"Error: File '{image_path}' does not exist. Please confirm the path is correct.")
        return None

    try:
        embeddings = DeepFace.represent(
            img_path=image_path, 
            model_name="ArcFace", 
            detector_backend="retinaface", 
            enforce_detection=enforce_detection
        )
        # If DeepFace returns an empty list or does not include an embedding, return None.
        if embeddings is None or len(embeddings) == 0:
            print(f"Error: No face detected in {image_path}.")
            return None
        return embeddings[0].get('embedding', None)
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return None

def compare_images(image_path1, image_path2, threshold=0.5):
    """
    Compare two images using their ArcFace embeddings with cosine similarity.
    
    Args:
        image_path1 (str): Path to the first image.
        image_path2 (str): Path to the second image.
        threshold (float): Cosine similarity threshold for matching.
    """
    emb1 = get_arcface_embedding(image_path1)
    emb2 = get_arcface_embedding(image_path2)

    if emb1 is None or emb2 is None:
        print("Face detection failed for one or both images. Ensure the files exist and contain a clear, frontal face.")
        return

    # Compute cosine similarity (higher is better).
    cosine_sim = cosine_similarity([emb1], [emb2])[0][0]

    print(f"Image 1: {image_path1}")
    print(f"Image 2: {image_path2}")
    print(f"Cosine Similarity: {cosine_sim:.4f}")

    if cosine_sim >= threshold:
        print("Result: ✅ Same person")
    else:
        print("Result: ❌ Different persons")

if __name__ == "__main__":
    # Hard-code your paths here instead of using input().
    image_path1 = "./reference.jpg"    # Replace with your actual path
    image_path2 = "./varnika1.jpeg"    # Replace with your actual path

    compare_images(image_path1, image_path2)
