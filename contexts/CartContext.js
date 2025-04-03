// contexts/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const { isAuthenticated, user, isGuest } = useAuth();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create a unique cart ID for the session (for guest users)
  const [cartId, setCartId] = useState(null);

  useEffect(() => {
    const initCart = async () => {
      setIsLoading(true);
      try {
        // Generate or load cart ID for guest users
        if (isGuest) {
          let savedCartId = await AsyncStorage.getItem("guestCartId");
          if (!savedCartId) {
            savedCartId = `guest_${Date.now()}_${Math.random()
              .toString(36)
              .substring(2, 9)}`;
            await AsyncStorage.setItem("guestCartId", savedCartId);
          }
          setCartId(savedCartId);
        } else if (isAuthenticated && user) {
          // Use user ID as cart ID for authenticated users
          setCartId(user._id);
        }

        // Load cart items from storage
        if (cartId) {
          const savedCart = await AsyncStorage.getItem(`cart_${cartId}`);
          if (savedCart) {
            setItems(JSON.parse(savedCart));
          }
        }
      } catch (error) {
        console.error("Error initializing cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initCart();
  }, [isAuthenticated, user, isGuest, cartId]);

  // Save cart to storage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      if (cartId && items.length > 0) {
        try {
          await AsyncStorage.setItem(`cart_${cartId}`, JSON.stringify(items));
        } catch (error) {
          console.error("Error saving cart:", error);
        }
      }
    };

    if (!isLoading) {
      saveCart();
    }
  }, [items, cartId, isLoading]);

  const addItem = (product, quantity = 1) => {
    setItems((prevItems) => {
      // Check if product is already in cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product._id === product._id
      );

      if (existingItemIndex !== -1) {
        // Update quantity if product already exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
          subtotal:
            (updatedItems[existingItemIndex].quantity + quantity) *
            product.price,
        };
        return updatedItems;
      } else {
        // Add new item if product doesn't exist in cart
        return [
          ...prevItems,
          {
            product,
            quantity,
            price: product.price,
            subtotal: quantity * product.price,
          },
        ];
      }
    });
  };

  const updateItemQuantity = (productId, quantity) => {
    setItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.product._id === productId) {
            return {
              ...item,
              quantity,
              subtotal: quantity * item.price,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0); // Remove items with quantity 0
    });
  };

  const removeItem = (productId) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.product._id !== productId)
    );
  };

  const clearCart = async () => {
    setItems([]);
    if (cartId) {
      try {
        await AsyncStorage.removeItem(`cart_${cartId}`);
      } catch (error) {
        console.error("Error clearing cart from storage:", error);
      }
    }
  };

  const getTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const taxRate = 0.17; // 17% GST
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return { subtotal, tax, total, itemCount };
  };

  const value = {
    items,
    isLoading,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    getTotals,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}