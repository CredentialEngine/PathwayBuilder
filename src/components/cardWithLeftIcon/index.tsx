import { faAirFreshener } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Col, Row } from 'antd';
import React from 'react';

import styles from './index.module.scss';

const CardWithLeftIcon: React.FC = () => (
  <Card size="small" className={styles.cardwrapper}>
    <Row>
      <Col span="6">
        <span className={styles.iconwrapper}>
          <FontAwesomeIcon
            // className={styles.infoIcon}
            icon={faAirFreshener}
            color="red"
          />
          <i className="fa-light fa-cubes"></i>
        </span>
      </Col>
      <Col span="16">
        <p>Course</p>
        <h3>Business of Retail Course</h3>
      </Col>
    </Row>
  </Card>
);

export default CardWithLeftIcon;
