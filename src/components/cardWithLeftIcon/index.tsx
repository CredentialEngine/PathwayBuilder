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
  draggable?: boolean;
  type?: string;
  SubTitle?: string;
  title?: string;
  id?: number | string;
  getUpdatedCardArr?: (value: any) => void;
}

const CardWithLeftIcon: React.FC<Props> = (props: Props) => {
  const {
    name,
    description,
    IconName,
    IconColor,
    inlineStyles,
    draggable,
    id,
    getUpdatedCardArr,
  } = props;

  const onDragStart = (e: any) => {
    const target = e.target;
    e.dataTransfer.setData('card_id', JSON.stringify(props));
    getUpdatedCardArr && getUpdatedCardArr(props.id);
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
      id={id?.toString()}
    >
      <Row>
        <Col span="5">
          <span className={styles.iconwrapper + ' customicon'}>
            <FontAwesomeIcon icon={IconName} color={IconColor} />
          </span>
        </Col>
        <Col span="19">
          <p>{name}</p>
          <h5>{description}</h5>
        </Col>
      </Row>
    </Card>
  );
};

export default CardWithLeftIcon;
