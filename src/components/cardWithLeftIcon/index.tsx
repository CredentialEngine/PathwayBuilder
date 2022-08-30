import {
  faCubes,
  faGear,
  faFileCircleCheck,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Col, Row } from 'antd';
import React from 'react';

import styles from './index.module.scss';

export interface Props {
  name?: string;
  description?: string;
  codedNotation?: string;
  IconColor?: string;
  inlineStyles?: any;
  draggable?: boolean;
  type?: string;
  SubTitle?: string;
  title?: string;
  id?: number | string;
  uri?: string;
  getUpdatedCardArr?: (value: any) => void;
  disabledItem?: any;
}

const CardWithLeftIcon: React.FC<Props> = (props: Props) => {
  const {
    name,
    codedNotation,
    IconColor,
    inlineStyles,
    draggable,
    id,
    getUpdatedCardArr,
    disabledItem,
    type,
  } = props;

  const componentName = type?.split(':');
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
      className={styles.cardwrapper + ' ' + disabledItem}
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
            {type == 'credentials' && (
              <FontAwesomeIcon icon={faStar} color={IconColor} />
            )}
            {type == 'course' && (
              <FontAwesomeIcon icon={faCubes} color={IconColor} />
            )}
            {type == 'competency' && (
              <FontAwesomeIcon icon={faGear} color={IconColor} />
            )}
            {type == 'assessment' && (
              <FontAwesomeIcon icon={faFileCircleCheck} color={IconColor} />
            )}
          </span>
        </Col>
        <Col span="19" style={{ display: 'flex', justifyContent: 'center' }}>
          <p>{!!componentName && componentName[1]}</p>
          <h5>{(codedNotation ? codedNotation : '') + ' ' + name ?? 'Test'}</h5>
        </Col>
      </Row>
    </Card>
  );
};

export default CardWithLeftIcon;
