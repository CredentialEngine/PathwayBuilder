import { CaretRightOutlined } from '@ant-design/icons';
import { Divider, Drawer, Row, Collapse } from 'antd';
import _, { noop } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { GET_ICON_URL } from '../../apiConfig/endpoint';

//import { TEMP_BASE_URL } from '../../apiConfig/setting';

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
  // const [destinationText, setDestinationText] = useState('');
  //const [destinationTextCondition, setDestinationTextCondition] =
  useState(true);
  const ref = useRef(null);
  const [rightPanelData, setRightPanelData] = useState<any>();
  const [relatedConditionalComponent, setRelatedConditionalComponent] =
    useState<any>([]);

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

  useEffect(() => {
    if (!_.isEmpty(panelData) && !_.isNull(panelData)) {
      setRightPanelData(panelData);
    }
  }, [panelData]);

  const extractComponentType = (type: string) => {
    const typeValue = type?.split(':')[1];

    return typeValue;
  };

  const pathwayWrapper = useSelector((state: any) => state.initalReducer);
  const organizationName = pathwayWrapper?.pathwayComponentData?.data
    ? pathwayWrapper?.mappedData?.Pathway?.Organization?.Name
    : pathwayWrapper?.mappedData?.Pathway?.Organization?.Name;

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
            {extractComponentType(
              rightPanelData?.Type.replace('Component', '')
            )}
          </Row>
        </div>
        <Divider className={styles.divider} />
        <Row className={styles.topRow}>
          <Row>
            <div style={{ flexDirection: 'row', display: 'flex' }}>
              {rightPanelData?.Type?.toLowerCase().includes(
                'credential'.toLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' credentialCard'}>
                  <img
                    src={`${GET_ICON_URL}CredentialComponent.png`}
                    alt="CredentialComponent"
                  />
                </span>
              )}
              {rightPanelData?.Type?.toLowerCase().includes(
                'course'.toLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' courseCard'}>
                  <img
                    src={`${GET_ICON_URL}CourseComponent.png`}
                    alt="courseComponent"
                  />
                </span>
              )}
              {rightPanelData?.Type?.toLowerCase().includes(
                'Basic'.toLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' basicCard'}>
                  <img
                    src={`${GET_ICON_URL}BasicComponent.png`}
                    alt="BasicComponent"
                  />
                </span>
              )}
              {rightPanelData?.Type?.toLowerCase().includes(
                'competency'.toLocaleLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' competencyCard'}>
                  <img
                    src={`${GET_ICON_URL}CompetencyComponent.png`}
                    alt="CompetencyComponent"
                  />
                </span>
              )}
              {rightPanelData?.Type?.toLowerCase().includes(
                'assessment'.toLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' assessmentCard'}>
                  <img
                    src={`${GET_ICON_URL}AssessmentComponent.png`}
                    alt="AssessmentComponent"
                  />
                </span>
              )}

              {rightPanelData?.Type?.toLowerCase().includes(
                'Cocurricular'.toLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' cocurricularCard'}>
                  <img
                    src={`${GET_ICON_URL}CocurricularComponent.png`}
                    alt="CocurricularComponent"
                  />
                </span>
              )}
              {rightPanelData?.Type?.toLowerCase().includes(
                'Extracurricular'.toLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' extraCurricularCard'}>
                  <img
                    src={`${GET_ICON_URL}ExtracurricularComponent.png`}
                    alt="ExtracurricularComponent"
                  />
                </span>
              )}
              {rightPanelData?.Type?.toLowerCase().includes(
                'selection'.toLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' customicon'}>
                  <img
                    src={`${GET_ICON_URL}SelectionComponent.png`}
                    alt="SelectionComponent"
                  />
                </span>
              )}
              {rightPanelData?.Type?.toLowerCase().includes(
                'WorkExperience'.toLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' workExperienceCard'}>
                  <img
                    src={`${GET_ICON_URL}WorkExperienceComponent.png`}
                    alt="WorkExperienceComponent"
                  />
                </span>
              )}
              {rightPanelData?.Type?.toLowerCase().includes(
                'JobComponent'.toLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' jobCard'}>
                  <img
                    src={`${GET_ICON_URL}JobComponent.png`}
                    alt="JobComponent"
                  />
                </span>
              )}
              {rightPanelData?.Type?.toLowerCase().includes(
                'Addressing'.toLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' customicon'}>
                  <img
                    src={`${GET_ICON_URL}AddressingComponent.png`}
                    alt="AddressingConflictComponent"
                  />
                </span>
              )}
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
        {rightPanelData?.Type?.toLowerCase().includes(
          'CredentialComponent'.toLowerCase() && (
            <Row className={styles.infoContainer}>
              <p className={styles.label}>
                {rightPanelData?.Type?.split(':')[1].replace('Component', '')}{' '}
                Type
              </p>
              <p className={styles.value}>
                {extractComponentType(rightPanelData?.Type) ==
                'CredentialComponent'
                  ? extractComponentType(rightPanelData?.CredentialType)
                  : extractComponentType(
                      rightPanelData?.Type.replace('Component', '')
                    )}
              </p>
            </Row>
          )
        )}
        {rightPanelData?.Description != '' &&
          rightPanelData?.Description != undefined && (
            <Row className={styles.infoContainer}>
              <p className={styles.label}>Description</p>
              <p className={styles.value}>{rightPanelData?.Description}</p>
            </Row>
          )}
        {/* {(rightPanelData?.SubjectWebpage != '' && rightPanelData?.SubjectWebpage != undefined) && (
          <Row className={styles.infoContainer}>
            <p className={styles.label}>Subject Webpage</p>
            <p className={styles.value}>{rightPanelData?.SubjectWebpage}</p>
          </Row>
        )} */}
        {/* {rightPanelData?.CreditValue[0]?.Value > 0 && (
          <Row className={styles.infoContainer}>
            <p className={styles.label}>Credit Value</p>
            <p className={styles.value}>
              {rightPanelData?.CreditValue[0]?.Value}
            </p>
          </Row>
        )} */}
        {/* {(rightPanelData?.ComponentDesignation != '' && rightPanelData?.ComponentDesignation != undefined) && (
          <Row className={styles.infoContainer}>
            <p className={styles.label}>Component Designation</p>
            <p className={styles.value}>
              {rightPanelData?.ComponentDesignation.join(', ')}
            </p>
          </Row>
        )} */}
        {/* {rightPanelData?.Identifier[0]?.Value > 0 && (
          <Row className={styles.infoContainer}>
            <p className={styles.label}>Identifier Value</p>
            <p className={styles.value}>
              {rightPanelData?.Identifier[0]?.Value}
            </p>
          </Row>
        )} */}
        <Row className={styles.infoContainer}>
          <p className={styles.label}>
            {rightPanelData?.Type?.split(':')[1].replace('Component', '')}{' '}
            Status
          </p>
          <p className={styles.value}>Active</p>
        </Row>
        {rightPanelData?.FinderResource !== undefined && (
          <Row className={styles.buttonContainer}>
            <Button
              className={styles.button}
              type={Type.LINK}
              onClick={openInNewTab}
              text={`View the ${rightPanelData?.Type?.split(':')[1].replace(
                'Component',
                ''
              )}`}
            />
          </Row>
        )}
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
