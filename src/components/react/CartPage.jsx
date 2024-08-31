import { useEffect } from 'react';
import CartProduct from './CartProduct';
import { useCartStore, useAccountStore } from '@/store.js';
import styles from '@/components/react/styles/CartPage.module.css';
import { loadStripe } from '@stripe/stripe-js';

const Loading = () => (
    <div className={styles.loading}>Loading your cart...</div>
);

const Error = ({ message }) => (
    <div className={styles.error}>Error loading cart: {message}</div>
);

const EmptyCart = () => (
    <div className={styles.emptyCart}>
        Go back to the <a href="/products">store</a> to add items to your cart.
    </div>
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
            throw new Error(data.error || 'Failed to create checkout session');
        }

        const { error } = await stripe.redirectToCheckout({
            sessionId: data.id,
        });

        if (error) {
            console.error('Stripe checkout error:', error);
        }
    } catch (error) {
        console.error('Checkout error:', error);
        alert('There was an issue processing your checkout. Please try again.');
    }
}

export const CartPage = () => {
    const { loadInitialCart, clearCart, cart, total, error, isLoading } = useCartStore();
    const { loadUserData } = useAccountStore();

    useEffect(() => {
        loadInitialCart();
        loadUserData();
    }, [loadInitialCart, loadUserData]);

    if (isLoading) return <Loading />;
    if (error) return <Error message={error} />;

    const isCartEmpty = Object.keys(cart).length === 0;

    return (
        <div className={styles.cartPage}>
            {!isCartEmpty && 
            (
            <div className={styles.cartHeader}>
                <button 
                    onClick={clearCart} 
                    className={styles.clearButton} 
                    disabled={isCartEmpty}
                >
                    Clear Cart
                </button>
            </div>
            )
            }

            {isCartEmpty ? <EmptyCart /> : <CartList cart={cart} />}
            {!isCartEmpty && (
                <div className={styles.checkoutSection}>
                    <div className={styles.total}>
                        Total: <span className={styles.totalValue}>{(parseInt(total) / 100)?.toFixed(2)}€</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        className={styles.checkoutButton}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            )}
        </div>
    );
};
