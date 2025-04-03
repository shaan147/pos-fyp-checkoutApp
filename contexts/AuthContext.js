// contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { api } from "../services/api/apiService";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(true); // Default to guest mode
  
  useEffect(() => {
    // Load token and user data
    const loadToken = async () => {
      try {
        const savedToken = await SecureStore.getItemAsync("token");

        if (savedToken) {
          setToken(savedToken);
          await fetchCurrentUser(savedToken);
          setIsGuest(false);
        } else {
          // If no token, use guest mode by default
          setIsGuest(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading auth token:", error);
        // On error, default to guest mode
        setIsGuest(true);
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  const fetchCurrentUser = async (authToken) => {
    try {
      // Set token in the API service
      api.setToken(authToken);

      // Fetch current user details
      const response = await api.get("/auth/me");

      if (response.success && response.data) {
        setUser(response.data);
      } else {
        // If the token is invalid, clear it and use guest mode
        await SecureStore.deleteItemAsync("token");
        setToken(null);
        setUser(null);
        setIsGuest(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      await SecureStore.deleteItemAsync("token");
      setToken(null);
      setUser(null);
      setIsGuest(true);
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", credentials);

      if (response.success && response.token && response.data) {
        // Save token to secure storage
        await SecureStore.setItemAsync("token", response.token);

        // Set user and token in state
        setToken(response.token);
        setUser(response.data);
        api.setToken(response.token);
        setIsGuest(false);

        return { success: true };
      } else {
        return {
          success: false,
          error: response.error?.message || "Login failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || "An error occurred during login",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/register", userData);

      if (response.success && response.token && response.data) {
        // Save token to secure storage
        await SecureStore.setItemAsync("token", response.token);

        // Set user and token in state
        setToken(response.token);
        setUser(response.data);
        api.setToken(response.token);
        setIsGuest(false);

        return { success: true };
      } else {
        return {
          success: false,
          error: response.error?.message || "Registration failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || "An error occurred during registration",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    setUser(null);
    setToken(null);
    api.setToken(null);
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Call logout API if needed
      await api.get("/auth/logout");

      // Clear token from secure storage
      await SecureStore.deleteItemAsync("token");

      // Reset state to guest mode instead of unauthenticated
      setToken(null);
      setUser(null);
      setIsGuest(true);
      api.setToken(null);
    } catch (error) {
      console.error("Error during logout:", error);
      // On error, still reset to guest mode
      setToken(null);
      setUser(null);
      setIsGuest(true);
      api.setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Consider all users authenticated whether they're guests or logged in
  const isAuthenticated = true;

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    isGuest,
    login,
    register,
    logout,
    continueAsGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}