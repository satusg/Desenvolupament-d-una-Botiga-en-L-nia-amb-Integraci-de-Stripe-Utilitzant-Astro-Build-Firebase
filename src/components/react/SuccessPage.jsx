import React from 'react';
import styles from '@/components/react/styles/SuccessPage.module.css'; // Ensure you create this CSS module
import AddressDetails from '@/components/react/AddressDetails';
import ProductList from '@/components/react/ProductList';
import LabelValue from '@/components/react/LabelValue';
const SuccessPage = ({ paymentData }) => {
    return (
        <div className={styles.successPage}>
            <h1 className={styles.successTitle}>Payment Successful</h1>
            <p className={styles.thankYouMessage}>
                Thank you for your purchase, {paymentData.customerName}!
            </p>

            <div className={styles.orderSummary}>
                <h2 className={styles.sectionHeader}>Order Summary</h2>
                <LabelValue label="ID of the Order" value={paymentData.paymentIntentId} />
                <LabelValue label="Date of purchase" value={new Date(paymentData.createdAt).toLocaleDateString()} />
                <LabelValue label="Shipping Method" value={paymentData.shippingDetails.shippingCostTotal === 500 ? 'Standard Shipping' : 'Express Shipping'} />
                <LabelValue label="Payment State" value={paymentData.paymentStatus} />    
            
            </div>

            <div className={styles.productList}>
                <ProductList products={paymentData.products} />
            </div>

            <div className={styles.orderTotals}>
                <div className={styles.summaryRow}>
                    <span className={styles.label}>Subtotal:</span>
                    <span className={styles.value}>{(paymentData.amountSubtotal / 100).toFixed(2)} €</span>
                </div>
                <div className={styles.summaryRow}>
                    <span className={styles.label}>Tax:</span>
                    <span className={styles.value}>{(paymentData.taxAmount / 100).toFixed(2)} €</span>
                </div>
                <div className={styles.summaryRow}>
                    <span className={styles.label}>Shipping:</span>
                    <span className={styles.value}>{(paymentData.shippingDetails.shippingCostTotal / 100).toFixed(2)} €</span>
                </div>
                <div className={styles.summaryRow}>
                    <span className={styles.label}>Total Paid:</span>
                    <span className={styles.value}>{(paymentData.amountTotal / 100).toFixed(2)} €</span>
                </div>
            </div>   
            <AddressDetails address={paymentData.shippingDetails.address} title="Shipment address" />
            <AddressDetails address={paymentData.billingAddress} title="Billing address" />

            <div className={styles.actions}>
                <a href="/" className={styles.homeLink}>Return to Home</a>
                <a href="/account" className={styles.accountLink}>View Order Details</a>
            </div>
        </div>
    );
}

export default SuccessPage;
