// components/cart/CartItem.js
import React from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { useCart } from "../../contexts/CartContext";
import { ThemedText } from "../ThemedText";

export function CartItem({ item }) {
  const { updateItemQuantity, removeItem } = useCart();
  const { product, quantity, subtotal } = item;

  const handleIncrement = () => {
    if (quantity < product.stockQuantity) {
      updateItemQuantity(product._id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateItemQuantity(product._id, quantity - 1);
    } else {
      removeItem(product._id);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {product.images && product.images.length > 0 ? (
          <Image source={{ uri: product.images[0] }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <ThemedText>No Image</ThemedText>
          </View>
        )}
      </View>

      <View style={styles.detailsContainer}>
        <ThemedText style={styles.name}>{product.name}</ThemedText>
        <ThemedText style={styles.price}>
          ₨{product.price.toFixed(2)}
        </ThemedText>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={handleDecrement}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>

          <ThemedText style={styles.quantityText}>{quantity}</ThemedText>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={handleIncrement}
            disabled={quantity >= product.stockQuantity}
          >
            <Text
              style={[
                styles.quantityButtonText,
                quantity >= product.stockQuantity && styles.disabledButton,
              ]}
            >
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.subtotalContainer}>
        <ThemedText style={styles.subtotal}>₨{subtotal.toFixed(2)}</ThemedText>
        <TouchableOpacity onPress={() => removeItem(product._id)}>
          <ThemedText style={styles.removeText}>Remove</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    resizeMode: "cover",
  },
  // components/cart/CartItem.js (continued)
  placeholderImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: "#4B5563", // gray-600
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 28,
    height: 28,
    backgroundColor: "#F3F4F6", // gray-100
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0284c7", // primary-600
  },
  disabledButton: {
    color: "#9CA3AF", // gray-400
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
  },
  subtotalContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    width: 80,
  },
  subtotal: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  removeText: {
    fontSize: 12,
    color: "#DC2626", // danger-600
  },
});
