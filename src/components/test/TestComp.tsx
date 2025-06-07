import styles from './TestComp.module.css';

export default function TestComp() {
  return (
    <div className={styles.testComp}>
      <h1>Test Component Works</h1>
      <p>If you see this, React is rendering properly.</p>
    </div>
  );
}
