import { useState } from "react";
import { Axios } from "axios";
import { useCartStore } from '@/store.js';
const Product = ({ product }) => {
    const { addToCart, removeFromCart, clearCart, cart, onCart  } = useCartStore();
    const onViewDetails = () => {
        // Aquí ira el funcionamiento de las llamadas a backend para ver los detalles del producto.
        alert(`Viewing details of ${product.title}`);
    }
    const stock = product.stock > 0 ? 'In Stock' : 'Out of Stock';
    return (
        <>
        <div>
            <img src={product.thumbnail} alt={product.title} />
        </div>
        <div>
            <h2>{product.title}</h2>
            <p>{product.price}</p>
            <p>{product.rating}</p>
            <p>{stock}</p>
            <p>{product?.tags?.join(', ')}</p>
        </div>
        <div className="product__actions">
                <button onClick={() => addToCart(product)} disabled={onCart(product)}
                style={
                    onCart(product) ? { display: 'none' } : { display: 'inline-block' }
                }
                >Add to Cart</button>
                <button onClick={() => removeFromCart(product)} style={
                    onCart(product) ? { display: 'inline-block' } : { display: 'none' }
                }>Remove from Cart</button>
                <button onClick={() => onViewDetails() }>View Details</button>
        </div>
        </>
    );
}
export default Product;