import { useEffect } from 'react';
import { useAccountStore } from '@/store.js'; // Assuming you have a store for user data
import { LogoutForm } from './LogoutForm'; // Import the LogoutForm component
import styles from '@/components/react/styles/AccountPage.module.css'; // Create this CSS module

const Loading = () => (
    <div className={styles.loading}>Cargando tu cuenta...</div>
);

const Error = ({ message }) => (
    <div className={styles.error}>Error al cargar la cuenta: {message}</div>
);

const AccountDetails = ({ user }) => (
    <div className={styles.accountDetails}>
        <h2>Información de la Cuenta</h2>
        <div className={styles.accountInfoRow}>
            <p className={styles.label}>Nombre:</p>
            <p className={styles.value}>{user.displayName || 'Nombre no disponible'}</p>
        </div>
        <div className={styles.accountInfoRow}>
            <p className={styles.label}>Email:</p>
            <p className={styles.value}>{user.email}</p>
        </div>
        <LogoutForm /> {/* Logout button added here */}
    </div>
);

const AddressDetails = ({ address, title }) => (
    <div className={styles.addressDetails}>
        <h3>{title}</h3>
        <p>{address.name}</p>
        <p>{address.line1}</p>
        {address.line2 && <p>{address.line2}</p>}
        <p>{address.city}, {address.state} {address.postal_code}</p>
        <p>{address.country}</p>
    </div>
);

const ProductDetails = ({ product }) => (
    <div className={styles.productDetails}>
        <img src={product.thumbnail} alt={product.title} className={styles.productImage} />
        <div className={styles.productInfo}>
            <h4>{product.title}</h4>
            <p>{product.description}</p>
            <p>Cantidad: {product.quantity}</p>
            <p>Precio: {(product.price).toFixed(2)} &#8364;</p>
        </div>
    </div>
);

const PaymentSummary = ({ payment }) => (
    <div className={styles.paymentSummary}>
        <h2>Resumen del Pedido</h2>
        <div className={styles.summaryRow}>
            <p className={styles.label}>ID de Pedido:</p>
            <p className={styles.value}>{payment.paymentIntentId}</p>
        </div>
        <div className={styles.summaryRow}>
            <p className={styles.label}>Fecha del Pedido:</p>
            <p className={styles.value}>{new Date(payment.createdAt._seconds * 1000).toLocaleDateString()}</p>
        </div>
        <div className={styles.summaryRow}>
            <p className={styles.label}>Estado del Pago:</p>
            <p className={styles.value}>{payment.paymentStatus}</p>
        </div>
        <div className={styles.summaryRow}>
            <p className={styles.label}>Total:</p>
            <p className={styles.value}>{(payment.amountTotal / 100).toFixed(2)} &#8364;</p>
        </div>
        <div className={styles.summaryRow}>
            <p className={styles.label}>Subtotal:</p>
            <p className={styles.value}>{(payment.amountSubtotal / 100).toFixed(2)} &#8364;</p>
        </div>
        <div className={styles.summaryRow}>
            <p className={styles.label}>Impuestos:</p>
            <p className={styles.value}>{(payment.taxAmount / 100).toFixed(2)} &#8364;</p>
        </div>
        <div className={styles.summaryRow}>
            <p className={styles.label}>Envío:</p>
            <p className={styles.value}>{(payment.shippingDetails.shippingCostTotal / 100).toFixed(2)} &#8364;</p>
        </div>
        <AddressDetails address={payment.shippingDetails.address} title="Dirección de Envío" />
        <AddressDetails address={payment.billingAddress} title="Dirección de Facturación" />
        <h3>Opción de Envío Seleccionada:</h3>
        <p className={styles.value}>{payment.shippingOptions.find(option => option.shipping_amount === payment.shippingDetails.shippingCostTotal)?.shipping_rate}</p>
    </div>
);

const ProductList = ({ products }) => (
    <div className={styles.productList}>
        <h2>Productos Comprados</h2>
        {Object.values(products).map(product => (
            <div key={product.id} className={styles.productItem}>
                <ProductDetails product={product} />
            </div>
        ))}
    </div>
);

const PaymentList = ({ payments }) => (
    <div className={styles.paymentList}>
        {payments.map(payment => (
            <div key={payment.paymentIntentId} className={styles.paymentItem}>
                <PaymentSummary payment={payment} />
                <ProductList products={payment.products} />
            </div>
        ))}
    </div>
);

export const AccountPage = () => {
    const { loadUserData, user, payments, error, isLoading } = useAccountStore();

    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    if (isLoading) return <Loading />;
    if (error) return <Error message={error} />;

    return (
        <div className={styles.accountPage}>
            <h1 className={styles.header}>Tu Cuenta</h1>
            {user ? <AccountDetails user={user} /> : <Error message="Datos de usuario no disponibles" />}
            <h2 className={styles.paymentsHeader}>Tus Pedidos</h2>
            {payments && payments.length > 0 ? (
                <PaymentList payments={payments} />
            ) : (
                <p className={styles.noPayments}>No se encontraron pedidos</p>
            )}
        </div>
    );
};

export default AccountPage;
