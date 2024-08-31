import { useEffect, Suspense } from 'react';
import { useAccountStore } from '@/store.js'; // Assuming you have a store for user data
import styles from '@/components/react/styles/AccountPage.module.css'; // Create this CSS module
import AddressDetails from '@/components/react/AddressDetails';
import ProductList from '@/components/react/ProductList';
import AmountSummaryRow from '@/components/react/AmountSummaryRow';
import LabelValue from '@/components/react/LabelValue';

const Loading = () => (
    <div className={styles.loading}>Loading your account...</div>
);

const Error = ({ message }) => (
    <div className={styles.error}>Error loading your account: {message}</div>
);

const AccountDetails = ({ user }) => (
    <div className={styles.accountDetails}>
        <h2>Account Information</h2>
        <LabelValue label="Name" value={user.displayName || 'Name not available'} />
        <LabelValue label="Email" value={user.email} />
    </div>
);

// PaymentSummary component to display summary of a payment
const PaymentSummary = ({ payment }) => (
    <div className={styles.paymentSummary}>
        <LabelValue label="ID of the Order" value={payment.paymentIntentId} />
        <LabelValue label="Date of purchase" value={new Date(payment.createdAt._seconds * 1000).toLocaleDateString()} />
        <LabelValue label="Shipping Method" value={payment.shippingDetails.shippingCostTotal === 500 ? 'Standard Shipping' : 'Express Shipping'} />
        <LabelValue label="Payment State" value={payment.paymentStatus} />        
        <ProductList products={payment.products} />
        <AmountSummaryRow amount={payment.amountSubtotal} title={"Subtotal"} />
        <AmountSummaryRow amount={payment.taxAmount} title={"Tax"} />
        <AmountSummaryRow amount={payment.shippingDetails.shippingCostTotal} title={"Shipping"} />
        <AmountSummaryRow amount={payment.amountTotal} title={"Total"} />
        <AddressDetails address={payment.shippingDetails.address} title="Shipment address" />
        <AddressDetails address={payment.billingAddress} title="Billing address" />
    </div>
);



const PaymentList = ({ payments }) => (
    <div className={styles.paymentList}>
        {payments.map(payment => (
            <div key={payment.paymentIntentId} className={styles.paymentItem}>
                <PaymentSummary payment={payment} />
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
            {user ? <AccountDetails user={user} /> : <Error message="User data not available" />}
            <h2 className={styles.paymentsHeader}>Your Orders</h2>
            {payments && payments.length > 0 ? (
                <Suspense fallback={<Loading />}>
                    <PaymentList payments={payments} />
                </Suspense>
            ) : (
                <p className={styles.noPayments}>No orders found</p>
            )}
        </div>
    );
};

export default AccountPage;
