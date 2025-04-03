// components/camera/ProductRecognizer.js
import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export function ProductRecognizer({ product, isLoading, error, onAddToCart, onRetry }) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0284c7" />
        <ThemedText style={styles.loadingText}>
          Recognizing product...
        </ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.notFoundText}>Product not found</ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.productCard}>
        <View style={styles.imageContainer}>
          {product.images && product.images.length > 0 ? (
            <Image
              source={{ uri: product.images[0] }}
              style={styles.productImage}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <ThemedText>No Image</ThemedText>
            </View>
          )}
        </View>

        <View style={styles.productInfo}>
          <ThemedText style={styles.productName}>{product.name}</ThemedText>
          <ThemedText style={styles.productPrice}>
            ₨{product.price.toFixed(2)}
          </ThemedText>

          {product.description && (
            <ThemedText style={styles.productDescription}>
              {product.description}
            </ThemedText>
          )}

          <View style={styles.stockInfo}>
            <ThemedText>Stock: </ThemedText>
            <View
              style={[
                styles.stockBadge,
                product.stockQuantity > 0
                  ? styles.inStockBadge
                  : styles.outOfStockBadge,
              ]}
            >
              <Text style={styles.stockBadgeText}>
                {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.addButton]}
            onPress={onAddToCart}
            disabled={product.stockQuantity <= 0}
          >
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.scanMoreButton]}
            onPress={onRetry}
          >
            <Text style={styles.scanMoreButtonText}>Scan More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: "#DC2626", // danger-600
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  notFoundText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#0284c7", // primary-600
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  productCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    resizeMode: "contain",
  },
  placeholderImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    marginBottom: 20,
  },
  productName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0284c7", // primary-600
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 16,
    color: "#4B5563", // gray-600
    marginBottom: 16,
  },
  stockInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inStockBadge: {
    backgroundColor: "#DCFCE7", // success-100
  },
  outOfStockBadge: {
    backgroundColor: "#FEE2E2", // danger-100
  },
  stockBadgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  actionButtons: {
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#0284c7", // primary-600
  },
  scanMoreButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#0284c7", // primary-600
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  scanMoreButtonText: {
    color: "#0284c7", // primary-600
    fontSize: 16,
    fontWeight: "600",
  },
});