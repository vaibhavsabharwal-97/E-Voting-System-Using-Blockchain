import face_recognition
import os
import cv2
import numpy as np
import sys

try:
    path = "D:\\Blockchain(3)\\E-Voting-System-Using-Blockchain\\server\\Faces"

    # Check if directory exists
    if not os.path.exists(path):
        print(f"Error: Directory {path} does not exist")
        sys.exit(1)
        
    # Get list of files in the directory
    files = os.listdir(path)
    
    if not files:
        print(f"Error: No files found in {path}")
        sys.exit(1)
        
    classNames = []
    images = []
    
    # Load images and extract class names
    for file in files:
        try:
            img_path = os.path.join(path, file)
            img = cv2.imread(img_path)
            
            if img is None:
                print(f"Warning: Could not load image {img_path}")
                continue
                
            images.append(img)
            classNames.append(os.path.splitext(file)[0])
        except Exception as e:
            print(f"Error loading image {file}: {str(e)}")
            
    if not images:
        print("Error: No valid images could be loaded")
        sys.exit(1)
        
    def findEncodings(images):
        encodeList = []
        for i, img in enumerate(images):
            try:
                img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                face_encodings = face_recognition.face_encodings(img)
                
                if face_encodings:
                    encoded_face = face_encodings[0]
                    encodeList.append(encoded_face)
                else:
                    print(f"Warning: No face detected in image for {classNames[i]}")
            except Exception as e:
                print(f"Error encoding face for {classNames[i]}: {str(e)}")
                
        return encodeList
        
    encoded_face_train = findEncodings(images)
    
    if not encoded_face_train:
        print("Error: No faces could be encoded from the provided images")
        sys.exit(1)
        
    print(f"Loaded {len(encoded_face_train)} face encodings successfully")
    
except Exception as e:
    print(f"Fatal error in encoded.py: {str(e)}")
    sys.exit(1)