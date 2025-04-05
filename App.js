// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import TabNavigator from "./navigation/TabNavigator";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ProductProvider } from "./contexts/ProductContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            <NavigationContainer>
              <TabNavigator />
              <StatusBar style="auto" />
            </NavigationContainer>
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
