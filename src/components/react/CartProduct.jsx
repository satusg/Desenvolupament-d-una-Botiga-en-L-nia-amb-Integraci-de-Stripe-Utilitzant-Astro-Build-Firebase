import { useCartStore } from '@/store.js';

const CartProduct = ({ product }) => {
    const { addToCart, removeFromCart, onCart } = useCartStore();

    return (
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}>
            <img src={product.thumbnail} alt={product.title} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
            <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0 }}>{product.title}</h4>
                <p style={{ margin: 0, color: '#888' }}>{product.price.toFixed(2)}&nbsp;€</p>
            </div>
            <div>
                {onCart(product) ? (
                    <button onClick={() => removeFromCart(product)} style={{ padding: '5px 10px' }}>
                        Remove
                    </button>
                ) : (
                    <button onClick={() => addToCart(product)} style={{ padding: '5px 10px' }}>
                        Add
                    </button>
                )}
            </div>
        </div>
    );
}

export default CartProduct;
