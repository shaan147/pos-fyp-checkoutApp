// screens/tabs/ScannerScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useProduct } from '../../contexts/ProductContext';
import { useCart } from '../../contexts/CartContext';
import { CameraScanner } from '../../components/camera/CameraScanner';
import { ProductRecognizer } from '../../components/camera/ProductRecognizer';

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedProduct, setScannedProduct] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  
  const { getProductByImage, isLoading, error } = useProduct();
  const { addItem } = useCart();
  const navigation = useNavigation();
  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleScan = async (imageUri) => {
    setIsScanning(true);
    setIsCameraActive(false);

    try {
      const product = await getProductByImage(imageUri);
      if (product) {
        setScannedProduct(product);
      } else {
        // Product not found or recognition failed
        Alert.alert(
          'Product Not Found', 
          'The product could not be recognized. Please try again or scan another product.',
          [
            { text: 'OK', onPress: () => setIsCameraActive(true) }
          ]
        );
      }
    } catch (error) {
      console.error('Error scanning product:', error);
      Alert.alert('Error', 'An error occurred while scanning. Please try again.');
      setIsCameraActive(true);
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddToCart = () => {
    if (scannedProduct) {
      addItem(scannedProduct);
      Alert.alert(
        'Added to Cart',
        `${scannedProduct.name} has been added to your cart.`,
        [
          {
            text: 'Continue Shopping',
            onPress: () => {
              setScannedProduct(null);
              setIsCameraActive(true);
            },
          },
          {
            text: 'Go to Cart',
            onPress: () => navigation.navigate('Cart'),
            style: 'default',
          },
        ]
      );
    }
  };

  const handleRetry = () => {
    setScannedProduct(null);
    setIsCameraActive(true);
  };

  if (hasPermission === null) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#0284c7" />
        <ThemedText style={{ marginTop: 16 }}>Requesting camera permission...</ThemedText>
      </ThemedView>
    );
  }

  if (hasPermission === false) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>No access to camera</ThemedText>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <ThemedText style={styles.buttonText}>Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {isCameraActive ? (
        <CameraScanner onScan={handleScan} />
      ) : (
        <ProductRecognizer 
          product={scannedProduct}
          isLoading={isLoading}
          error={error}
          onAddToCart={handleAddToCart}
          onRetry={handleRetry}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0284c7', // primary-600
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});