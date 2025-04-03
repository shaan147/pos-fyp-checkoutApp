// services/imageRecog/imageRecognitionService.js
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { IMAGE_RECOGNITION_URL } from '../../constants/ApiConstants';

class ImageRecognitionService {
  // Recognize product from image
  async recognizeProduct(imageUri) {
    try {
      // First compress the image to reduce upload size
      const compressedImage = await this.compressImage(imageUri);
      
      // Create form data for the image upload
      const formData = new FormData();
      formData.append('image', {
        uri: compressedImage,
        name: 'product_image.jpg',
        type: 'image/jpeg',
      });

      // Send the image to recognition service
      const response = await fetch(IMAGE_RECOGNITION_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Parse the response
      const data = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          ...data
        };
      } else {
        return {
          success: false,
          error: data.error || 'Failed to recognize product'
        };
      }
    } catch (error) {
      console.error('Error recognizing product:', error);
      return {
        success: false,
        error: error.message || 'An error occurred during image recognition'
      };
    }
  }

  // Helper function to compress image
  async compressImage(uri) {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      
      // If the image is already small, don't compress
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }
      
      if (fileInfo.size && fileInfo.size < 300000) {
        return uri;
      }

      // Determine the compression quality based on file size
      let quality = 0.8;
      if (fileInfo.size && fileInfo.size > 1000000) {
        quality = 0.5;
      } else if (fileInfo.size && fileInfo.size > 500000) {
        quality = 0.7;
      }

      // Use ImageManipulator for compression
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [], // no operations like resize or rotate
        {
          compress: quality,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );
      
      return result.uri;
    } catch (error) {
      console.error('Error compressing image:', error);
      return uri; // Return original URI if compression fails
    }
  }
}

export const imageRecognitionService = new ImageRecognitionService();

export default imageRecognitionService;