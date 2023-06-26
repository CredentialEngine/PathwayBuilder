import { faCircle, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Card, Col, Row } from 'antd';
import React, { useState } from 'react';

import { GET_ICON_URL } from '../../apiConfig/endpoint';

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
  const [showDescription, setShowDescription] = useState<boolean>(false);
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
  const getDescription = (type: any) => {
    let text = '';
    switch (type) {
      case 'ceterms:assessmentcomponent':
        text =
          'Resource that identifies a direct, indirect, formative, and summative evaluation or estimation of the nature, ability, or quality of a resource, performance, or outcome of an action.';
        break;
      case 'ceterms:credentialcomponent':
        text =
          ' Resource that identifies another resource that describes qualification, achievement, personal or organizational quality, or aspect of an identity typically used to indicate suitability.';
        break;
      case 'ceterms:jobcomponent':
        text =
          'Resource that identifies a work position, employment, or occupation.';
        break;
      case 'ceterms:workexperiencecomponent':
        text =
          'Resource describing an activity or training through which a person gains job experience.';
        break;
      case 'ceterms:cocurricularcomponent':
        text =
          'Resource that identifies an activity, program, or informal learning experience such as a civic or service activity that supplements and complements the curriculum.';
        break;
      case 'ceterms:extracurricularcomponent':
        text =
          'Resource that identifies an activity, program, or informal learning experience that may be offered or provided by a school, college, or other organization that is not connected to a curriculum.';
        break;
      case 'ceterms:basiccomponent':
        text =
          'Resource that identifies a resource not otherwise covered by the enumerated PathwayComponent subclasses.';
        break;
      case 'ceterms:competencycomponent':
        text =
          'Resource that identifies a measurable or observable knowledge, skill, or ability necessary to successful performance of a person in a given context.';
        break;
      case 'ceterms:coursecomponent':
        text =
          'Resource that identifies a structured sequence of one or more learning activities that aims to develop a prescribed set of knowledge, skill, or ability of learners.';
        break;
      case 'ceterms:componentcondition':
        text =
          ' Resource that describes what must be done to complete a PathwayComponent, or part thereof, as determined by the issuer of the Pathway.';
        break;
    }
    return text;
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
      bodyStyle={
        data?.Type?.toLowerCase().includes('CredentialComponent'.toLowerCase())
          ? { background: '#dcfaf9' }
          : data?.Type?.toLowerCase().includes('condition'.toLowerCase())
          ? { background: '#ffd263' }
          : { background: 'white' }
      }
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
                    src={`${GET_ICON_URL}AssessmentComponent.png`}
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
                    src={`${GET_ICON_URL}BasicComponent.png`}
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
                    src={`${GET_ICON_URL}CocurricularComponent.png`}
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
                    src={`${GET_ICON_URL}CompetencyComponent.png`}
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
                    src={`${GET_ICON_URL}CourseComponent.png`}
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
                    src={`${GET_ICON_URL}ExtracurricularComponent.png`}
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
                    src={`${GET_ICON_URL}JobComponent.png`}
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
                    src={`${GET_ICON_URL}WorkExperienceComponent.png`}
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
                    src={`${GET_ICON_URL}CredentialComponent.png`}
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
                    src={`${GET_ICON_URL}ComponentCondition.png`}
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
                    src={`${GET_ICON_URL}SelectionCondition.png`}
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
                    src={`${GET_ICON_URL}CredentialComponent.png`}
                    alt="CredentialComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {Type?.toLowerCase().includes('course'.toLowerCase()) && (
                <span className={styles.iconwrapper + ' courseCard'}>
                  <img
                    src={`${GET_ICON_URL}CourseComponent.png`}
                    alt="courseComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {Type?.toLowerCase().includes('Basic'.toLowerCase()) && (
                <span className={styles.iconwrapper + ' basicCard'}>
                  <img
                    src={`${GET_ICON_URL}BasicComponent.png`}
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
                    src={`${GET_ICON_URL}CompetencyComponent.png`}
                    alt="CompetencyComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {Type?.toLowerCase().includes('assessment'.toLowerCase()) && (
                <span className={styles.iconwrapper + ' assessmentCard'}>
                  <img
                    src={`${GET_ICON_URL}AssessmentComponent.png`}
                    alt="AssessmentComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {Type?.toLowerCase().includes('Cocurricular'.toLowerCase()) && (
                <span className={styles.iconwrapper + ' cocurricularCard'}>
                  <img
                    src={`${GET_ICON_URL}CocurricularComponent.png`}
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
                    src={`${GET_ICON_URL}ExtracurricularComponent.png`}
                    alt="ExtracurricularComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {Type?.toLowerCase().includes('selection'.toLowerCase()) && (
                <span className={styles.iconwrapper + ' customicon'}>
                  <img
                    src={`${GET_ICON_URL}SelectionComponent.png`}
                    alt="SelectionComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {Type?.toLowerCase().includes('WorkExperience'.toLowerCase()) && (
                <span className={styles.iconwrapper + ' workExperienceCard'}>
                  <img
                    src={`${GET_ICON_URL}WorkExperienceComponent.png`}
                    alt="WorkExperienceComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {Type?.toLowerCase().includes('JobComponent'.toLowerCase()) && (
                <span className={styles.iconwrapper + ' jobCard'}>
                  <img
                    src={`${GET_ICON_URL}JobComponent.png`}
                    alt="JobComponent"
                    className="componentIcon"
                  />
                </span>
              )}
              {Type?.toLowerCase().includes('Addressing'.toLowerCase()) && (
                <span className={styles.iconwrapper + ' customicon'}>
                  <img
                    src={`${GET_ICON_URL}AddressingComponent.png`}
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
            {data?.FinderResource?.Provider?.Name}
            {data?.Name == null && (
              <span
                className="fa-layers fa-fw fa-lg"
                style={{ float: 'right' }}
              >
                <FontAwesomeIcon
                  icon={faCircle}
                  className={styles.iconPrimary}
                />
                <FontAwesomeIcon
                  icon={faQuestion}
                  transform="shrink-6"
                  className={styles.iconSecondary}
                  onClick={() =>
                    showDescription == true
                      ? setShowDescription(false)
                      : setShowDescription(true)
                  }
                />
              </span>
            )}
            {data?.Type?.toLowerCase().includes(
              'CompetencyComponent'.toLowerCase()
            ) ? (
              <>
                <p>
                  {data?.Identifier?.[0]?.IdentifierType ===
                  'ceasn:codedNotation'
                    ? 'Coded Notation:' +
                      data?.Identifier?.[0]?.IdentifierValueCode
                    : ''}
                </p>
                <h5 title={data?.Description}>
                  {data?.Description}
                  {showDescription && getDescription(Type?.toLowerCase())}
                </h5>
              </>
            ) : (
              <>
                <p>
                  {data?.Identifier?.[0]?.IdentifierType ===
                  'ceasn:codedNotation'
                    ? 'Coded Notation:' +
                      data?.Identifier?.[0]?.IdentifierValueCode
                    : ''}
                </p>
                <h5>
                  {Name}
                  {showDescription && getDescription(Type?.toLowerCase())}
                  <br />
                  {data?.CredentialType !== '' &&
                  data?.CredentialType !== undefined
                    ? 'Type:' +
                      data?.CredentialType.split(':')[1].replace('ceterms:', '')
                    : ''}
                </h5>
              </>
            )}
          </>
        </Col>
      </Row>
    </Card>
  );
};

export default CardWithLeftIcon;
