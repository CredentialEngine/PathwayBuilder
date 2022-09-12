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
  panelData?: any;
}

const RightPanel: React.FC<Props> = ({
  onCloseHandler,
  visible,
  panelData,
}) => {
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
  const extractComponentType = (type: string) => {
    const typeValue = type.split(':')[1];
    return typeValue;
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
            <span className={styles.name}>
              {extractComponentType(panelData?.Type)}
            </span>
          </Row>
          <Row>
            <Button className={styles.button} onClick={noop} text="Replace" />
          </Row>
        </Row>
        <Row className={styles.infoContainer}>
          <p className={styles.label}>References Resource:</p>
          <p className={styles.value}>{panelData?.Name}</p>
        </Row>
        <Row className={styles.infoContainer}>
          <p className={styles.label}>Owned and Offered by</p>
          <p className={styles.value}>{panelData?.ProxyForLabel}</p>
        </Row>
        <Row className={styles.infoContainer}>
          <p className={styles.label}>Credential Type</p>
          <p className={styles.value}>
            {extractComponentType(panelData?.Type)}
          </p>
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
          <p className={styles.content}>{panelData?.Description}</p>
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
