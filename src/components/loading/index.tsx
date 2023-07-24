import classNames from 'classnames/bind';
import React from 'react';

import { IconNameType } from '../../components/icon/types';

import Icon from '../icon';

import styles from './index.module.scss';

interface Props {
  classNames?: string;
  size?: number;
  name?: IconNameType;
}

export const Loading: React.FC<Props> = (props) => (
  <div className={classNames(styles.container, props.classNames)}>
    <Icon
      name={props.name!}
      size={props.size}
      className={classNames(styles.animal, styles.icon)}
    />
  </div>
);

Loading.defaultProps = {
  name: 'refresh',
  size: 60,
};

export default Loading;
