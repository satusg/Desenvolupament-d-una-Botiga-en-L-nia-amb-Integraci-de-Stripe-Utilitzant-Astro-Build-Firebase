import { useCartStore } from '@/store.js';
import styles from '@/components/react/styles/CartProduct.module.css';

const CartProduct = ({ product }) => {
    const { addToCart, removeFromCart, onCart } = useCartStore();

    return (
        <article className={styles.cartProduct}>
            <img src={product.thumbnail} alt={product.title} className={styles.productImage} />
            <div className={styles.productInfo}>
                <h4 className={styles.productTitle}>{product.title}</h4>
                <p className={styles.productPrice}>{product.price.toFixed(2)}&nbsp;€</p>
            </div>
            <div className={styles.productActions}>
                {onCart(product) ? (
                    <button 
                        onClick={() => removeFromCart(product)} 
                        className={`${styles.actionButton} ${styles.removeButton}`}
                        aria-label={`Remove ${product.title} from cart`}
                    >
                        Remove
                    </button>
                ) : (
                    <button 
                        onClick={() => addToCart(product)} 
                        className={`${styles.actionButton} ${styles.addButton}`}
                        aria-label={`Add ${product.title} to cart`}
                    >
                        Add
                    </button>
                )}
            </div>
        </article>
    );
}

export default CartProduct;
