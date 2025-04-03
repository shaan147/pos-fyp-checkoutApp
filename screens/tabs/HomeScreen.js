// screens/tabs/HomeScreen.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useAuth } from '../../contexts/AuthContext';
import { useProduct } from '../../contexts/ProductContext';
import { Text } from 'react-native';

export default function HomeScreen() {
  const { user, isGuest } = useAuth();
  const { recentProducts } = useProduct();
  const navigation = useNavigation();

  const navigateToScanner = () => {
    navigation.navigate('Scanner');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <ThemedText type="title">
              Welcome, {isGuest ? 'Guest' : user?.name?.split(' ')[0]}!
            </ThemedText>
            <ThemedText>Start your self-checkout journey</ThemedText>
          </View>
        </View>

        <View style={styles.actionCard}>
          <ThemedText type="subtitle">Scan & Shop</ThemedText>
          <ThemedText>
            Quickly scan products with your camera to add them to your cart
          </ThemedText>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={navigateToScanner}
          >
            <Text style={styles.scanButtonText}>Start Scanning</Text>
          </TouchableOpacity>
        </View>

        {recentProducts.length > 0 && (
          <View style={styles.recentSection}>
            <ThemedText type="subtitle">Recently Scanned</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentList}>
              {recentProducts.map((product) => (
                <TouchableOpacity 
                  key={product._id} 
                  style={styles.recentItem}
                  onPress={() => navigation.navigate('ProductDetail', { productId: product._id })}
                >
                  <View style={styles.productImage}>
                    {product.images && product.images.length > 0 ? (
                      <Image source={{ uri: product.images[0] }} style={styles.image} />
                    ) : (
                      <View style={styles.imagePlaceholder}>
                        <ThemedText>No Image</ThemedText>
                      </View>
                    )}
                  </View>
                  <ThemedText style={styles.productName}>{product.name}</ThemedText>
                  <ThemedText style={styles.productPrice}>₨{product.price.toFixed(2)}</ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.infoSection}>
          <ThemedText type="subtitle">How It Works</ThemedText>
          <View style={styles.stepCard}>
            <ThemedText style={styles.stepNumber}>1</ThemedText>
            <View>
              <ThemedText style={styles.stepTitle}>Scan Products</ThemedText>
              <ThemedText>Use your camera to scan product barcodes or images</ThemedText>
            </View>
          </View>
          <View style={styles.stepCard}>
            <ThemedText style={styles.stepNumber}>2</ThemedText>
            <View>
              <ThemedText style={styles.stepTitle}>Review Cart</ThemedText>
              <ThemedText>Check your cart and adjust quantities if needed</ThemedText>
            </View>
          </View>
          <View style={styles.stepCard}>
            <ThemedText style={styles.stepNumber}>3</ThemedText>
            <View>
              <ThemedText style={styles.stepTitle}>Checkout</ThemedText>
              <ThemedText>Complete your purchase and get a digital receipt</ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionCard: {
    backgroundColor: '#E0F2FE', // primary-100
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  scanButton: {
    backgroundColor: '#0284c7', // primary-600
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  recentSection: {
    marginBottom: 24,
  },
  recentList: {
    marginTop: 12,
  },
  recentItem: {
    width: 140,
    marginRight: 12,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productName: {
    fontWeight: '500',
    marginBottom: 4,
    fontSize: 14,
  },
  productPrice: {
    color: '#0284c7', // primary-600
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 32,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0284c7', // primary-600
    color: 'white',
    textAlign: 'center',
    lineHeight: 32,
    marginRight: 12,
    fontWeight: 'bold',
  },
  stepTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
});