import { CaretRightOutlined } from '@ant-design/icons';
import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, Drawer, Row, Collapse } from 'antd';
import _, { noop } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

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
  const [rightPanelData, setRightPanelData] = useState<any>();
  const [relatedConditionalComponent, setRelatedConditionalComponent] =
    useState<any>([]);

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

  useEffect(() => {
    if (!_.isEmpty(panelData) && !_.isNull(panelData)) {
      setRightPanelData(panelData);
    }
  }, [panelData]);

  const extractComponentType = (type: string) => {
    const typeValue = type?.split(':')[1];

    return typeValue;
  };

  const viewDescription = () => {
    setDestinationText(rightPanelData?.Description);
    setDestinationTextCondition(false);
  };
  const hideDescription = () => {
    const truncatedDescription = rightPanelData?.Description?.substr(0, 300);
    setDestinationText(truncatedDescription);
    setDestinationTextCondition(true);
  };
  const pathwayWrapper = useSelector((state: any) => state.initalReducer);
  const organizationName = pathwayWrapper?.pathwayComponentData?.data
    ? pathwayWrapper?.pathwayComponentData?.data?.Pathway?.Organization?.Name
    : pathwayWrapper?.selectedOrganization?.Name;

  useEffect(() => {
    const relatedConditionalComponent =
      pathwayWrapper?.mappedData?.ComponentConditions?.filter(
        (conditional_card: any) =>
          rightPanelData?.HasCondition?.includes(conditional_card.RowId)
      );
    setRelatedConditionalComponent(relatedConditionalComponent);
  }, [rightPanelData]);

  useEffect(
    () => () => {
      setRightPanelData(null);
    },
    []
  );
  const openInNewTab = () => {
    window.open(
      rightPanelData?.FinderResource?.URI,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <Drawer visible={visible} closable={true} className={styles.right_drawer}>
      <div ref={ref} className={styles.rightPanelContainer}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Row style={{ fontSize: 22, fontWeight: 700 }}>
            {extractComponentType(rightPanelData?.Type)}
          </Row>
        </div>
        <Divider className={styles.divider} />
        <Row className={styles.topRow}>
          <Row>
            <div style={{ flexDirection: 'row', display: 'flex' }}>
              <FontAwesomeIcon
                icon={faCubes}
                style={{ height: '30px' }}
                onClick={() => onCloseHandler(false)}
              />
              <span className={styles.name}>
                {rightPanelData && rightPanelData?.Name}
              </span>
            </div>
          </Row>
          <Row>
            <Button
              style={{ display: 'none' }}
              className={styles.button}
              onClick={noop}
              text="Replace"
            />
          </Row>
        </Row>
        <Row className={styles.infoContainer}>
          <p className={styles.label}>References Resource:</p>
          <p className={styles.value}>{rightPanelData?.Name}</p>
        </Row>
        <Row className={styles.infoContainer}>
          <p className={styles.label}>Owned and Offered by</p>
          <p className={styles.value}>{organizationName}</p>
        </Row>
        <Row className={styles.infoContainer}>
          <p className={styles.label}>
            {rightPanelData?.Type?.split(':')[1]} Type
          </p>
          <p className={styles.value}>
            {extractComponentType(rightPanelData?.Type)}
          </p>
        </Row>
        <Row className={styles.infoContainer}>
          <p className={styles.label}>
            {rightPanelData?.Type?.split(':')[1]} Status
          </p>
          <p className={styles.value}>Active</p>
        </Row>
        <Row className={styles.buttonContainer}>
          <Button
            className={styles.button}
            type={Type.LINK}
            onClick={openInNewTab}
            text={`View the ${rightPanelData?.Type?.split(':')[1]}`}
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
            {relatedConditionalComponent?.length > 0 &&
              relatedConditionalComponent.map(
                (related_card: any, index: any) => (
                  <Panel
                    header={
                      <>
                        <span className={styles.require}>
                          Requires ({related_card?.RequiredNumber})
                        </span>
                      </>
                    }
                    key={index}
                  >
                    <p className={styles.text}>{related_card?.Description}</p>
                  </Panel>
                )
              )}
          </Collapse>
        </Row>
      </div>
    </Drawer>
  );
};

export default RightPanel;
