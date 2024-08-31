import { useCartStore, useProductsStore } from '@/store.js';
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
const addToCartIcon =
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.2,9h1.6V6.8H16V5.2H13.8V3H12.2V5.2H10V6.8h2.2ZM20,5v5.5L7.45,12.72,5,3H1.25a1,1,0,0,0,0,2H3.47L6.7,18H20V16H8.26l-.33-1.33L22,12.18V5ZM7,19a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,7,19Zm12,0a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,19,19Z" />
    </svg>;
const removeFromCartIcon =
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M16,5.2H10V6.8h6ZM20,5v5.5L7.45,12.72,5,3H1.25a1,1,0,0,0,0,2H3.47L6.7,18H20V16H8.26l-.33-1.33L22,12.18V5ZM7,19a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,7,19Zm12,0a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,19,19Z"/>
    </svg>; 
const watchIcon = 
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <g><path d="M256,128c-81.9,0-145.7,48.8-224,128c67.4,67.7,124,128,224,128c99.9,0,173.4-76.4,224-126.6   C428.2,198.6,354.8,128,256,128z M256,347.3c-49.4,0-89.6-41-89.6-91.3c0-50.4,40.2-91.3,89.6-91.3s89.6,41,89.6,91.3   C345.6,306.4,305.4,347.3,256,347.3z"/><g><path d="M256,224c0-7.9,2.9-15.1,7.6-20.7c-2.5-0.4-5-0.6-7.6-0.6c-28.8,0-52.3,23.9-52.3,53.3c0,29.4,23.5,53.3,52.3,53.3    s52.3-23.9,52.3-53.3c0-2.3-0.2-4.6-0.4-6.9c-5.5,4.3-12.3,6.9-19.8,6.9C270.3,256,256,241.7,256,224z"/></g></g>
    </svg>;
        


const Product = ({ product }) => {
    const { addToCart, removeFromCart, onCart } = useCartStore();
    const {  setFilter, fetchWithFilters } = useProductsStore();

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

    const handleTagClick = (tag) => {
        setFilter('tags', tag);
        fetchWithFilters();
    }

    return (
        <div className={styles.productCard}>
            <p className={styles.productTags}>{product?.tags.map(
                tag => <span key={tag} onClick={() => handleTagClick(tag)} className={styles.productTag}>{tag}</span>
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
                <button 
                    onClick={onViewDetails} 
                    className={`${styles.actionButton} ${styles.viewDetailsButton}`}
                >
                    { watchIcon }
                </button>
                 <ActionButton 
                onClick={() => addToCart(product)} 
                style={{ display: onCart(product) ? 'none' : 'inline-block' }} 
                className={`${styles.actionButton} ${styles.addToCartButton}`} 
                    text={addToCartIcon}
                />
                <ActionButton 
                    onClick={() => removeFromCart(product)}
                    style={{ display: !onCart(product) ? 'none' : 'inline-block' }}
                    className={`${styles.actionButton} ${styles.removeFromCartButton}`}
                    text={ removeFromCartIcon}    
                />
            </div>
        </div>
    );
}

export default Product;
