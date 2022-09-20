import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import styles from './index.module.scss';

interface Props {
  title: string;
  content: string;
  onClose: () => void;
  isDestination?: boolean;
}

const InfoTooltip: React.FC<Props> = ({
  title,
  content,
  onClose,
  isDestination,
}) => (
  <div
    className={`${styles.infoTooltipContainer} ${
      isDestination ? styles?.isDestination : ''
    }`}
  >
    <div className={styles.arrow}></div>
    <div className={styles.buttonContainer}>
      <FontAwesomeIcon
        icon={faXmark}
        style={{ height: '16px' }}
        onClick={onClose}
      />
    </div>
    <div className={styles.tooltipContent}>
      <p className={styles.title}>{title}</p>
      <p className={styles.content}>{content}</p>
    </div>
  </div>
);

export default InfoTooltip;
