import React, { useEffect, useState } from 'react';
import { useProductsStore } from '@/store.js';
import Product from './Product';
import { useCartStore } from '../../store';
import styles from '@/components/react/styles/ProductsPage.module.css';

export const ProductsPage = () => {
  const {
    products,
    nextUrl,
    categories,
    tags,
    setFilter,
    resetFilters,
    fetchWithFilters,
    fetchFilters,
    loadInitialProducts
  } = useProductsStore();
  const { loadInitialCart } = useCartStore();

  // Local state for managing filter inputs
  const [filterInputs, setFilterInputs] = useState({
    category: null,
    tag: null,
    priceMin: null,
    priceMax: null
  });

  useEffect(() => {
    fetchFilters();  // Load filter options for categories and tags
    loadInitialProducts();  // Initial load of products
    loadInitialCart();  // Load initial cart state
  }, [fetchFilters, loadInitialProducts, loadInitialCart]);

  const handleInputChange = (event) => {
    const { name = undefined, value = undefined } = event.target;
    if (name === undefined || value === undefined) return;
    setFilterInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Apply each filter based on user input
    setFilter('categories', filterInputs.category ? filterInputs.category : null);
    setFilter('tags', filterInputs.tag ? filterInputs.tag : null);
    setFilter('priceMin', filterInputs.priceMin || null);
    setFilter('priceMax', filterInputs.priceMax || null);
    fetchWithFilters();  // Fetch products with the new filters
  };

  const handleReset = () => {
    setFilterInputs({ categories: null, tag: null, priceMin: null, priceMax: null });
    resetFilters();  // Reset filters to their initial state
  };

  return (
    <div className={styles.productsPage}>
      <form onSubmit={handleSubmit} className={styles.filters}>
      <button className={styles.button} type="button" onClick={handleReset}>Reset Filters</button>
        <div className={styles.group}>

        <select name="category" onChange={handleInputChange} value={filterInputs.category} className={styles.select}>
          <option key="" value="">Select Category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <select name="tag" onChange={handleInputChange} value={filterInputs.tag} className={styles.select}>
          <option key="" value="">Select Tag</option>
          {tags.map(tag => (
            <option key={tag.id} value={tag.id}>{tag.name}</option>
          ))}
          </select>
        </div>
        <div className={styles.group}>
          <input type="number" name="priceMin" placeholder="Min Price" value={filterInputs.priceMin} onChange={handleInputChange}  className={styles.input} />
          <input type="number" name="priceMax" placeholder="Max Price" value={filterInputs.priceMax} onChange={handleInputChange} className={styles.input} />
        </div>
        <button className={styles.button} type="submit">Apply Filters</button>
      </form>

      {products.length === 0 ? (
        <div className={styles.empty}>No Products available</div>
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
        <button onClick={fetchWithFilters} disabled={!nextUrl} className={[styles.button,styles.moreProductsButton].join(' ') }>
          {nextUrl ? 'Show more products' : 'No more products'}
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;
