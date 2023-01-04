import { Card, Col, Row } from 'antd';
import React from 'react';

import { productionSetting, sanboxSetting } from '../../apiConfig/setting';

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
  isDraggableCardVisibleMethod?: (value: any) => any;
  disabledItem?: any;
  CTID?: any;
  data?: any;
  IconName?: any;
  isComponentTab?: boolean;
  setLeftpanelSelectedElem?: (a: HTMLElement) => void;
}

const CardWithLeftIcon: React.FC<Props> = (props: Props) => {
  const {
    isComponentTab,
    data,
    isDraggableCardVisibleMethod,
    setLeftpanelSelectedElem,
  } = props;
  const { Name, inlineStyles, id, disabledItem, Type } = props.data;
  const onDragStart = (e: any) => {
    const target = e.target;
    !!setLeftpanelSelectedElem && setLeftpanelSelectedElem(e.target);

    e.dataTransfer.setData(
      'card_id',
      JSON.stringify({
        ...props.data,
        isPendingCards: true,
        isComponentTab: isComponentTab ? true : false,
      })
    );

    if (isDraggableCardVisibleMethod) isDraggableCardVisibleMethod(true);
    setTimeout(() => {
      target.style.display = 'hidden';
    }, 0);
  };

  const onDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDragEnd = (e: any) => {
    e.target.style.visibility = 'visible';
    if (isDraggableCardVisibleMethod) isDraggableCardVisibleMethod(false);
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
          {isComponentTab ? (
            <>
              {data?.Type?.toLowerCase().includes(
                'AssessmentComponent'.toLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' assessmentCard'}>
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/AssessmentComponent.png`}
                    alt="AssessmentComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {data?.Type?.toLowerCase().includes(
                'BasicComponent'.toLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' basicCard'}>
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/BasicComponent.png`}
                    alt="BasicComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {data?.Type?.toLowerCase().includes(
                'CocurricularComponent'.toLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' cocurricularCard'}>
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/CocurricularComponent.png`}
                    alt="CocurricularComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {data?.Type?.toLowerCase().includes(
                'CompetencyComponent'.toLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' competencyCard'}>
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/CompetencyComponent.png`}
                    alt="CompetencyComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {data?.Type?.toLowerCase().includes(
                'CourseComponent'.toLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' courseCard'}>
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/CourseComponent.png`}
                    alt="CourseComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {data?.Type?.toLowerCase().includes(
                'ExtracurricularComponent'.toLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' extraCurricularCard'}>
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/ExtracurricularComponent.png`}
                    alt="ExtracurricularComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {data?.Type?.toLowerCase().includes(
                'JobComponent'.toLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' jobCard'}>
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/JobComponent.png`}
                    alt="JobComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {data?.Type?.toLowerCase().includes(
                'WorkExperienceComponent'.toLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' workExperienceCard'}>
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/WorkExperienceComponent.png`}
                    alt="WorkExperienceComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {data?.Type?.toLowerCase().includes(
                'CredentialComponent'.toLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' credentialCard'}>
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/CredentialComponent.png`}
                    alt="CredentialComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {data?.Type?.toLowerCase().includes(
                'ComponentCondition'.toLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' customicon'}>
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/ComponentCondition.png`}
                    alt="ComponentCondition"
                    className="componentIcon"
                  />
                </span>
              )}
              {data?.Type?.toLowerCase().includes(
                'selection'.toLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' customicon'}>
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/SelectionCondition.png`}
                    alt="SelectionCondition"
                    className="componentIcon"
                  />
                </span>
              )}
            </>
          ) : (
            <>
              {Type?.toLowerCase().includes('credential'.toLowerCase()) && (
                <span className={styles.iconwrapper + ' credentialCard'}>
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/CredentialComponent.png`}
                    alt="CredentialComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {Type?.toLowerCase().includes('course'.toLowerCase()) && (
                <span className={styles.iconwrapper + ' courseCard'}>
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/CourseComponent.png`}
                    alt="courseComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {Type?.toLowerCase().includes('Basic'.toLowerCase()) && (
                <span className={styles.iconwrapper + ' basicCard'}>
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/BasicComponent.png`}
                    alt="BasicComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {Type?.toLowerCase().includes(
                'competency'.toLocaleLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' competencyCard'}>
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/CompetencyComponent.png`}
                    alt="CompetencyComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {Type?.toLowerCase().includes('assessment'.toLowerCase()) && (
                <span className={styles.iconwrapper + ' assessmentCard'}>
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/AssessmentComponent.png`}
                    alt="AssessmentComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {Type?.toLowerCase().includes('Cocurricular'.toLowerCase()) && (
                <span className={styles.iconwrapper + ' cocurricularCard'}>
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/CocurricularComponent.png`}
                    alt="CocurricularComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {Type?.toLowerCase().includes(
                'Extracurricular'.toLowerCase()
              ) && (
                <span className={styles.iconwrapper + ' extraCurricularCard'}>
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/ExtracurricularComponent.png`}
                    alt="ExtracurricularComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {Type?.toLowerCase().includes('selection'.toLowerCase()) && (
                <span className={styles.iconwrapper + ' customicon'}>
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/SelectionComponent.png`}
                    alt="SelectionComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {Type?.toLowerCase().includes('WorkExperience'.toLowerCase()) && (
                <span className={styles.iconwrapper + ' workExperienceCard'}>
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/WorkExperienceComponent.png`}
                    alt="WorkExperienceComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {Type?.toLowerCase().includes('JobComponent'.toLowerCase()) && (
                <span className={styles.iconwrapper + ' jobCard'}>
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/JobComponent.png`}
                    alt="JobComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {Type?.toLowerCase().includes('Addressing'.toLowerCase()) && (
                <span className={styles.iconwrapper + ' customicon'}>
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/AddressingComponent.png`}
                    alt="AddressingConflictComponent"
                    className="componentIcon"
                  />
                </span>
              )}
            </>
          )}
        </Col>
        <Col span="19">
          <>
            <p>{data?.Type?.split(':')[1].replace('Component', '')}</p>
            {data?.Type?.toLowerCase().includes(
              'CompetencyComponent'.toLowerCase()
            ) ? (
              <h5 title={data?.Description}>{data?.Description}</h5>
            ) : (
              <h5>{Name}</h5>
            )}
          </>
        </Col>
      </Row>
    </Card>
  );
};

export default CardWithLeftIcon;
