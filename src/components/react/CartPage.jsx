import { useEffect, useState } from 'react';
import CartProduct from './CartProduct';
import { useCartStore } from '@/store.js';

import styles from '@/components/react/styles/CartPage.module.css';

import { loadStripe } from '@stripe/stripe-js';

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

async function handleCheckout() {
    console.log(import.meta.env.PUBLIC_STRIPE_KEY);
    const stripe = await loadStripe(import.meta.env.PUBLIC_STRIPE_KEY);

    try {
        const response = await fetch('/api/payment/create.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) { 
            throw new Error('Failed to create checkout session');
        }
        const data = await response.json();
        if (data.error || !data.id) {
            if (data.error) {
                throw new Error(data.error);
            }
            throw new Error('Failed to create checkout session');
        }
        // Redirect to the Stripe Checkout page
        const { error } = await stripe.redirectToCheckout({
            sessionId: data.id,
        });

        if (error) {
            console.error('Stripe checkout error:', error);
        }
    } catch (error) {
        console.error(error);
    }
}

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
                Total: <span className={styles.totalValue}>{total?.toFixed(2)}&nbsp;&#8364;</span>
            </div>
             {Object.keys(cart).length > 0 && (
                <button
                    onClick={() => handleCheckout()}
                    className={styles.checkoutButton}
                >
                    Checkout
                </button>
            )}
        </div>
    );
};

