import { useCartStore } from '@/store.js';
import styles from '@/components/react/styles/Product.module.css';
const ActionButton = ({ onClick, style, className, text }) => {
    return (
            <button 
                type="button" 
                aria-disabled="false" 
                onClick={onClick}
                className={className}
                style={{
                    ...style,
                }}
            >
                <span>{text}</span>
            </button>
  
    );
};


const Product = ({ product }) => {
    const { addToCart, removeFromCart, onCart  } = useCartStore();

    const onViewDetails = () => {
        alert(`Viewing details of ${product.title}`);
    }

    const stock = product.stock > 0 ? 'In Stock' : 'Out of Stock';

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars;

        return (
            <>
                {Array.from({ length: fullStars }, (_, index) => (
                    <svg key={`full-${index}`} className={styles.starIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                ))
                }
                {Array.from({ length: emptyStars }, (_, index) => (
                    <svg key={`empty-${index}`} className={`${styles.starIcon} ${styles.empty}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24z" />
                    </svg>
                ))
                }
            </>
        );
    }

    return (
        <div className={styles.productCard}>
            <p className={styles.productTags}>{product?.tags.map(
                tag => <span key={tag} className={styles.productTag}>{tag}</span>
            )}</p>
            <h2 className={styles.productTitle}>{product.title}</h2>
            <div className={styles.imageContainer}>
                <img src={product.thumbnail} alt={"image of the " + product.title} className={styles.productImage} />
                <div className={styles.productRating}>
                    {renderStars(product.rating)}
                </div>
            </div>
            <p className={styles.productPrice}>{product.price.toFixed(2)}&nbsp;€</p>
            <p className={styles.productDescription}>{product.description}</p>
            <p className={styles.productStock}>{stock}</p>
            <p className={styles.productCategory}>Category: {product.category}</p>
            <div className={styles.productActions}>
                <ActionButton 
                onClick={() => addToCart(product)} 
                style={{ display: onCart(product) ? 'none' : 'inline-block' }} 
                className={`${styles.actionButton} ${styles.addToCartButton}`} 
                text="Add to the cart"
                />
                <ActionButton 
                onClick={() => removeFromCart(product)} 
                style={{ display: !onCart(product) ? 'none' : 'inline-block' }} 
                    className={`${styles.actionButton} ${styles.removeFromCartButton}`}
                text="Remove from the cart"    
                />
                <button 
                    onClick={onViewDetails} 
                    className={`${styles.actionButton} ${styles.viewDetailsButton}`}
                >
                    View Details
                </button>
            </div>
        </div>
    );
}

export default Product;
