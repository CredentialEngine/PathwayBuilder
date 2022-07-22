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
  draggable?: boolean;
  type?: string;
}

const CardWithLeftIcon: React.FC<Props> = (props: Props) => {
  const { title, Subtitle, IconName, IconColor, inlineStyles, draggable } =
    props;

  const onDragStart = (e: any) => {
    const target = e.target;
    e.dataTransfer.setData('card_id', JSON.stringify(props));
    setTimeout(() => {
      target.style.display = 'hidden';
    }, 0);
  };

  const onDragOver = (e: any) => {
    e.stopPropagation();
  };

  const onDragEnd = (e: any) => {
    e.target.style.visibility = 'visible';
  };

  return (
    <Card
      size="small"
      className={styles.cardwrapper}
      style={inlineStyles}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <Row>
        <Col span="5">
          <span className={styles.iconwrapper}>
            <FontAwesomeIcon icon={IconName} color={IconColor} />
          </span>
        </Col>
        <Col span="16">
          <p>{title}</p>
          <h5>{Subtitle}</h5>
        </Col>
      </Row>
    </Card>
  );
};

export default CardWithLeftIcon;
