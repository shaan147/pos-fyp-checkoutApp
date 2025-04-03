// components/cart/EmptyCart.js
import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export function EmptyCart() {
  const navigation = useNavigation();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.cartIcon}>🛒</Text>
        </View>
        <ThemedText type="subtitle" style={styles.title}>
          Your cart is empty
        </ThemedText>
        <ThemedText style={styles.description}>
          Add items to your cart by scanning products or browsing the app
        </ThemedText>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Scanner")}
        >
          <Text style={styles.buttonText}>Start Scanning</Text>
        </TouchableOpacity>
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
  content: {
    alignItems: "center",
    maxWidth: 300,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E0F2FE", // primary-100
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  cartIcon: {
    fontSize: 32,
  },
  title: {
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    marginBottom: 24,
    color: "#4B5563", // gray-600
  },
  button: {
    backgroundColor: "#0284c7", // primary-600
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
