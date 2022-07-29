import { faCaretDown, faCubes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, Drawer, Row } from 'antd';
import { noop } from 'lodash';
import React, { useEffect, useRef } from 'react';

import Button from '../button';

import { Type } from '../button/type';

import styles from './index.module.scss';

interface Props {
  visible?: boolean;
  onCloseHandler: (value: boolean) => void;
}

const RightPanel: React.FC<Props> = ({ onCloseHandler, visible }) => {
  const ref = useRef(null);

  useEffect(() => {
    document?.addEventListener('click', handleOutsideClick, true);
  }, []);

  const handleOutsideClick = (e: any) => {
    if (ref && ref?.current) {
      //@ts-ignore
      if (!ref?.current?.contains(e.target)) {
        onCloseHandler(false);
      }
    }
  };

  return (
    <Drawer visible={visible} closable={false}>
      <div ref={ref} className={styles.rightPanelContainer}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Row style={{ fontSize: 22, fontWeight: 700 }}>
            Transaction Review
          </Row>
        </div>
        <Divider className={styles.divider} />
        <Row className={styles.topRow}>
          <Row>
            <FontAwesomeIcon icon={faCubes} style={{ height: '30px' }} />
            <span className={styles.name}>Credential Component</span>
          </Row>
          <Row>
            <Button className={styles.button} onClick={noop} text="Replace" />
          </Row>
        </Row>
        <Row className={styles.infoContainer}>
          <p className={styles.label}>References Resource:</p>
          <p className={styles.value}>Business of Retail</p>
        </Row>
        <Row className={styles.infoContainer}>
          <p className={styles.label}>Owned and Offered by</p>
          <p className={styles.value}>
            NRF Foundation (National Retail Federation)
          </p>
        </Row>
        <Row className={styles.infoContainer}>
          <p className={styles.label}>Credential Type</p>
          <p className={styles.value}>Certification</p>
        </Row>
        <Row className={styles.infoContainer}>
          <p className={styles.label}>Credential Status</p>
          <p className={styles.value}>Active</p>
        </Row>
        <Row className={styles.buttonContainer}>
          <Button
            className={styles.button}
            type={Type.LINK}
            onClick={noop}
            text="View the Credential"
          />
        </Row>
        <Divider />
        <Row>
          <p className={styles.content}>
            Business of Retail: Operations & Profit, is perfect for students who
            are interested in advancing a career or need to better understand
            how a business is run. Students will further their customer service
            skills and understand merchandising, marketing, store operations,
            inventory management, loss prevention and workplace safety. They
            will master math concepts, including determining pricing strategies
            and calculating profit and discounts. They will also learn best
            practices for how to plan for a career and get promoted.
          </p>
        </Row>
        <Row className={styles.buttonContainer}>
          <Button
            className={styles.button}
            type={Type.LINK}
            onClick={noop}
            text="View less"
          />
        </Row>
        <Divider />
        <Row className={styles.requiredBlock}>
          <FontAwesomeIcon
            icon={faCaretDown}
            style={{ height: '20px', alignSelf: 'center' }}
          />
          <span className={styles.require}>Requires (1)</span>
        </Row>
        <p className={styles.text}>Pass the Business of Retail Exam</p>
      </div>
    </Drawer>
  );
};

export default RightPanel;
