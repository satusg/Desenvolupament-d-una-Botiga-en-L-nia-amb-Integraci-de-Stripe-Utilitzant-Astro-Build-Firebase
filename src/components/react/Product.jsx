import { useState } from "react";
import { Axios } from "axios";
import { useCartStore } from '@/store.js';
const Product = ({ product }) => {
    const { addToCart, removeFromCart, clearCart, cart, onCart  } = useCartStore();
    
    const [stock, setStock] = useState(product.stock);
    const onAddToCart = () => {
    
        alert(`Added ${stock} ${product.title} to cart`);
        // Aquí ira el funcionamiento de las llamadas a backend para añadir el producto al carrito.
        setStock((previousStock) => { 
            if(previousStock > 0) {
                return previousStock - 1;
            } else {
                alert('Out of stock');
                return previousStock;
            }
        });
    }
    const onViewDetails = () => {
        // Aquí ira el funcionamiento de las llamadas a backend para ver los detalles del producto.
        alert(`Viewing details of ${product.title}`);
    }

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
                <button onClick={() => addToCart(product)} disabled={onCart(product)}>Add to Cart</button>
                <button onClick={() => onViewDetails() }>View Details</button>
        </div>
        </>
    );
}
export default Product;