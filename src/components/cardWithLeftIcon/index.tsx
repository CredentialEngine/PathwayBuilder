import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Col, Row } from 'antd';
import React from 'react';

import styles from './index.module.scss';

export interface Props {
  title?: string;
  Subtitle?: string;
  IconName: IconProp;
  IconColor?: string;
  inlineStyles?: any;
}

const CardWithLeftIcon: React.FC<Props> = (props: Props) => {
  const { title, Subtitle, IconName, IconColor, inlineStyles } = props;
  return (
    <Card size="small" className={styles.cardwrapper} style={inlineStyles}>
      <Row>
        <Col span="6">
          <span className={styles.iconwrapper}>
            <FontAwesomeIcon icon={IconName} color={IconColor} />
          </span>
        </Col>
        <Col span="16">
          <p>{title}</p>
          <h3>{Subtitle}</h3>
        </Col>
      </Row>
    </Card>
  );
};

export default CardWithLeftIcon;
