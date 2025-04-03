// screens/tabs/CartScreen.js
import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useCart } from '../../contexts/CartContext';
import { CartItem } from '../../components/cart/CartItem';
import { EmptyCart } from '../../components/cart/EmptyCart';

export default function CartScreen() {
  const { items, getTotals, clearCart } = useCart();
  const navigation = useNavigation();
  const totals = getTotals();

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Please add items before checking out.');
      return;
    }
    
    navigation.navigate('Checkout');
  };

  const handleClearCart = () => {
    if (items.length === 0) return;
    
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => clearCart() },
      ]
    );
  };

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Shopping Cart</ThemedText>
        <TouchableOpacity onPress={handleClearCart}>
          <ThemedText style={styles.clearText}>Clear</ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.product._id}
        renderItem={({ item }) => <CartItem item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <ThemedText>Subtotal</ThemedText>
          <ThemedText>₨{totals.subtotal.toFixed(2)}</ThemedText>
        </View>
        <View style={styles.summaryRow}>
          <ThemedText>Tax (17%)</ThemedText>
          <ThemedText>₨{totals.tax.toFixed(2)}</ThemedText>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <ThemedText style={styles.totalText}>Total</ThemedText>
          <ThemedText style={styles.totalAmount}>₨{totals.total.toFixed(2)}</ThemedText>
        </View>

        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearText: {
    color: '#DC2626', // danger-600
    fontWeight: '500',
  },
  list: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  summary: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB', // gray-200
    paddingTop: 8,
    marginBottom: 16,
  },
  totalText: {
    fontWeight: '600',
    fontSize: 16,
  },
  totalAmount: {
    fontWeight: '700',
    fontSize: 18,
    color: '#0284c7', // primary-600
  },
  checkoutButton: {
    backgroundColor: '#0284c7', // primary-600
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});