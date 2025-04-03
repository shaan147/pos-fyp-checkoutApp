// contexts/ProductContext.js
import React, { createContext, useContext, useState } from "react";
import { api } from "../services/api/apiService";
import { imageRecognitionService } from "../services/imageRecog/imageRecognitionService";

const ProductContext = createContext(undefined);

export function ProductProvider({ children }) {
  const [recentProducts, setRecentProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get product by ID
  const getProductById = async (productId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/products/${productId}`);

      if (response.success) {
        // Add to recent products cache
        updateRecentProducts(response.data);
        return response.data;
      } else {
        setError(response.error || "Failed to fetch product");
        return null;
      }
    } catch (error) {
      setError(error.message || "An error occurred while fetching the product");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get product by barcode
  const getProductByBarcode = async (barcode) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/products/barcode/${barcode}`);

      if (response.success) {
        // Add to recent products cache
        updateRecentProducts(response.data);
        return response.data;
      } else {
        setError(response.error || "Failed to fetch product");
        return null;
      }
    } catch (error) {
      setError(error.message || "An error occurred while fetching the product");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get product by image
  const getProductByImage = async (imageUri) => {
    setIsLoading(true);
    setError(null);

    try {
      // Send image to recognition service
      const recognitionResult = await imageRecognitionService.recognizeProduct(
        imageUri
      );

      if (recognitionResult.success) {
        // If barcode was found in image
        if (recognitionResult.barcode) {
          return await getProductByBarcode(recognitionResult.barcode);
        }
        // If product ID was found directly
        else if (recognitionResult.productId) {
          return await getProductById(recognitionResult.productId);
        }
        // If product details were returned directly
        else if (recognitionResult.product) {
          updateRecentProducts(recognitionResult.product);
          return recognitionResult.product;
        } else {
          setError("Product not recognized");
          return null;
        }
      } else {
        setError(recognitionResult.error || "Failed to recognize product");
        return null;
      }
    } catch (error) {
      setError(error.message || "An error occurred during image recognition");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Search products
  const searchProducts = async (query) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get("/products", {
        name: query,
      });

      if (response.success) {
        return response.data;
      } else {
        setError(response.error || "Failed to search products");
        return [];
      }
    } catch (error) {
      setError(error.message || "An error occurred while searching products");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Update recent products cache
  const updateRecentProducts = (product) => {
    setRecentProducts((prevProducts) => {
      // Remove product if it already exists in the cache
      const filteredProducts = prevProducts.filter(
        (p) => p._id !== product._id
      );

      // Add product to the beginning of the array (most recent)
      return [product, ...filteredProducts].slice(0, 10); // Keep only 10 most recent products
    });
  };

  const value = {
    recentProducts,
    isLoading,
    error,
    getProductById,
    getProductByBarcode,
    getProductByImage,
    searchProducts,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
}