import { useEffect, useState } from 'react';
import CartProduct from './CartProduct';
import { useCartStore } from '@/store';
import styles from '@/components/react/styles/CartPage.module.css';

const Loading = () => (
    <div className={styles.loading}>Loading your cart...</div>
);

const Error = ({ message }) => (
    <div className={styles.error}>Error loading cart: {message}</div>
);

const EmptyCart = () => (
    <div className={styles.emptyCart}>Your cart is empty</div>
);

const CartList = ({ cart }) => (
    <ul className={styles.cartList}>
        {Object.values(cart).map(product => (
            <li key={product.id} className={styles.cartItem}>
                <CartProduct product={product} />
            </li>
        ))}
    </ul>
);

export const CartPage = () => {
    const { loadInitialCart, clearCart, cart, total, error, isLoading } = useCartStore();

    useEffect(() => {
        loadInitialCart();
    }, [loadInitialCart]);

    if (isLoading) return <Loading />;
    if (error) return <Error message={error} />;

    return (
        <div className={styles.cartPage}>
            <h1 className={styles.header}>Your Cart</h1>
            <button onClick={clearCart} className={styles.clearButton} disabled={Object.keys(cart).length === 0}>
                Clear Cart
            </button>
            {Object.keys(cart).length === 0 ? <EmptyCart /> : <CartList cart={cart} />}
            <div className={styles.total}>
                Total: <span className={styles.totalValue}>{total.toFixed(2)}&nbsp;€</span>
            </div>
        </div>
    );
};
