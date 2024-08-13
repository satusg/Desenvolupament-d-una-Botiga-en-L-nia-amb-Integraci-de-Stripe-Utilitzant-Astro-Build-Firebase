import {create} from 'zustand';
import axios from 'axios';
import { init } from 'astro/virtual-modules/prefetch.js';

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
  cart: {},
  initialLoad: false,
    // Add a product to the cart
  addToCart: (product) => {
    const previousCart = get().cart;
    
    // Optimistically update the cart first
    set(state => {
      console.log(state);
        return {
            cart: {
                ...state.cart,
                [product.id]: {
                    ...product,
                    quantity: state.cart[product.id] ? state.cart[product.id].quantity + 1 : 1 
                }
            }
}});

    // Perform the Axios POST request
    axios.post('https://localhost:3000/api/cart/add.json', {
      product,
      quantity: 1
    })
    .then(response => {
      // You might update the state based on the response if needed
      // For now, we assume the optimistic update is correct and do nothing
      if (response) { 
        console.log('Product added to cart:', response.data);
      }
    })
    .catch(error => {
      console.error('Error adding product to cart:', error);
      // Revert to the previous state in case of an error
      set({ cart: previousCart });
    });
  },
    
  removeFromCart: (product, quantity) => {
    const previousCart = get().cart;
    
    // Optimistically delete the product from the cart first
    set(state => {
          const newCart = {...state.cart};
          delete newCart[product.id];
          return { cart: newCart };
        });

    // Perform the Axios POST request
    axios.post('https://localhost:3000/api/cart/delete.json', {
      product,
      quantity: quantity || 1
      
    })
    .then(response => {
      // You might update the state based on the response if needed
      // For now, we assume the optimistic update is correct and do nothing
      if (response) { 
        console.log('Product delete from the cart:', response.data);
      }
    })
    .catch(error => {
      console.error('Error removing the product from the cart:', error);
      // Revert to the previous state in case of an error
      set({ cart: previousCart });
    });
  },
    
    // Clear the cart
    clearCart: () => {
      set({ cart: {} });
    },
    // Get the total price of the cart
    getTotalPrice: () => {
        return Object.values(get().cart).reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    // Check whether the product is on the cart
  onCart: (product) => {
    console.log(product, 'productId');

    return Boolean(get().cart[product.id]);
  },
  loadCart: async () => {
    await axios.get('https://localhost:3000/api/cart/get.json')
    .then(response => {
      set({ cart: response.data?.products ?? {} });
    })
    .catch(error => {
      console.error('Failed to load cart:', error);
    });
  },
  loadInitialCart: () => { 
    if(get().initialLoad) return;
    axios.get('https://localhost:3000/api/cart/get.json')
    .then(response => {
      set({ cart: response.data?.products ?? {} });
      initialLoad = true;
    })
    .catch(error => {
      console.error('Failed to load cart:', error);
    });
  }
}));
export { useCartStore,useProductsStore };