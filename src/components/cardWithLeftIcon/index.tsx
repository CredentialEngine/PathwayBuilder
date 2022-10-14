import {
  faCubes,
  faGear,
  faFileCircleCheck,
  faIdBadge,
  faSitemap,
  faGraduationCap,
  faCube,
  faCartShopping,
  faAtom,
  faSolarPanel,
  faHandPointer,
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
    IconColor,
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
                {data?.URI?.toLowerCase().includes(
                  'AssessmentComponent'.toLowerCase()
                ) && (
                  <FontAwesomeIcon icon={faGraduationCap} color={IconColor} />
                )}
                {data?.URI?.toLowerCase().includes(
                  'BasicComponent'.toLowerCase()
                ) && <FontAwesomeIcon icon={faCube} color={IconColor} />}
                {data?.URI?.toLowerCase().includes(
                  'CocurricularComponent'.toLowerCase()
                ) && <FontAwesomeIcon icon={faAtom} color={IconColor} />}
                {data?.URI?.toLowerCase().includes(
                  'CompetencyComponent'.toLowerCase()
                ) && <FontAwesomeIcon icon={faGear} color={IconColor} />}
                {data?.URI?.toLowerCase().includes(
                  'CourseComponent'.toLowerCase()
                ) && <FontAwesomeIcon icon={faCubes} color={IconColor} />}
                {data?.URI?.toLowerCase().includes(
                  'ExtracurricularComponent'.toLowerCase()
                ) && <FontAwesomeIcon icon={faSolarPanel} color={IconColor} />}
                {data?.URI?.toLowerCase().includes(
                  'JobComponent'.toLowerCase()
                ) && (
                  <FontAwesomeIcon icon={faCartShopping} color={IconColor} />
                )}
                {data?.URI?.toLowerCase().includes(
                  'WorkExperienceComponent'.toLowerCase()
                ) && <FontAwesomeIcon icon={faIdBadge} color={IconColor} />}
                {data?.URI?.toLowerCase().includes(
                  'CredentialComponent'.toLowerCase()
                ) && <FontAwesomeIcon icon={faIdBadge} color={IconColor} />}
                {data?.URI?.toLowerCase().includes(
                  'ComonentCondition'.toLowerCase()
                ) && <FontAwesomeIcon icon={faSitemap} color={IconColor} />}
                {data?.URI?.toLowerCase().includes(
                  'selection'.toLowerCase()
                ) && <FontAwesomeIcon icon={faHandPointer} color={IconColor} />}
              </>
            ) : (
              <>
                {Type?.toLowerCase().includes('credential'.toLowerCase()) && (
                  <FontAwesomeIcon icon={faIdBadge} color={IconColor} />
                )}
                {Type?.toLowerCase().includes('course'.toLowerCase()) && (
                  <FontAwesomeIcon icon={faCubes} color={IconColor} />
                )}
                {Type?.toLowerCase().includes('Basic'.toLowerCase()) && (
                  <FontAwesomeIcon icon={faCube} color={IconColor} />
                )}
                {Type?.toLowerCase().includes(
                  'competency'.toLocaleLowerCase()
                ) && <FontAwesomeIcon icon={faGear} color={IconColor} />}
                {Type?.toLowerCase().includes('assessment'.toLowerCase()) && (
                  <FontAwesomeIcon icon={faFileCircleCheck} color={IconColor} />
                )}
                {Type?.toLowerCase().includes('Cocurricular'.toLowerCase()) && (
                  <FontAwesomeIcon icon={faAtom} color={IconColor} />
                )}
                {Type?.toLowerCase().includes(
                  'Extracurricular'.toLowerCase()
                ) && <FontAwesomeIcon icon={faSolarPanel} color={IconColor} />}
                {Type?.toLowerCase().includes('selection'.toLowerCase()) && (
                  <FontAwesomeIcon icon={faHandPointer} color={IconColor} />
                )}
                {Type?.toLowerCase().includes(
                  'Extracurricular'.toLowerCase()
                ) && <FontAwesomeIcon icon={faSolarPanel} color={IconColor} />}
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
