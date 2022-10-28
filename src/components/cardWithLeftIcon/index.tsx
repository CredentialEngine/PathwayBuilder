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
  getUpdatedCardArr?: (value: any) => void;
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
  const {
    Name,
    Description,
    CodedNotation,
    inlineStyles,
    id,
    disabledItem,
    CTID,
    Type,
  } = props.data;
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
    !!props.getUpdatedCardArr && props.getUpdatedCardArr(CTID);
    if (isDraggableCardVisibleMethod) isDraggableCardVisibleMethod(false);
    // e.target.style.visibility = 'visible';

    // e.target.style.position = 'absolute';
    // e.target.style.left = `${e.pageX + 75} px`;
    // e.target.style.top = `${e.pageY - 75}px`;
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
            {isComponentTab ? (
              <>
                {data?.Type?.toLowerCase().includes(
                  'AssessmentComponent'.toLowerCase()
                ) && (
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/AssessmentComponent.png`}
                    alt="AssessmentComponent"
                    className="componentIcon"
                  />
                )}
                {data?.Type?.toLowerCase().includes(
                  'BasicComponent'.toLowerCase()
                ) && (
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/BasicComponent.png`}
                    alt="BasicComponent"
                    className="componentIcon"
                  />
                )}
                {data?.Type?.toLowerCase().includes(
                  'CocurricularComponent'.toLowerCase()
                ) && (
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/CocurricularComponent.png`}
                    alt="CocurricularComponent"
                    className="componentIcon"
                  />
                )}
                {data?.Type?.toLowerCase().includes(
                  'CompetencyComponent'.toLowerCase()
                ) && (
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/CompetencyComponent.png`}
                    alt="CompetencyComponent"
                    className="componentIcon"
                  />
                )}
                {data?.Type?.toLowerCase().includes(
                  'CourseComponent'.toLowerCase()
                ) && (
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/CourseComponent.png`}
                    alt="CourseComponent"
                    className="componentIcon"
                  />
                )}
                {data?.Type?.toLowerCase().includes(
                  'ExtracurricularComponent'.toLowerCase()
                ) && (
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/ExtracurricularComponent.png`}
                    alt="ExtracurricularComponent"
                    className="componentIcon"
                  />
                )}
                {data?.Type?.toLowerCase().includes(
                  'JobComponent'.toLowerCase()
                ) && (
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/JobComponent.png`}
                    alt="JobComponent"
                    className="componentIcon"
                  />
                )}
                {data?.Type?.toLowerCase().includes(
                  'WorkExperienceComponent'.toLowerCase()
                ) && (
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/WorkExperienceComponent.png`}
                    alt="WorkExperienceComponent"
                    className="componentIcon"
                  />
                )}
                {data?.Type?.toLowerCase().includes(
                  'CredentialComponent'.toLowerCase()
                ) && (
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/CredentialComponent.png`}
                    alt="CredentialComponent"
                    className="componentIcon"
                  />
                )}
                {data?.Type?.toLowerCase().includes(
                  'ComponentCondition'.toLowerCase()
                ) && (
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/ComponentCondition.png`}
                    alt="ComponentCondition"
                    className="componentIcon"
                  />
                )}
                {data?.Type?.toLowerCase().includes(
                  'selection'.toLowerCase()
                ) && (
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/SelectionCondition.png`}
                    alt="SelectionCondition"
                    className="componentIcon"
                  />
                )}
              </>
            ) : (
              <>
                {Type?.toLowerCase().includes('credential'.toLowerCase()) && (
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/CredentialComponent.png`}
                    alt="CredentialComponent"
                    className="componentIcon"
                  />
                )}
                {Type?.toLowerCase().includes('course'.toLowerCase()) && (
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/CourseComponent.png`}
                    alt="courseComponent"
                    className="componentIcon"
                  />
                )}
                {Type?.toLowerCase().includes('Basic'.toLowerCase()) && (
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/BasicComponent.png`}
                    alt="BasicComponent"
                    className="componentIcon"
                  />
                )}
                {Type?.toLowerCase().includes(
                  'competency'.toLocaleLowerCase()
                ) && (
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/CompetencyComponent.png`}
                    alt="CompetencyComponent"
                    className="componentIcon"
                  />
                )}
                {Type?.toLowerCase().includes('assessment'.toLowerCase()) && (
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/AssessmentComponent.png`}
                    alt="AssessmentComponent"
                    className="componentIcon"
                  />
                )}

                {Type?.toLowerCase().includes('Cocurricular'.toLowerCase()) && (
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/CocurricularComponent.png`}
                    alt="CocurricularComponent"
                    className="componentIcon"
                  />
                )}
                {Type?.toLowerCase().includes(
                  'Extracurricular'.toLowerCase()
                ) && (
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/ExtracurricularComponent.png`}
                    alt="ExtracurricularComponent"
                    className="componentIcon"
                  />
                )}
                {Type?.toLowerCase().includes('selection'.toLowerCase()) && (
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/SelectionComponent.png`}
                    alt="SelectionComponent"
                    className="componentIcon"
                  />
                )}
                {Type?.toLowerCase().includes(
                  'WorkExperience'.toLowerCase()
                ) && (
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/WorkExperienceComponent.png`}
                    alt="WorkExperienceComponent"
                    className="componentIcon"
                  />
                )}
                {Type?.toLowerCase().includes('JobComponent'.toLowerCase()) && (
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/JobComponent.png`}
                    alt="JobComponent"
                    className="componentIcon"
                  />
                )}
                {Type?.toLowerCase().includes('Addressing'.toLowerCase()) && (
                  <img
                    src={`${
                      process.env.NODE_ENV !== 'production'
                        ? sanboxSetting.api.url
                        : productionSetting.api.url
                    }Images/PathwayBuilder/AddressingComponent.png`}
                    alt="AddressingConflictComponent"
                    className="componentIcon"
                  />
                )}
              </>
            )}
          </span>
        </Col>
        <Col span="19">
          <>
            <p>{Name}</p>
            <h5>
              {(CodedNotation ? CodedNotation : '') +
                ' ' +
                Description?.slice(0, 30)}
            </h5>
          </>
        </Col>
      </Row>
    </Card>
  );
};

export default CardWithLeftIcon;
