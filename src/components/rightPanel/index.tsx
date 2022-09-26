import { CaretRightOutlined } from '@ant-design/icons';
import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, Drawer, Row, Collapse } from 'antd';
import { noop } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';

const { Panel } = Collapse;
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
  const [destinationText, setDestinationText] = useState('');
  const [destinationTextCondition, setDestinationTextCondition] =
    useState(true);

  const ref = useRef(null);

  useEffect(() => {
    document?.addEventListener('click', handleOutsideClick, true);
    destinationTextCondition && hideDescription();
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
    const typeValue = type?.split(':')[1];
    return typeValue;
  };

  const viewDescription = () => {
    setDestinationText(panelData?.Description);
    setDestinationTextCondition(false);
  };
  const hideDescription = () => {
    const truncatedDescription = panelData.Description?.substr(0, 300);
    setDestinationText(truncatedDescription);
    setDestinationTextCondition(true);
  };
  return (
    <Drawer visible={visible} closable={true} className={styles.right_drawer}>
      <div ref={ref} className={styles.rightPanelContainer}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Row style={{ fontSize: 22, fontWeight: 700 }}>
            Transaction Review
          </Row>
        </div>
        <Divider className={styles.divider} />
        <Row className={styles.topRow}>
          <Row>
            <FontAwesomeIcon
              icon={faCubes}
              style={{ height: '30px' }}
              onClick={() => onCloseHandler(false)}
            />
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
          <p className={styles.content}>{destinationText}</p>
        </Row>
        <Row className={styles.buttonContainer}>
          {destinationTextCondition ? (
            <Button
              className={styles.button}
              type={Type.LINK}
              onClick={viewDescription}
              text="View More"
            />
          ) : (
            <Button
              className={styles.button}
              type={Type.LINK}
              onClick={hideDescription}
              text="View less"
            />
          )}
        </Row>
        <Divider />
        <Row className={styles.requiredBlock}>
          <Collapse
            defaultActiveKey={['1']}
            ghost
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
          >
            <Panel
              header={
                <>
                  <span className={styles.require}>Requires (1)</span>
                </>
              }
              key="1"
            >
              <p className={styles.text}>Pass the Business of Retail Exam</p>
            </Panel>
          </Collapse>
        </Row>
      </div>
    </Drawer>
  );
};

export default RightPanel;
