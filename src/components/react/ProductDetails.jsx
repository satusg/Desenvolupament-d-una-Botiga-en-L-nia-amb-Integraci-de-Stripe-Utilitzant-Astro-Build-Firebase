import styles from '@/components/react/styles/ProductDetails.module.css';
const ProductDetails = ({ product: { thumbnail, title, description, quantity, price } }) => (
    <div className={styles.productDetails}>
        <img src={thumbnail} alt={title} className={styles.productImage} />
        <div className={styles.productInfo}>
            <h4>{title}</h4>
            <p>{description}</p>
            <p>Quantity: {quantity}</p>
            <p>Price: {price.toFixed(2)} &#8364;</p>
        </div>
    </div>
);
export default ProductDetails;