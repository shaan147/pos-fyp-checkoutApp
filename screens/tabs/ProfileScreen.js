// screens/tabs/ProfileScreen.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen() {
  const { user, isGuest, logout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            await logout();
          }
        },
      ]
    );
  };

  const loginOrRegister = () => {
    navigation.navigate('Auth');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Profile</ThemedText>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarPlaceholder}>
          <ThemedText style={styles.avatarText}>
            {isGuest ? 'G' : user?.name?.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
        <ThemedText type="subtitle" style={styles.name}>
          {isGuest ? 'Guest User' : user?.name}
        </ThemedText>
        {!isGuest && user?.email && (
          <ThemedText style={styles.email}>{user.email}</ThemedText>
        )}
      </View>

      {isGuest ? (
        <View style={styles.actionCard}>
          <ThemedText style={styles.actionTitle}>Sign in to your account</ThemedText>
          <ThemedText style={styles.actionDescription}>
            Create an account or sign in to save your cart and order history
          </ThemedText>
          <TouchableOpacity style={styles.actionButton} onPress={loginOrRegister}>
            <Text style={styles.actionButtonText}>Login / Register</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Orders')}>
            <ThemedText style={styles.menuText}>Order History</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
            <ThemedText style={styles.menuText}>Account Settings</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <ThemedText style={styles.menuText}>Help & Support</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <ThemedText style={styles.menuText}>About</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {!isGuest && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      )}
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
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 24,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0284c7', // primary-600
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    marginBottom: 4,
    textAlign: 'center',
  },
  email: {
    color: '#4B5563', // gray-600
    textAlign: 'center',
  },
  actionCard: {
    backgroundColor: '#E0F2FE', // primary-100
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  actionTitle: {
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 8,
  },
  actionDescription: {
    color: '#4B5563', // gray-600
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#0284c7', // primary-600
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  menuSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 24,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // gray-200
  },
  menuText: {
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#FEE2E2', // danger-100
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#DC2626', // danger-600
    fontSize: 16,
    fontWeight: '600',
  },
});