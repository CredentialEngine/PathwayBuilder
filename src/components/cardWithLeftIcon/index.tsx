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
  CTID?: any;
  data?: any;
  IconName?: any;
}

const CardWithLeftIcon: React.FC<Props> = (props: Props) => {
  const {
    Name,
    Description,
    CodedNotation,
    IconColor,
    inlineStyles,
    id,
    disabledItem,
    CTID,
    Type,
  } = props.data;

  const onDragStart = (e: any) => {
    const target = e.target;
    e.dataTransfer.setData('card_id', JSON.stringify(props.data));

    setTimeout(() => {
      target.style.display = 'hidden';
    }, 0);
  };

  const onDragOver = (e: any) => {
    e.stopPropagation();
  };

  const onDragEnd = (e: any) => {
    e.target.style.visibility = 'visible';
    !!props.getUpdatedCardArr && props.getUpdatedCardArr(CTID);
  };
  return (
    <Card
      size="small"
      className={styles.cardwrapper + ' ' + disabledItem}
      style={inlineStyles}
      draggable={true}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      id={id?.toString()}
    >
      <Row>
        <Col span="5">
          <span className={styles.iconwrapper + ' customicon'}>
            {Type?.toLowerCase().includes('credential'.toLowerCase()) && (
              <FontAwesomeIcon icon={faStar} color={IconColor} />
            )}
            {Type?.toLowerCase().includes('course'.toLowerCase()) && (
              <FontAwesomeIcon icon={faCubes} color={IconColor} />
            )}
            {Type?.toLowerCase().includes('Basic'.toLowerCase()) && (
              <FontAwesomeIcon icon={faCubes} color={IconColor} />
            )}
            {Type?.toLowerCase().includes('competency'.toLocaleLowerCase()) && (
              <FontAwesomeIcon icon={faGear} color={IconColor} />
            )}
            {Type?.toLowerCase().includes('assessment'.toLowerCase()) && (
              <FontAwesomeIcon icon={faFileCircleCheck} color={IconColor} />
            )}
          </span>
        </Col>
        <Col span="19">
          <p>{Name}</p>
          <h5>
            {(CodedNotation ? CodedNotation : '') +
              ' ' +
              Description.slice(0, 30)}
          </h5>
        </Col>
      </Row>
    </Card>
  );
};

export default CardWithLeftIcon;
