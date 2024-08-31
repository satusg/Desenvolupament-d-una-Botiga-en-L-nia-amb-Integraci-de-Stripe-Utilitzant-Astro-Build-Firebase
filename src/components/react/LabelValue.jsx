import styles from '@/components/react/styles/LabelValue.module.css';
const LabelValue = ({ label, value, labelClass = '', valueClass = '' }) => {
    return (
        <div className={styles.row}>
            <span className={[styles.label, labelClass].join(' ')}>{label}:</span>
            <span className={[styles.value, valueClass].join(' ')}>{value}</span>
        </div>
    );
}
export default LabelValue;