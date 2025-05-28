#!/usr/bin/env python3
"""
E-Voting System - Bilingual Voice Narration Generator
=====================================================

This script generates MP3 voice narration files for the React E-Voting system
using Google Cloud Text-to-Speech API with Hindi and English mixed content.

Requirements:
- pip install google-cloud-texttospeech
- Google Cloud service account JSON key file
- Proper Google Cloud project setup with Text-to-Speech API enabled

Author: E-Voting System Team
"""

import os
import logging
from pathlib import Path
from google.cloud import texttospeech
from google.api_core import exceptions as gcp_exceptions

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class VoiceNarrationGenerator:
    """
    Generates bilingual voice narration MP3 files for E-Voting system
    using Google Cloud Text-to-Speech API.
    """
    
    def __init__(self, service_account_path="./service-account.json", output_dir="./Client/public/audio/"):
        """
        Initialize the voice narration generator.
        
        Args:
            service_account_path (str): Path to Google Cloud service account JSON file
            output_dir (str): Output directory for MP3 files
        """
        self.service_account_path = service_account_path
        self.output_dir = Path(output_dir)
        self.client = None
        
        # Voice configurations
        self.primary_voice_config = {
            "language_code": "hi-IN",
            "name": "hi-IN-Wavenet-C",  # Female Hindi voice
            "ssml_gender": texttospeech.SsmlVoiceGender.FEMALE
        }
        
        self.fallback_voice_config = {
            "language_code": "en-US", 
            "name": "en-US-Wavenet-F",  # Female English voice
            "ssml_gender": texttospeech.SsmlVoiceGender.FEMALE
        }
        
        # Audio configuration for MP3 output
        self.audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3,
            speaking_rate=0.9,  # Slightly slower for clarity
            pitch=0.0,
            volume_gain_db=0.0
        )
        
        # Define narration texts for each step
        self.narration_texts = {
            "step1_landing.mp3": (
                "Welcome to the E-Voting System. Please click on 'Election' to cast a vote. "
                "ई-वोटिंग सिस्टम में आपका स्वागत है। वोट देने के लिए 'Election' पर क्लिक करें।"
            ),
            "step2_camera.mp3": (
                "Please look at the camera. कृपया कैमरे की ओर देखें।"
            ),
            "step3_confirm.mp3": (
                "Confirm your identity by clicking 'Confirm' or 'Not Me'. "
                "कृपया 'Confirm' या 'Not Me' पर क्लिक करके अपनी पहचान की पुष्टि करें।"
            ),
            "step4_vote.mp3": (
                "Cast your vote for your preferred candidate in this election. "
                "For casting a vote, click on the Vote button. "
                "अपने पसंदीदा उम्मीदवार को वोट दें। वोट देने के लिए 'Vote' बटन पर क्लिक करें।"
            ),
            "step5_verify.mp3": (
                "Please Click on the Vote Button for Secure Voting. "
                "कृपया 'Vote' बटन पर क्लिक करके सुरक्षित वोट दें।"
            ),
            "step6_thankyou.mp3": (
                "Please confirm to cast your vote. Thank you. "
                "वोट डालने के लिए कृपया पुष्टि करें। धन्यवाद।"
            )
        }
    
    def setup_authentication(self):
        """
        Set up Google Cloud authentication using service account key.
        """
        try:
            if not os.path.exists(self.service_account_path):
                raise FileNotFoundError(f"Service account file not found: {self.service_account_path}")
            
            # Set environment variable for authentication
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = self.service_account_path
            
            # Initialize the Text-to-Speech client
            self.client = texttospeech.TextToSpeechClient()
            logger.info("✅ Google Cloud Text-to-Speech client initialized successfully")
            
        except Exception as e:
            logger.error(f"❌ Failed to setup Google Cloud authentication: {str(e)}")
            raise
    
    def create_output_directory(self):
        """
        Create the output directory if it doesn't exist.
        """
        try:
            self.output_dir.mkdir(parents=True, exist_ok=True)
            logger.info(f"📁 Output directory ready: {self.output_dir}")
        except Exception as e:
            logger.error(f"❌ Failed to create output directory: {str(e)}")
            raise
    
    def generate_speech(self, text, filename, use_fallback=False):
        """
        Generate speech audio for given text and save as MP3.
        
        Args:
            text (str): Text to convert to speech
            filename (str): Output filename
            use_fallback (bool): Whether to use fallback English voice
        
        Returns:
            bool: Success status
        """
        try:
            # Choose voice configuration
            voice_config = self.fallback_voice_config if use_fallback else self.primary_voice_config
            
            # Prepare the synthesis input
            synthesis_input = texttospeech.SynthesisInput(text=text)
            
            # Configure voice
            voice = texttospeech.VoiceSelectionParams(
                language_code=voice_config["language_code"],
                name=voice_config["name"],
                ssml_gender=voice_config["ssml_gender"]
            )
            
            # Make the Text-to-Speech request
            response = self.client.synthesize_speech(
                input=synthesis_input,
                voice=voice,
                audio_config=self.audio_config
            )
            
            # Save the audio content to file
            output_path = self.output_dir / filename
            with open(output_path, "wb") as audio_file:
                audio_file.write(response.audio_content)
            
            voice_type = "Fallback English" if use_fallback else "Primary Hindi"
            logger.info(f"🎵 Generated: {filename} using {voice_type} voice ({voice_config['name']})")
            return True
            
        except gcp_exceptions.InvalidArgument as e:
            logger.warning(f"⚠️  Invalid argument for {filename}: {str(e)}")
            return False
        except gcp_exceptions.PermissionDenied as e:
            logger.error(f"❌ Permission denied for {filename}: {str(e)}")
            return False
        except Exception as e:
            logger.error(f"❌ Unexpected error generating {filename}: {str(e)}")
            return False
    
    def generate_all_narrations(self):
        """
        Generate all voice narration files for the E-Voting system.
        """
        logger.info("🚀 Starting bilingual voice narration generation for E-Voting System")
        
        success_count = 0
        total_files = len(self.narration_texts)
        
        for filename, text in self.narration_texts.items():
            logger.info(f"🔄 Processing: {filename}")
            
            # Try with primary Hindi voice first
            success = self.generate_speech(text, filename, use_fallback=False)
            
            # If primary voice fails, try with fallback English voice
            if not success:
                logger.warning(f"🔄 Retrying {filename} with fallback English voice...")
                success = self.generate_speech(text, filename, use_fallback=True)
            
            if success:
                success_count += 1
            else:
                logger.error(f"❌ Failed to generate {filename} with both voice configurations")
        
        # Summary
        logger.info(f"\n📊 Generation Summary:")
        logger.info(f"✅ Successfully generated: {success_count}/{total_files} files")
        logger.info(f"📂 Output location: {self.output_dir.absolute()}")
        
        if success_count == total_files:
            logger.info("🎉 All voice narration files generated successfully!")
        else:
            logger.warning(f"⚠️  {total_files - success_count} files failed to generate")
        
        return success_count == total_files
    
    def run(self):
        """
        Main execution method.
        """
        try:
            logger.info("🎯 E-Voting System Voice Narration Generator")
            logger.info("=" * 50)
            
            # Setup authentication
            self.setup_authentication()
            
            # Create output directory
            self.create_output_directory()
            
            # Generate all narration files
            success = self.generate_all_narrations()
            
            if success:
                logger.info("\n🎊 Voice narration generation completed successfully!")
                logger.info("🔗 You can now use these MP3 files in your React E-Voting application")
            else:
                logger.error("\n💥 Voice narration generation completed with errors!")
                
        except Exception as e:
            logger.error(f"💥 Critical error: {str(e)}")
            raise


def main():
    """
    Main function to run the voice narration generator.
    """
    try:
        # Initialize generator with paths
        generator = VoiceNarrationGenerator(
            service_account_path="./service-account.json",
            output_dir="./Client/public/audio/"
        )
        
        # Run the generation process
        generator.run()
        
    except KeyboardInterrupt:
        print("\n🛑 Process interrupted by user")
    except Exception as e:
        print(f"\n💥 Fatal error: {str(e)}")
        print("Please check your Google Cloud setup and try again.")


if __name__ == "__main__":
    print("🇮🇳 E-Voting System - Bilingual Voice Narration Generator")
    print("🎵 Generating Hindi-English MP3 files using Google Cloud TTS")
    print("-" * 60)
    main() 