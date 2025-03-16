import cv2
import dlib
import numpy as np
from scipy.spatial import distance
from deepface import DeepFace
from numpy.linalg import norm

# IMPORTANT: The model file "shape_predictor_68_face_landmarks.dat" is NOT included in this repository.
# Due to its large size (~99MB), it must be downloaded manually from the official dlib site:
# Download Link: http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2
# 
# To download and extract the model, run the following commands in the terminal:
# 
# wget http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2
# bzip2 -d shape_predictor_68_face_landmarks.dat.bz2
# 
# After downloading, ensure the .dat file is in the same directory as this script.

# Load the face landmark predictor (Ensure the .dat file is present)

def eye_aspect_ratio(eye):
    A = distance.euclidean(eye[1], eye[5])
    B = distance.euclidean(eye[2], eye[4])
    C = distance.euclidean(eye[0], eye[3])
    return (A + B) / (2.0 * C)

# Load face detector and landmark predictor
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("/content/shape_predictor_68_face_landmarks.dat")

# Eye landmark points
(left_start, left_end) = (42, 48)
(right_start, right_end) = (36, 42)

# Liveness detection function
def is_live_video(video_path, ear_threshold=0.25, min_blinks=3, frame_check=100):
    cap = cv2.VideoCapture(video_path)
    blink_count = 0
    total_frames = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        total_frames += 1
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = detector(gray)

        for face in faces:
            landmarks = predictor(gray, face)
            left_eye = np.array([(landmarks.part(n).x, landmarks.part(n).y) for n in range(left_start, left_end)])
            right_eye = np.array([(landmarks.part(n).x, landmarks.part(n).y) for n in range(right_start, right_end)])

            left_ear = eye_aspect_ratio(left_eye)
            right_ear = eye_aspect_ratio(right_eye)
            ear = (left_ear + right_ear) / 2.0

            if ear < ear_threshold:
                blink_count += 1
        
        if total_frames % frame_check == 0:
            cap.release()
            return blink_count >= min_blinks

    cap.release()
    return False

def extract_frames(video_path, sample_rate=1):
    cap = cv2.VideoCapture(video_path)
    frames = []
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_interval = int(fps * sample_rate)
    count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if count % frame_interval == 0:
            frames.append(frame)
        count += 1
    cap.release()
    return frames

def get_video_embedding_facenet(video_path, model_name="Facenet"):
    frames = extract_frames(video_path, sample_rate=1)
    if len(frames) == 0:
        raise ValueError("No frames extracted. Check the video file or sample rate.")

    embeddings = []
    for frame in frames:
        try:
            emb_list = DeepFace.represent(frame, model_name=model_name, enforce_detection=False)
            if emb_list and len(emb_list) > 0:
                embeddings.append(np.array(emb_list[0]['embedding']))
        except:
            pass

    if len(embeddings) == 0:
        return None
    return np.mean(embeddings, axis=0)

def get_face_embedding(image_path, model_name="Facenet"):
    emb_list = DeepFace.represent(img_path=image_path, model_name=model_name, enforce_detection=False)
    if emb_list and len(emb_list) > 0:
        return np.array(emb_list[0]['embedding'])
    return None

def cosine_similarity(vec1, vec2):
    return np.dot(vec1, vec2) / (norm(vec1) * norm(vec2))

if __name__ == "__main__":
    video_file = "/content/reference.mp4"
    image_file = "/content/reference.jpeg"

    # Step 1: Perform Liveness Detection
    if is_live_video(video_file):
        print("Liveness Check Passed: Video is Real")
        
        # Step 2: Perform Facial Recognition
        video_embedding = get_video_embedding_facenet(video_file, model_name="Facenet")
        face_embedding = get_face_embedding(image_file, model_name="Facenet")
        
        if video_embedding is None:
            print("No embedding extracted for the video.")
        elif face_embedding is None:
            print("No embedding extracted for the image.")
        else:
            similarity = cosine_similarity(video_embedding, face_embedding)
            if similarity > 0.5:
                print("Result: Match")
            else:
                print("Result: No Match")
    else:
        print("Liveness Check Failed: Spoof Detected!")
