import React, { useEffect } from 'react';
import { useProductsStore } from '@/store.js';
import Product from './Product';
import { useCartStore } from '../../store';

export const ProductsPage = () => {
  const { products, nextUrl, prevUrl, loadInitialProducts, fetchNext, fetchPrevious } = useProductsStore();
  const { loadInitialCart } = useCartStore();
  useEffect(() => {
      loadInitialProducts();
  }, [loadInitialProducts]);
  useEffect(() => {
    loadInitialCart();
  }, []);

    return (
      <div>
            {nextUrl}
      <h1>Products</h1>
      <div>
        <button onClick={fetchPrevious} disabled={!prevUrl}>Previous</button>
        <button onClick={fetchNext} disabled={!nextUrl}>Next</button>
      </div>
      <ul>
        {products.map(product => (
          <Product key={product.id} product={product} />
        ))}
      </ul>
    </div>
  );
}
