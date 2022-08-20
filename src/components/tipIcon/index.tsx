// import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import styles from './index.module.scss';

export interface Props {
  IconType?: string;
}

const CardWithLeftIcon: React.FC<Props> = (props: Props) => {
  const { IconType } = props;

  return (
    <FontAwesomeIcon
      icon={faQuestionCircle}
      className={styles.tipiconspecs + ' tipicon' + IconType}
    />
  );
};

export default CardWithLeftIcon;
