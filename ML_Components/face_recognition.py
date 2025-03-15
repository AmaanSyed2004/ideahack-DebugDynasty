from deepface import DeepFace
import numpy as np
import cv2
from sklearn.metrics.pairwise import cosine_similarity

def get_face_embedding(image_path, model_name="Facenet"):
    
    try:
        # Load OpenCV face detector
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

        # Read image and convert to grayscale
        img = cv2.imread(image_path)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Detect faces using OpenCV
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        # Strict Face Detection Check
        if len(faces) == 0:
            print("⚠️ No human face detected. Please make sure you are facing the front camera clearly.")
            return None
        elif len(faces) > 1:
            print(f"⚠️ Multiple human faces detected ({len(faces)}). Please ensure only one person is facing the camera.")
            return None

        # Extract embeddings
        embeddings = DeepFace.represent(img_path=image_path, model_name=model_name, enforce_detection=False)

        return np.array(embeddings[0]['embedding'])

    except Exception as e:
        print(f"❌ Error processing video frame: {str(e)}")
        return None

def compare_faces(img1_path, img2_path, threshold=0.5):

    embedding1 = get_face_embedding(img1_path)
    embedding2 = get_face_embedding(img2_path)

    if embedding1 is None or embedding2 is None:
        return "❌ Face detection failed for one or both images."

    # Calculate using cosine similarity
    similarity = cosine_similarity([embedding1], [embedding2])[0][0]

    print(f"🔍 Similarity Score: {similarity:.4f}")

    if similarity >= threshold:
        return "✅ Same person"
    else:
        return "❌ Different persons"

#change file path
img1 = "/content/reference.jpeg"   
img2 = "/content/reference.jpeg"        

result = compare_faces(img1, img2)
print(result)
