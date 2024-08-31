import styles from '@/components/react/styles/AddressDetails.module.css'; 
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
export default AddressDetails;