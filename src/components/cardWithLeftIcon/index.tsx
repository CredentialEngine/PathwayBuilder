import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Col, Row } from 'antd';
import React from 'react';

import styles from './index.module.scss';

export interface Props {
  name?: string;
  description?: string;
  IconName: IconProp;
  IconColor?: string;
  inlineStyles?: any;
}

const CardWithLeftIcon: React.FC<Props> = (props: Props) => {
  const { name, description, IconName, IconColor, inlineStyles } = props;
  return (
    <Card size="small" className={styles.cardwrapper} style={inlineStyles}>
      <Row>
        <Col span="5">
          <span className={styles.iconwrapper}>
            <FontAwesomeIcon icon={IconName} color={IconColor} />
          </span>
        </Col>
        <Col span="16">
          <p>{name}</p>
          <h5>{description}</h5>
        </Col>
      </Row>
    </Card>
  );
};

export default CardWithLeftIcon;
