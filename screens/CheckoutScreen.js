// screens/CheckoutScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useCart } from '../contexts/CartContext';
import { PAYMENT_METHODS } from '../constants/ApiConstants';

export default function CheckoutScreen() {
  const { items, getTotals, clearCart } = useCart();
  const navigation = useNavigation();
  const totals = getTotals();
  
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS.CASH);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!address) {
      Alert.alert('Required Field', 'Please enter your delivery address');
      return;
    }

    setLoading(true);
    
    try {
      // Here you would send the order to your API
      // const response = await api.post('/orders', {
      //   items: items.map(item => ({
      //     productId: item.product._id,
      //     quantity: item.quantity,
      //     price: item.price
      //   })),
      //   address,
      //   notes,
      //   paymentMethod: selectedPayment,
      //   total: totals.total
      // });

      // For demo, simulate successful order
      setTimeout(() => {
        Alert.alert(
          'Order Placed Successfully',
          'Your order has been received and will be processed shortly.',
          [
            {
              text: 'OK',
              onPress: () => {
                clearCart();
                navigation.navigate('Home');
              }
            }
          ]
        );
        setLoading(false);
      }, 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  const PaymentOption = ({ method, title }) => (
    <TouchableOpacity 
      style={[
        styles.paymentOption,
        selectedPayment === method && styles.selectedPayment
      ]}
      onPress={() => setSelectedPayment(method)}
    >
      <Text 
        style={[
          styles.paymentText,
          selectedPayment === method && styles.selectedPaymentText
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <ThemedText type="title">Checkout</ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ThemedText type="subtitle">Delivery Address</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter your delivery address"
            value={address}
            onChangeText={setAddress}
            multiline
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Payment Method</ThemedText>
          <View style={styles.paymentOptions}>
            <PaymentOption method={PAYMENT_METHODS.CASH} title="Cash on Delivery" />
            <PaymentOption method={PAYMENT_METHODS.CARD} title="Credit/Debit Card" />
            <PaymentOption method={PAYMENT_METHODS.MOBILE_WALLET} title="Mobile Wallet" />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Order Notes (Optional)</ThemedText>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Add any special instructions..."
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>

        <View style={styles.summary}>
          <ThemedText type="subtitle">Order Summary</ThemedText>
          <View style={styles.summaryRow}>
            <ThemedText>Items ({items.length})</ThemedText>
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
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          <Text style={styles.placeOrderText}>
            {loading ? 'Processing...' : 'Place Order'}
          </Text>
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
    marginBottom: 24,
  },
  backButton: {
    fontSize: 16,
    color: '#0284c7',
    marginBottom: 8,
  },
  section: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    fontSize: 16,
    marginTop: 8,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  paymentOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  paymentOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedPayment: {
    backgroundColor: '#0284c7',
    borderColor: '#0284c7',
  },
  paymentText: {
    fontSize: 14,
    color: '#1F2937',
  },
  selectedPaymentText: {
    color: 'white',
  },
  summary: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginTop: 12,
  },
  totalText: {
    fontWeight: '600',
    fontSize: 16,
  },
  totalAmount: {
    fontWeight: '700',
    fontSize: 18,
    color: '#0284c7',
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  placeOrderButton: {
    backgroundColor: '#0284c7',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  placeOrderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});