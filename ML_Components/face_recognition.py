from deepface import DeepFace
import numpy as np
import cv2
from sklearn.metrics.pairwise import cosine_similarity
from scipy.spatial.distance import euclidean

def get_face_embedding(image_array, model_name="Facenet"):

    try:
        # Load OpenCV face detector
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

        # Read image and convert to grayscale
        img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Detect faces using OpenCV
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        # Strict Face Detection Check
        if len(faces) == 0:
             return {"error": "No human face detected. Please ensure you are facing the front camera clearly."}
        elif len(faces) > 1:
            return {"error": f"Multiple human faces detected ({len(faces)}). Ensure only one person is facing the camera."}

        # Extract embeddings using DeepFace
        embeddings = DeepFace.represent(img_path=img, model_name=model_name, enforce_detection=False)

        return {"embedding": embeddings[0].get('embedding', [])}

    except Exception as e:
        return {"error": f"Error processing image: {str(e)}"}

def compare_faces(img1_path, img2_path, cosine_threshold=0.5, euclidean_threshold=10):

 
    embedding1 = get_face_embedding(img1_path)
    embedding2 = get_face_embedding(img2_path)

    if embedding1 is None or embedding2 is None:
        return "❌ Face detection failed for one or both images."


    #using both cosine and euclidean distance for robusteness
    #cosine compares cos of angle between every vector and its good for checking pattern similarity but ignores scale.
    # Compute Cosine Similarity (higher is better)
    cosine_sim = cosine_similarity([embedding1], [embedding2])[0][0]

    #euclidean uses distance formula and measures the actual distance between two vectors in space checks how far apart the embeddings are but is sensitive to absolute values.
    # Compute Euclidean Distance (lower is better)
    euclidean_dist = euclidean(embedding1, embedding2)

    # Normalize Euclidean to a similarity score (closer to 1 means similar)
    euclidean_sim = 1 / (1 + euclidean_dist)  # Inverse scaling

    # Average the two similarity measures
    avg_similarity = (cosine_sim + euclidean_sim) / 2

    # print(f"🔍 Cosine Similarity: {cosine_sim:.4f}")
    # print(f"🔍 Euclidean Distance: {euclidean_dist:.4f}")
    # print(f"🔍 Normalized Euclidean Similarity: {euclidean_sim:.4f}")
    # print(f"⚖️ Combined Similarity Score: {avg_similarity:.4f}")

    # Decision based on combined similarity score
    if avg_similarity >= cosine_threshold:
        return "✅ Same person"
    else:
        return "❌ Different persons"
