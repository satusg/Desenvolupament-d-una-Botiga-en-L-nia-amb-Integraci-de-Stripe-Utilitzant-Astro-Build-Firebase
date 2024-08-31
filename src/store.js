import {create} from 'zustand';
import axios from 'axios';


// Define the product list management
const useProductsStore = create((set, get) => ({
  products: [],
  nextUrl: null,
  prevUrl: null,
  categories: [],
  tags: [],
  filters: { categories: null, tags: null, priceMin: null, priceMax: null },
  previousFilters: { categories: null, tags: null, priceMin: null, priceMax: null },
  fetchFilters: async () => {
    try {
      const tagsUrl = '/api/products/tags.json';
      const tagsResponse = await axios.get(tagsUrl);
      const categoriesUrl = '/api/products/categories.json';
      const categoriesResponse = await axios.get(categoriesUrl);
      set({
        tags: tagsResponse.data ?? [],
        categories: categoriesResponse.data ?? [],
      });
    } catch (error) {
      console.error("Failed to fetch filters:", error.message);
    }
  },
  setFilter: (filter, value) => {
    console.log('setFilter', filter, value);
    const currentFilters = get().filters;
    set({ filters: { ...currentFilters, [filter]: value } });
  },
  removeFilter: (filter, value) => {
    const currentFilters = get().filters;
    const currentFilterValue = currentFilters[filter];
    if (Array.isArray(currentFilterValue)) {
      const newFilterValue = currentFilterValue.filter(v => v !== value);
      set({ filters: { ...currentFilters, [filter]: newFilterValue } });
    } else {
      set({ filters: { ...currentFilters, [filter]: null } });
    }
    const { fetchWithFilters } = get();
    fetchWithFilters();
  },

  fetchWithFilters: async () => {
    const currentFilters = get().filters;
    const previousFilters = get().previousFilters;
    const { categories, tags, priceMin, priceMax } = currentFilters;
    const categoriesQuery = categories ? `&category=${categories}` : '';
    const tagsQuery = tags ? `&tags=${tags}` : '';
    const priceMinQuery = priceMin ? `&priceMin=${priceMin}` : '';
    const priceMaxQuery = priceMax ? `&priceMax=${priceMax}` : '';
    const { nextUrl } = get();
    const { fetchProducts } = get();
    let url = '/api/products/get.json?limit=10';
    if (currentFilters !== previousFilters) {
      set({ previousFilters: currentFilters, products: [] });
      url = `/api/products/get.json?limit=10${categoriesQuery}${tagsQuery}${priceMinQuery}${priceMaxQuery}`;
    } else { 
      url = `${nextUrl}${categoriesQuery}${tagsQuery}${priceMinQuery}${priceMaxQuery}`;
    }
    fetchProducts(url);
  },

  resetFilters: () => {
    const { fetchWithFilters } = get();
    set({ filters: { categories: null, tags: null, priceMin: null, priceMax: null } });
    fetchWithFilters();
  },
  fetchProducts: async (url) => {
    const currentProducts = get().products;
    try {
      const response = await axios.get(url);
      set({
        products: currentProducts.concat(response.data?.products ?? []),
        nextUrl: response.data?.nextUrl ?? null,
        prevUrl: response.data?.prevUrl ?? null
      });
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
    }
  },

  // Load initial products
  loadInitialProducts: () => {
    get().fetchProducts('/api/products/get.json?limit=10');
  },
  // Handlers for pagination
  fetchNext: () => {
    fetchWithFilters();
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
      const newCart = {
        ...state.cart,
        [product.id]: {
          ...product,
          quantity: state.cart[product.id] ? state.cart[product.id].quantity + 1 : 1
        }
      };
      const newTotal = state.total + Math.round(product.price * 100);
            
      return {
          cart: newCart,
          total: newTotal, 
    }});

    // Perform the Axios POST request
    axios.post('api/cart/add.json', {
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
          return { cart: newCart , total: state.total - (product.price * (quantity || 1)) * 100 };
        });

    // Perform the Axios POST request
    axios.post('api/cart/delete.json', {
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
    axios.post('api/cart/delete.json', {
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
    await axios.get('api/cart/get.json')
    .then(response => {
      set({ cart: response.data?.products ?? {} , total: response.data?.total ?? 0 });
    })
    .catch(error => {
      console.error('Failed to load cart:', error);
    });
  },
  loadInitialCart: () => { 
    if(get().initialLoad) return;
    axios.get('api/cart/get.json')
    .then(response => {
      set({ cart: response.data?.products ?? {}, total: response.data?.total ?? 0, initialLoad: true });
    })
    .catch(error => {
      console.error('Failed to load cart:', error);
    });
  }
}));

const useAccountStore = create((set, get) => ({
  user: null,
  payments: [],
  isLoading: false,
  error: null,
  validEmail: false,
  loadUserData: async () => {
    const current = get();
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('api/account/get.json');
      set({
        user: response.data?.user ?? null,
        payments: response.data?.payments ?? [],
        isLoading: false,
        error: null,
      });
      const email = get().user?.email;
      if (email) {
        // Assume that the email is valid if it's not empty ( as it has been received from the server)
        set({ validEmail: true });
      }
    } catch (error) {

      set({...current, isLoading: false, error: error.message || 'Failed to load user data', validEmail: false });
      console.error('Failed to load user data:', error);
    }
  },
  verifyUserEmail: async (email) => { 
    if (!email) return false;
    const current = get();
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('api/account/verifyEmail.json', {
        email
      });
      if (response.data?.valid) {
        set({ validEmail: response.data?.valid ?? false, isLoading: false, error: null });
      } else { 
        set({ validEmail: false, isLoading: false, error: response.data?.error ?? 'Failed to verify email' });
      }
    } catch (error) {
      set({...current, isLoading: false, error: error.message || 'Failed to verify email', validEmail: false });
      console.error('Failed to verify email:', error);
      return false;
    }
  },
  updateUser: async (email = null, displayName = null, newPhotoURL = null) => {
    if (!email && !displayName && !newPhotoURL) {
      return;
    }
    const current = get();
    set({ isLoading: true, error: null, validEmail: false });
    try {
      const response = await axios.post('api/account/update.json', {
        'method': 'POST',
        'headers': {
          'Content-Type': 'application/json',
        },
        'body': JSON.stringify({
          email,
          displayName,
          newPhotoURL,
        }),
      });
      set({
        user: response.data?.user ?? null,
        isLoading: false,
        error: null,
        validEmail: true
      });
    } catch (error) {
      set({...current, isLoading: false, error: error.message || 'Failed to update user data', validEmail: false });
      console.error('Failed to update user data:', error);
    }
  },
  getUser: () => {
    return get().user;
  },
}));

export { useCartStore,useProductsStore, useAccountStore };