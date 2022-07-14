import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import styles from './index.module.scss';

interface Props {
  title: string;
  content: string;
  onClose: () => void;
}

const InfoTooltip: React.FC<Props> = ({ title, content, onClose }) => (
  <div className={styles.infoTooltipContainer}>
    <div className={styles.arrow}></div>
    <div className={styles.buttonContainer}>
      <FontAwesomeIcon icon={faXmark} onClick={onClose} />
    </div>
    <div className={styles.tooltipContent}>
      <p className={styles.title}>{title}</p>
      <p className={styles.content}>{content}</p>
    </div>
  </div>
);

export default InfoTooltip;
