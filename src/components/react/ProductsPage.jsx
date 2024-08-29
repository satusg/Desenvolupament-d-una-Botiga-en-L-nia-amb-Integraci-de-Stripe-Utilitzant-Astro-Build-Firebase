import  { useEffect } from 'react';
import { useProductsStore } from '@/store.js';
import Product from './Product';
import { useCartStore } from '../../store';
import styles from '@/components/react/styles/ProductsPage.module.css';

export const ProductsPage = () => {
  const { products, nextUrl, loadInitialProducts, fetchNext } = useProductsStore();
  const { loadInitialCart } = useCartStore();

  useEffect(() => {
    loadInitialProducts();
    loadInitialCart();
  }, [loadInitialProducts, loadInitialCart]);

  return (
    <div className={styles.productsPage}>
      {products.length === 0 ? (
        <div className={styles.loading}>Loading products...</div>
      ) : (
        <ul className={styles.productList}>
          {products.map(product => (
            <li key={product.id} className={styles.productItem}>
              <Product product={product} />
            </li>
          ))}
        </ul>
      )}
      <div className={styles.pagination}>
        <button 
          onClick={fetchNext} 
          disabled={!nextUrl} 
          className={styles.loadMoreButton}
        >
          {nextUrl ? 'Show more products' : 'No more products'}
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;
