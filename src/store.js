import {create} from 'zustand';
import axios from 'axios';

// Define the product list management
const useProductsStore = create((set, get) => ({
  products: [],
  nextUrl: null,
  prevUrl: null,

  // Fetch products from a given URL
  fetchProducts: async (url) => {
    try {
      const response = await axios.get(url);
      set({
        products: response.data?.products ?? [],
        nextUrl: response.data?.nextUrl ?? null,
        prevUrl: response.data?.prevUrl ?? null
      });
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
      alert(error.message || 'Failed to fetch products');
    }
  },

  // Load initial products
  loadInitialProducts: () => {
    get().fetchProducts('/api/products.json');
  },

  // Handlers for pagination
  fetchNext: () => {
    const { nextUrl, fetchProducts } = get();
    if (nextUrl) {
      fetchProducts(nextUrl);
    }
  },
  
  fetchPrevious: () => {
      const { prevUrl, fetchProducts } = get();
    if (prevUrl) {
      fetchProducts(prevUrl);
    }
  }
}));
const useCartStore = create((set, get) => ({
    cart: [],
    // Add a product to the cart
    addToCart: (product) => {
        set({ cart: [...get().cart, product] });
    },
    // Remove a product from the cart
    removeFromCart: (product) => {
        set({ cart: get().cart.filter((p) => p.id !== product.id) });
    },
    // Clear the cart
    clearCart: () => {
        set({ cart: [] });
    },
    // Get the total price of the cart
    getTotalPrice: () => {
        return get().cart.reduce((total, product) => total + product.price, 0);
    },
    // Check whether the product is on the cart
    onCart: (product) => {
        return get().cart.some((p) => p.id === product.id);
    }
}));
export { useCartStore,useProductsStore };