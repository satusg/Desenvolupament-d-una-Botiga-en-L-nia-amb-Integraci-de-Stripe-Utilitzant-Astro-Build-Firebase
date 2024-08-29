import React, { useEffect } from 'react';
import { useProductsStore } from '@/store.js';
import Product from './Product';
import { useCartStore } from '../../store';

export const ProductsPage = () => {
  const { products, nextUrl, prevUrl, loadInitialProducts, fetchNext } = useProductsStore();
  const { loadInitialCart } = useCartStore();
  useEffect(() => {
      loadInitialProducts();
  }, [loadInitialProducts]);
  useEffect(() => {
    loadInitialCart();
  }, []);
    return (
      <div>
        <ul>
          {products.map(product => (
            <Product key={product.id} product={product} />
          ))}
          <button onClick={fetchNext} disabled={!nextUrl}>Show more products</button>
        </ul>
    </div>
  );
}
