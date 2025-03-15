import cv2
import numpy as np
from deepface import DeepFace
from numpy.linalg import norm

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
    """
    Use DeepFace Facenet to get a single 128-dim embedding from a video.
    We detect the face in each frame (enforce_detection=False if faces may be missing).
    Then average the embeddings to get a final 128-dim vector.
    """
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
        return None  # no faces found at all
    video_embedding = np.mean(embeddings, axis=0)
    return video_embedding

def get_face_embedding(image_path, model_name="Facenet"):
    """
    Extracts the face embedding from an input image using DeepFace.
    """
    emb_list = DeepFace.represent(img_path=image_path, model_name=model_name, enforce_detection=False)
    if emb_list and len(emb_list) > 0:
        return np.array(emb_list[0]['embedding'])
    return None

def cosine_similarity(vec1, vec2):
    # Directly calculate cosine similarity
    return np.dot(vec1, vec2) / (norm(vec1) * norm(vec2))

if __name__ == "__main__":
    video_file = "/content/reference.mp4"
    image_file = "/content/reference.jpg"

    video_embedding = get_video_embedding_facenet(video_file, model_name="Facenet")
    face_embedding = get_face_embedding(image_file, model_name="Facenet")

    if video_embedding is None:
        print("No embedding extracted for the video.")
    elif face_embedding is None:
        print("No embedding extracted for the image.")
    else:
        similarity = cosine_similarity(video_embedding, face_embedding)
        # print("Video embedding shape:", video_embedding.shape)
        # print("Face embedding shape:", face_embedding.shape)
        # print("Cosine similarity:", similarity)

        # Determine if it's a match or not based on the similarity threshold (0.5)
        if similarity > 0.5:
            print("Result: Match")
        else:
            print("Result: No Match")
