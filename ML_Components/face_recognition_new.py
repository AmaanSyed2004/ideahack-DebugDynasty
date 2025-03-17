from deepface import DeepFace
import cv2
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def get_arcface_embedding(image_array):
    """
    Extracts a face embedding from an image using DeepFace's ArcFace model.
    
    Args:
        image_array (numpy.ndarray): The input image as a NumPy array.

    Returns:
        list or dict: The face embedding vector, or an error message if no face is found.
    """
    try:
        # Convert NumPy array to BGR format (DeepFace expects a file path, so we provide the image directly)
        img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

        # Extract embeddings using DeepFace
        embeddings = DeepFace.represent(
            img_path=img,
            model_name="ArcFace",
            detector_backend="retinaface",
            enforce_detection=True
        )

        if not embeddings:
            return {"error": "No face detected."}

        return embeddings[0]['embedding']
    
    except Exception as e:
        return {"error": f"Failed to process image: {str(e)}"}

def compare_face_and_embedding(embedding, image_array, threshold=0.5):
    """
    Compares a stored face embedding with a new image using cosine similarity.
    
    Args:
        embedding (list): The stored embedding from the database.
        image_array (numpy.ndarray): The input image as a NumPy array.
        threshold (float): Similarity threshold for a match.

    Returns:
        dict: Match result and similarity score.
    """
    new_embedding = get_arcface_embedding(image_array)

    if isinstance(new_embedding, dict) and "error" in new_embedding:
        return new_embedding  # Return the error message

    # Compute cosine similarity
    similarity_score = cosine_similarity([embedding], [new_embedding])[0][0]

    return {
    "is_match": bool(similarity_score >= threshold),
    "similarity": float(similarity_score)
}
