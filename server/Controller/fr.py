import cv2
import face_recognition
import numpy as np
import os
import sys
import time
from encoded import encoded_face_train,classNames

def release_camera(cap):
    if cap is not None:
        cap.release()
        cv2.destroyAllWindows()

try:
    # Check if the Faces directory exists and has files
    faces_dir = "D:\\Blockchain(3)\\E-Voting-System-Using-Blockchain\\server\\Faces"
    if not os.path.exists(faces_dir) or len(os.listdir(faces_dir)) == 0:
        print("Error: Faces directory is empty or does not exist")
        sys.exit(1)

    # Initialize camera with retries
    cap = None
    max_retries = 3
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            if cap is not None:
                release_camera(cap)
            time.sleep(1)  # Wait before retrying
            cap = cv2.VideoCapture(0)
            if cap.isOpened():
                break
            retry_count += 1
        except Exception as e:
            print(f"Attempt {retry_count + 1} failed: {str(e)}")
            retry_count += 1
            
    if not cap or not cap.isOpened():
        print("Error: Could not open camera after multiple attempts")
        sys.exit(1)
        
    # Set window properties
    window_name = 'Face Recognition'
    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
    
    # Get screen resolution and set window size to 75% of screen
    screen_width = 1280  # Default full HD width
    screen_height = 720  # Default full HD height
    window_width = int(screen_width * 0.75)
    window_height = int(screen_height * 0.75)
    
    # Set camera resolution
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, window_width)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, window_height)
    
    # Position window in center of screen
    cv2.resizeWindow(window_name, window_width, window_height)
    cv2.moveWindow(window_name, (screen_width - window_width) // 2, (screen_height - window_height) // 2)
    
    # Enhanced recognition settings
    flag = 0
    ans = []
    index = 0
    confidence_scores = []
    
    while True:
        index += 1
        if index == 50:  # Reduced from 500 to 50 for faster processing
            print("No face detected within the time limit")
            break
            
        success, img = cap.read()
        
        # Check if frame was captured successfully
        if not success or img is None:
            print("Error: Failed to capture image from camera")
            continue
            
        try:
            imgS = cv2.resize(img, (0, 0), None, 0.25, 0.25)
            imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)
            
            # Detect faces in the frame
            faces_in_frame = face_recognition.face_locations(imgS)
            
            if not faces_in_frame:
                # Show the frame even when no face is detected
                cv2.putText(img, "No face detected - Please look at the camera", 
                          (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                cv2.imshow(window_name, img)
                cv2.waitKey(1)
                continue
                
            encoded_faces = face_recognition.face_encodings(imgS, faces_in_frame)
            
            for encode_face, faceloc in zip(encoded_faces, faces_in_frame):
                matches = face_recognition.compare_faces(encoded_face_train, encode_face, tolerance=0.5)
                faceDist = face_recognition.face_distance(encoded_face_train, encode_face)
                
                if len(faceDist) > 0:  # Make sure we have face distances to compare
                    matchIndex = np.argmin(faceDist)
                    confidence = 1.0 - faceDist[matchIndex]
                    confidence_scores.append(confidence)
                    
                    if matches[matchIndex]:
                        # Add match with confidence score
                        ans.append(classNames[matchIndex])
                        # Draw rectangle around face (helps with visual feedback)
                        y1, x2, y2, x1 = [coord * 4 for coord in faceloc]
                        cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
                        cv2.putText(img, f"{classNames[matchIndex]} ({confidence:.2f})", 
                                   (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
                        flag += 1
                        break
                        
            # Show the processed image with face detection
            cv2.imshow(window_name, img)
            cv2.setWindowProperty(window_name, cv2.WND_PROP_TOPMOST, 1)
            cv2.waitKey(1)
                
            if flag == 5:  # Reduced from 10 to 5
                if ans:
                    matched_name = max(set(ans), key=ans.count)
                    # Calculate average confidence score for the best match
                    avg_confidence = sum([s for s in confidence_scores]) / len(confidence_scores) if confidence_scores else 0
                    print(f"{matched_name}|{avg_confidence:.4f}|verified")
                else:
                    print("No matching face found|0.0000|failed")
                break
                
        except Exception as e:
            print(f"Error processing frame: {str(e)}")
            continue
            
except Exception as e:
    print(f"Fatal error: {str(e)}")
    sys.exit(1)
finally:
    # Always release the camera
    release_camera(cap)
