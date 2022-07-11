import React from 'react';

import styles from './index.module.scss';

interface Props {
  children: React.ReactNode;
}

const MainContainer: React.FC<Props> = ({ children }) => (
  <div className={styles.mainContainer}>{children}</div>
);
export default MainContainer;
