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
  cart: {},
  total: 0,
  initialLoad: false,
    // Add a product to the cart
  addToCart: (product) => {
    const previousCart = get().cart;
    const previousTotal = get().total;
    
    // Optimistically update the cart first
    set(state => {
      return {
            total: state.total + product.price, 
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
      set({ cart: previousCart, total: previousTotal });
    });
  },
    
  removeFromCart: (product, quantity) => {
    const previousCart = get().cart;
    const previousTotal = get().total;
    
    // Optimistically delete the product from the cart first
    set(state => {
          const newCart = {...state.cart};
          delete newCart[product.id];
          return { cart: newCart , total: state.total - (product.price * (quantity || 1)) };
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
      set({ cart: previousCart, total: previousTotal });
    });
  },
    
    // Clear the cart
    clearCart: () => {
      const previousCart = get().cart;
      const previousTotal = get().total;
      // Optimistically delete all the product from the cart
      set({ cart: {}, total: 0 });
      // Perform the Axios POST request
    axios.post('https://localhost:3000/api/cart/delete.json', {
      all: true
    })
      .then(response => {
      // You might update the state based on the response if needed
      // For now, we assume the optimistic update is correct and do nothing
      if (response) { 
        console.log('All the producrs have been deleted from the cart:', response.data);
      }
      })
      .catch(error => {
      console.error('Error removing all the products from the cart:', error);
      // Revert to the previous state in case of an error
      set({ cart: previousCart, total: previousTotal });
      });
    },
    // Get the total price of the cart
    getTotalPrice: () => {
        return get().total;
    },
    // Check whether the product is on the cart
  onCart: (product) => {
    return Boolean(get().cart[product.id]);
  },
  loadCart: async () => {
    await axios.get('https://localhost:3000/api/cart/get.json')
    .then(response => {
      set({ cart: response.data?.products ?? {} , total: response.data?.total ?? 0 });
    })
    .catch(error => {
      console.error('Failed to load cart:', error);
    });
  },
  loadInitialCart: () => { 
    if(get().initialLoad) return;
    axios.get('https://localhost:3000/api/cart/get.json')
    .then(response => {
      set({ cart: response.data?.products ?? {}, total: response.data?.total ?? 0, initialLoad: true });
    })
    .catch(error => {
      console.error('Failed to load cart:', error);
    });
  }
}));
export { useCartStore,useProductsStore };