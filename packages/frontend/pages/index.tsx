import styles from './index.module.css';
import {ConnectWindow} from '../components'

export function Index() {
  return (
    <div className={styles.page}>
      <ConnectWindow/>
    </div>
  );
}

export default Index;
