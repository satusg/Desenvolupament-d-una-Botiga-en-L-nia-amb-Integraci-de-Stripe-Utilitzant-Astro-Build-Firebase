import styles from '@/components/react/styles/AmountSummaryRow.module.css';
import LabelValue from '@/components/react/LabelValue';
const AmountSummaryRow = ({ amount, title }) => {
    return (
        <LabelValue className={styles.summaryRow} label={title} value={(amount / 100).toFixed(2)} valueClass={styles.value} labelClass={styles.label} />
    );
}
export default AmountSummaryRow;