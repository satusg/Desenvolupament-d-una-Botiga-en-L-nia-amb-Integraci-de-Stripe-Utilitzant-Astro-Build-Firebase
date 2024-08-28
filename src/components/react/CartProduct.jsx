import { useCartStore } from '@/store.js';
import styles from '@/components/react/styles/CartProduct.module.css';
const CartProduct = ({ product }) => {
    const { addToCart, removeFromCart, onCart } = useCartStore();

    return (
        <article className={styles.cartProduct}>
            <img src={product.thumbnail} alt={product.title} />
            <div>
                <h4>{product.title}</h4>
                <p >{product.price.toFixed(2)}&nbsp;€</p>
            </div>
            <div>
                {onCart(product) ? (
                    <button onClick={() => removeFromCart(product)} >
                        Remove
                    </button>
                ) : (
                    <button onClick={() => addToCart(product)}>
                        Add
                    </button>
                )}
            </div>
        </article>
    );
}

export default CartProduct;
