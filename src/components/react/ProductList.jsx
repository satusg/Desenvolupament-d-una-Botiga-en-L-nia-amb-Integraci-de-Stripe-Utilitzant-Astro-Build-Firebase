import styles from '@/components/react/styles/ProductList.module.css';
import ProductDetails from '@/components/react/ProductDetails';
/**
 * Given a products object renders a list of products
 */
const ProductList = ({ products }) => (
    <div className={styles.productList}>
        <h2>Products</h2>
        {Object.values(products).map(product => (
            <div key={product.id} className={styles.productItem}>
                <ProductDetails product={product} />
            </div>
        ))}
    </div>
);
export default ProductList;