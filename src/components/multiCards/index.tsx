import {
  faCirclePlus,
  faEllipsis,
  faSitemap,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, Popover } from 'antd';
import _, { noop } from 'lodash';

import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useXarrow } from 'react-xarrows';

import { TEMP_BASE_URL } from '../../apiConfig/setting';
import EditComponent from '../../screens/editComponent';
import InfoTooltip from '../infoTooltip';
import RightPanel from '../rightPanel';

import styles from './index.module.scss';

interface Props {
  isAddDestination?: boolean;
  isDestination?: boolean;
  isCourseCard?: boolean;
  isConditionalCard?: boolean;
  isAddComponentCard?: boolean;
  isCredentialCard?: boolean;
  data: any;
  onClick?: () => void;
  setIsZoomDisabled: (a: any) => void;
  status?: string;
  CTID?: number | string;
  inProgressLevel?: string;
  destinationComponent?: boolean;
  onSelectDragElemenet: (a: any) => void;
  onMoveItem: (a: any) => void;
  isAddFirst?: boolean;
  firstComponent?: boolean;
  getEndPoints: any;
  isDraggableCardVisible?: boolean;
  constraintIcon?: boolean;
  number: number;
  forwardRef: any;
  leftpanelSelectedElem: any;
  onDelete?: any;
  rowNumber: number;
  columnNumber: number;
  HasProgressionLevel: string;
  updatedPathwayComponentConditionCards?: [];
  ConstraintConditionProp?: (val: boolean) => void;
  ConstraintConditionState: boolean;
  isConditionalModalStatus?: boolean;
  setIsConditionalModalStatus?: (a: boolean) => void;
  newConnection?: any;
  condCardItem?: any;
  allComponentCardsData?: any;
  allConditionalCardsData?: any;
  connectionsCTID?: any;
  skipPreSelect?: boolean;
  destinationColumnSelect?: boolean;
  setDraggableCardVisible?: (a: boolean) => void;
  setIsConditionalEditing?: (a: boolean) => void;
  isConditionalEditing?: (a: boolean) => void;
  getComponentConditionData?: (data: any) => void;
  isViewMode?: boolean;
}

const MultiCard: React.FC<Props> = ({
  isAddDestination,
  isDestination,
  isCourseCard,
  isConditionalCard,
  isCredentialCard,
  isAddComponentCard,
  data,
  onClick,
  setIsZoomDisabled,
  status,
  CTID,
  inProgressLevel,
  destinationComponent,
  onSelectDragElemenet,
  isAddFirst,
  firstComponent,
  getEndPoints,
  isDraggableCardVisible,
  onDelete,
  rowNumber,
  columnNumber,
  skipPreSelect,
  setDraggableCardVisible,
  setIsConditionalEditing,
  getComponentConditionData,
  isViewMode,
}) => {
  const [showPopover, setShowPopover] = useState(false);

  const ref = useRef(null);

  const pathwayWrapper = useSelector((state: any) => state.initalReducer);
  const { mappedData: pathwayComponent } = pathwayWrapper;

  const [showRightPenal, setShowRightPenal] = useState(false);
  const [showRightPanelEdit, setShowRightPanelEdit] = useState(false);
  const updateXarrow = useXarrow();

  const darkColor = '#0A2942';
  const getOnClick = (e: any) => {
    /* 
    Below commented code is for increasing width for dropWrapper

    const getElement = forwardRef.current[number];
    if (!_.isNull(getElement)) {
      const rect = getElement.getBoundingClientRect();
      getElement.style.width = `${rect.width * 2}px`;
    }

    */

    onClick;
    getEndPoints(e, CTID);
  };

  const onDragStart = (e: any) => {
    if (!isViewMode) {
      updateXarrow();
      setIsZoomDisabled(true);
      const target = e.target;
      !!setDraggableCardVisible && setDraggableCardVisible(true);
      e.dataTransfer.setData(
        'card_id',
        JSON.stringify({
          ...data,
          status,
          inProgressLevel,
        })
      );
      e.dataTransfer.setData(
        'leftPanel_card',
        JSON.stringify({
          ...data,
        })
      );
      onSelectDragElemenet(data);
      setTimeout(() => {
        target.style.visibility = 'hidden';
      }, 0);
    }
  };

  const onDragOver = (e: any) => {
    updateXarrow();
    e.preventDefault();
    e.stopPropagation();
  };

  const onDragEnd = (e: any) => {
    setIsZoomDisabled(false);
    !!setDraggableCardVisible && setDraggableCardVisible(false);

    e.target.style.visibility = 'visible';
    updateXarrow();
  };

  useEffect(() => {
    document?.addEventListener('click', handleOutsideClick, true);
  }, []);

  const handleOutsideClick = (e: any) => {
    if (ref && ref?.current) {
      //@ts-ignore
      if (!ref?.current?.contains(e.target)) {
        setShowPopover(false);
      }
    }
  };

  const handleConditionEdit = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    !!setIsConditionalEditing && setIsConditionalEditing(true);
    setShowPopover(false);
    if (!_.isEmpty(data)) {
      !!getComponentConditionData && getComponentConditionData(data);
    }
  };

  const renderImage = (data: any) =>
    (data?.Type?.toLowerCase().includes(
      'AssessmentComponent'.toLowerCase()
    ) && (
      <span className={styles.iconwrapper + ' assessmentCard'}>
        <img
          src={`${TEMP_BASE_URL}Images/PathwayBuilder/AssessmentComponent.png`}
          alt="AssessmentComponent"
          className="componentIcon"
          style={{ height: '26px', width: '26px' }}
        />
      </span>
    )) ||
    (data?.Type?.toLowerCase().includes('BasicComponent'.toLowerCase()) && (
      <span className={styles.iconwrapper + ' basicCard'}>
        <img
          src={`${TEMP_BASE_URL}Images/PathwayBuilder/BasicComponent.png`}
          alt="BasicComponent"
          className="componentIcon"
          style={{ height: '26px', width: '26px' }}
        />
      </span>
    )) ||
    (data?.Type?.toLowerCase().includes(
      'CocurricularComponent'.toLowerCase()
    ) && (
      <span className={styles.iconwrapper + ' cocurricularCard'}>
        <img
          src={`${TEMP_BASE_URL}Images/PathwayBuilder/CocurricularComponent.png`}
          alt="CocurricularComponent"
          className="componentIcon"
          style={{ height: '26px', width: '26px' }}
        />
      </span>
    )) ||
    (data?.Type?.toLowerCase().includes(
      'CompetencyComponent'.toLowerCase()
    ) && (
      <span className={styles.iconwrapper + ' competencyCard'}>
        <img
          src={`${TEMP_BASE_URL}Images/PathwayBuilder/CompetencyComponent.png`}
          alt="CompetencyComponent"
          className="componentIcon"
          style={{ height: '26px', width: '26px' }}
        />
      </span>
    )) ||
    (data?.Type?.toLowerCase().includes('CourseComponent'.toLowerCase()) && (
      <span className={styles.iconwrapper + ' courseCard'}>
        <img
          src={`${TEMP_BASE_URL}Images/PathwayBuilder/CourseComponent.png`}
          alt="CourseComponent"
          className="componentIcon"
          style={{ height: '26px', width: '26px' }}
        />
      </span>
    )) ||
    (data?.Type?.toLowerCase().includes(
      'ExtracurricularComponent'.toLowerCase()
    ) && (
      <span className={styles.iconwrapper + ' extraCurricularCard'}>
        <img
          src={`${TEMP_BASE_URL}Images/PathwayBuilder/ExtracurricularComponent.png`}
          alt="ExtracurricularComponent"
          className="componentIcon"
          style={{ height: '26px', width: '26px' }}
        />
      </span>
    )) ||
    (data?.Type?.toLowerCase().includes('JobComponent'.toLowerCase()) && (
      <span className={styles.iconwrapper + ' jobCard'}>
        <img
          src={`${TEMP_BASE_URL}Images/PathwayBuilder/JobComponent.png`}
          alt="JobComponent"
          className="componentIcon"
          style={{ height: '26px', width: '26px' }}
        />
      </span>
    )) ||
    (data?.Type?.toLowerCase().includes(
      'WorkExperienceComponent'.toLowerCase()
    ) && (
      <span className={styles.iconwrapper + ' workExperienceCard'}>
        <img
          src={`${TEMP_BASE_URL}Images/PathwayBuilder/WorkExperienceComponent.png`}
          alt="WorkExperienceComponent"
          className="componentIcon"
          style={{ height: '26px', width: '26px' }}
        />
      </span>
    )) ||
    (data?.Type?.toLowerCase().includes(
      'CredentialComponent'.toLowerCase()
    ) && (
      <span className={styles.iconwrapper + 'credentialCard'}>
        <img
          src={`${TEMP_BASE_URL}Images/PathwayBuilder/CredentialComponent.png`}
          alt="CredentialComponent"
          className="componentIcon"
          style={{ height: '26px', width: '26px' }}
        />
      </span>
    )) ||
    (data?.Type?.toLowerCase().includes('ComponentCondition'.toLowerCase()) && (
      <img
        src={`${TEMP_BASE_URL}Images/PathwayBuilder/ComponentCondition.png`}
        alt="ComponentCondition"
        className="componentIcon"
        style={{ height: '26px', width: '26px' }}
      />
    )) ||
    (data?.Type?.toLowerCase().includes('selection'.toLowerCase()) && (
      <img
        src={`${TEMP_BASE_URL}Images/PathwayBuilder/SelectionCondition.png`}
        alt="SelectionCondition"
        className="componentIcon"
        style={{ height: '26px', width: '26px' }}
      />
    ));

  const ProgressionLevelName =
    _.toString(pathwayComponent?.Pathway?.HasDestinationComponent) ===
    _.toString(data?.CTID)
      ? 'Destination'
      : pathwayComponent?.ProgressionLevels?.length > 0
      ? pathwayComponent?.ProgressionLevels?.find(
          (level: any) => data?.HasProgressionLevel === level?.CTID
        )?.Name
      : 'Pathway';
  return (
    <>
      {isDraggableCardVisible ? (
        <div className={styles.draggableAreaContainer} id={CTID?.toString()}>
          <div
            id="verticalBorder"
            draggable={true}
            className={styles.draggableAreaBox}
          ></div>
          <div id="multiCard-Wrapper">
            <div
              id="horizontalBorder"
              className={styles.draggableAreaBox + ' ' + styles.hori}
            ></div>
            <div
              className={`${styles.multiCardWrapper} ${
                (skipPreSelect && isAddDestination && destinationComponent) ||
                (isAddFirst && firstComponent)
                  ? styles.addDestinationCard
                  : ''
              } ${isDestination ? styles.isDestination : ''} ${
                isCourseCard ? styles?.isCourseCard : ''
              } ${isConditionalCard ? styles.conditionalCard : ''} ${
                isAddComponentCard ? styles.addComponentCard : ''
              } ${isCredentialCard ? styles.isCredentialCard : ''}`}
              draggable={true}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragEnd={onDragEnd}
              onClick={(e: any) => {
                getOnClick(e);
              }}
              onMouseLeave={() => setIsZoomDisabled(false)}
              onMouseOver={() => setIsZoomDisabled(true)}
              id={CTID?.toString()}
              data-cardType="multiCard"
              data-columnNumber={columnNumber}
              data-rowNumber={rowNumber}
              data-CTID={data?.CTID}
            >
              {skipPreSelect && destinationComponent && isAddDestination && (
                <>
                  <InfoTooltip
                    title="Add your destination component"
                    content="Drag your pre-selected destination component into the space provided, or search for a component to add."
                    onClose={noop}
                    isDestination={isAddDestination}
                  />
                  <div className={styles.addDestinationContent}>
                    <p className={styles.addDestinationTitle}>
                      Add your destination component
                    </p>
                    <FontAwesomeIcon
                      style={{ height: '28px', marginTop: '20px' }}
                      color="#ffffff"
                      icon={faCirclePlus}
                    />
                  </div>
                </>
              )}
              {isAddFirst && firstComponent && (
                <>
                  <InfoTooltip
                    title="Great! Add  another component"
                    content="Drag your next component into the Pathway by dragging it to a hotspot on the component you just placed."
                    onClose={noop}
                  />
                  <div className={styles.addDestinationContent}>
                    <p className={styles.addDestinationTitle}>
                      Add your first component
                    </p>
                    <FontAwesomeIcon
                      style={{ height: '28px', marginTop: '20px' }}
                      color="#ffffff"
                      icon={faCirclePlus}
                    />
                  </div>
                </>
              )}
              {isAddFirst && firstComponent && data?.Type == 'addFirst' && (
                <>
                  <InfoTooltip
                    title="Add your first component"
                    content="Drag your next component into the space provided, or search for a component to add"
                    onClose={noop}
                  />
                  <div className={styles.addDestinationContent}>
                    <p className={styles.addDestinationTitle}>
                      Add your next component
                    </p>
                    <FontAwesomeIcon
                      style={{ height: '28px', marginTop: '20px' }}
                      color="#ffffff"
                      icon={faCirclePlus}
                    />
                  </div>
                </>
              )}

              {((isCourseCard && !isCredentialCard) ||
                data?.Type === 'course') && (
                <>
                  <div className={styles.credentialsCardWrapeer}>
                    <div className={styles.topCourseContent}>
                      {renderImage(data)}
                      <span className={styles.title}>{data?.Name}</span>
                      <FontAwesomeIcon
                        color={darkColor}
                        style={{ height: '20px', cursor: 'pointer' }}
                        icon={faEllipsis}
                        onClick={(e: any) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setShowPopover(true);
                        }}
                      />
                      {showPopover && !showRightPenal && !showRightPanelEdit && (
                        <Popover
                          visible={showPopover}
                          arrowPointAtCenter
                          placement="bottomRight"
                          content={
                            <div className={styles.popoverMenu} ref={ref}>
                              <span
                                onClick={(e: any) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  setShowRightPenal(true);
                                  setShowPopover(false);
                                }}
                              >
                                View
                              </span>
                              {!isViewMode && (
                                <span
                                  onClick={(e: any) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setShowRightPanelEdit(true);
                                    setShowPopover(false);
                                  }}
                                >
                                  Edit
                                </span>
                              )}
                              {!isViewMode && (
                                <span
                                  onClick={(e: any) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    onDelete(data);
                                  }}
                                >
                                  Delete
                                </span>
                              )}
                            </div>
                          }
                        ></Popover>
                      )}
                    </div>
                    <Divider
                      style={{
                        backgroundColor: '#F3F4F6',
                        margin: '8px 0px 4px 0px',
                      }}
                    />
                    <div className={styles.courseNameContainter}>
                      <span>{data?.CodedNotation}</span>
                      <span>{data?.Description?.slice(0, 40)}</span>
                    </div>
                    <div className={styles.creditSection}>
                      <span>Credits: 3</span>
                      <span>Level 10</span>
                    </div>
                  </div>
                </>
              )}

              {isCredentialCard && (
                <>
                  <div className={styles.courseCredCardWrapper}>
                    <div className={styles.topCourseContent}>
                      {renderImage(data)}
                      <span className={styles.title}>{data?.Name}</span>
                      <FontAwesomeIcon
                        color={darkColor}
                        style={{ height: '20px', cursor: 'pointer' }}
                        icon={faEllipsis}
                        onClick={noop}
                      />
                    </div>
                    <Divider
                      style={{
                        backgroundColor: '#6EFFFF',
                        margin: '8px 0px 4px 0px',
                      }}
                    />
                    <div className={styles.courseNameContainter}>
                      <span>{data?.CodedNotation}</span>
                      <span>{data?.Description?.slice(0, 40)}</span>
                    </div>
                  </div>
                </>
              )}

              {isConditionalCard && (
                <React.Fragment>
                  <div className={styles.conditionalCardContent}>
                    <FontAwesomeIcon
                      color="#ffffff"
                      style={{ height: '20px', cursor: 'pointer' }}
                      icon={faSitemap}
                      onClick={noop}
                    />
                    <span>Required: {}</span>
                    <FontAwesomeIcon
                      color="#ffffff"
                      style={{ height: '20px', cursor: 'pointer' }}
                      icon={faEllipsis}
                      onClick={noop}
                    />
                  </div>
                  <div className={styles.requiredSection}>
                    <span>{data?.Description}</span>
                  </div>
                </React.Fragment>
              )}

              {isAddComponentCard && (
                <div className={styles.addComponentContent}>
                  <div className={styles.topContent}>
                    <span className={styles.circle}>
                      <FontAwesomeIcon
                        color={darkColor}
                        style={{ height: '18px', cursor: 'pointer' }}
                        icon={faSitemap}
                        onClick={noop}
                      />
                    </span>
                    <span className={styles.topMiddle}>Required: 0</span>
                    <FontAwesomeIcon
                      color={darkColor}
                      style={{ height: '20px', cursor: 'pointer' }}
                      icon={faEllipsis}
                      onClick={noop}
                    />
                  </div>
                  <Divider
                    style={{
                      backgroundColor: 'rgb(255,185,11)',
                      margin: '4px 0px',
                      opacity: 1,
                    }}
                  />
                  <span className={styles.totalCredit}>
                    8 of 8 Courses (120 Credits at level 7) minimum grade D in 7
                    specified Courses
                  </span>
                </div>
              )}
            </div>
            <div
              id="horizontalBorder"
              className={styles.draggableAreaBox + ' ' + styles.hori}
            ></div>
          </div>
          <div className={styles.draggableAreaBox}></div>
        </div>
      ) : (
        <div
          className={`${styles.multiCardWrapper} ${
            (skipPreSelect && isAddDestination && destinationComponent) ||
            (isAddFirst && firstComponent)
              ? styles.addDestinationCard
              : ''
          } ${isDestination ? styles.isDestination : ''} ${
            isCourseCard ? styles?.isCourseCard : ''
          } ${isConditionalCard ? styles.conditionalCard : ''} ${
            isAddComponentCard ? styles.addComponentCard : ''
          } ${isCredentialCard ? styles.isCredentialCard : ''} ${
            isDestination && isCourseCard ? styles.onDestinationLeft : ''
          }`}
          draggable={true}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onClick={(e: any) => {
            getOnClick(e);
          }}
          onMouseLeave={() => setIsZoomDisabled(false)}
          onMouseOver={() => setIsZoomDisabled(true)}
          id={CTID?.toString()}
          data-columnNumber={columnNumber}
          data-rowNumber={rowNumber}
          data-CTID={data?.CTID}
        >
          {skipPreSelect && destinationComponent && isAddDestination && (
            <>
              <InfoTooltip
                title="Add your destination component"
                content="Drag your pre-selected destination component into the space provided, or search for a component to add."
                onClose={noop}
                isDestination={isAddDestination}
              />
              <div className={styles.addDestinationContent}>
                <p className={styles.addDestinationTitle}>
                  Add your destination component
                </p>
                <FontAwesomeIcon
                  style={{ height: '28px', marginTop: '20px' }}
                  color="#ffffff"
                  icon={faCirclePlus}
                />
              </div>
            </>
          )}
          {isAddFirst && firstComponent && data?.Type == 'addFirst' && (
            <>
              <InfoTooltip
                direction="right"
                title="Add your first component"
                content="Drag your next component into the space provided, or search for a component to add"
                onClose={noop}
              />
              <div className={styles.addDestinationContent}>
                <p className={styles.addDestinationTitle}>
                  Add your next component
                </p>
                <FontAwesomeIcon
                  style={{ height: '28px', marginTop: '20px' }}
                  color="#ffffff"
                  icon={faCirclePlus}
                />
              </div>
            </>
          )}
          {((isCourseCard && !isCredentialCard) || data?.Type === 'course') && (
            <>
              <span
                className={styles.ornageSection + ' ' + styles.leftSide}
              ></span>
              <div
                className={
                  isDestination
                    ? styles.onDestinationPanel
                    : styles.credentialsCardWrapeer
                }
              >
                <div className={styles.topCourseContent}>
                  {renderImage(data)}
                  <span className={styles.title}>
                    {data?.Type?.split(':')[1].replace('Component', '')}
                  </span>
                  <FontAwesomeIcon
                    color={darkColor}
                    style={{ height: '20px', cursor: 'pointer' }}
                    icon={faEllipsis}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setShowPopover(true);
                    }}
                  />
                  {showPopover && !showRightPenal && !showRightPanelEdit && (
                    <Popover
                      visible={showPopover}
                      arrowPointAtCenter
                      placement="bottomRight"
                      content={
                        <div className={styles.popoverMenu} ref={ref}>
                          <span
                            onClick={(e: any) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setShowRightPenal(true);
                              setShowPopover(false);
                            }}
                          >
                            View
                          </span>
                          {!isViewMode && (
                            <span
                              onClick={(e: any) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowRightPanelEdit(true);
                                setShowPopover(false);
                              }}
                            >
                              Edit
                            </span>
                          )}
                          {!isViewMode && (
                            <span
                              onClick={(e: any) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onDelete(data);
                              }}
                            >
                              Delete
                            </span>
                          )}
                        </div>
                      }
                    ></Popover>
                  )}
                </div>
                <Divider
                  style={{
                    backgroundColor: '#F3F4F6',
                    margin: '8px 0px 4px 0px',
                  }}
                />
                <div className={styles.courseNameContainter}>
                  {data?.Type?.toLowerCase().includes(
                    'CompetencyComponent'.toLowerCase()
                  ) ? (
                    <span title={data?.Description}>
                      {data?.Description?.slice(0, 90)}
                    </span>
                  ) : (
                    <span>{data?.Name}</span>
                  )}
                </div>
                <div className={styles.creditSection}>
                  <span>Credits: {data?.CreditValue?.[0]?.Value || 0}</span>
                  <span title={ProgressionLevelName}>
                    Level {ProgressionLevelName?.slice(0, 30)}
                  </span>
                </div>
              </div>
              <span
                className={styles.ornageSection + ' ' + styles.right}
              ></span>
            </>
          )}

          {isCredentialCard && (
            <>
              <span
                className={styles.ornageSection + ' ' + styles.leftSide}
              ></span>
              <div className={styles.courseCredCardWrapper}>
                <div className={styles.topCourseContent}>
                  {renderImage(data)}
                  <span className={styles.title}>
                    {data?.Type?.split(':')[1].replace('Component', '')}
                  </span>
                  <FontAwesomeIcon
                    color={darkColor}
                    style={{ height: '20px', cursor: 'pointer' }}
                    icon={faEllipsis}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setShowPopover(true);
                    }}
                  />
                  {showPopover && !showRightPenal && !showRightPanelEdit && (
                    <Popover
                      visible={showPopover}
                      arrowPointAtCenter
                      placement="bottomRight"
                      content={
                        <div className={styles.popoverMenu} ref={ref}>
                          <span
                            onClick={(e: any) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setShowRightPenal(true);
                              setShowPopover(false);
                            }}
                          >
                            View
                          </span>
                          {!isViewMode && (
                            <span
                              onClick={(e: any) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowRightPenal(false);
                                setShowRightPanelEdit(true);
                                setShowPopover(false);
                              }}
                            >
                              Edit
                            </span>
                          )}
                          {!isViewMode && (
                            <span
                              onClick={(e: any) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onDelete(data);
                              }}
                            >
                              Delete
                            </span>
                          )}
                        </div>
                      }
                    ></Popover>
                  )}
                </div>
                <Divider
                  style={{
                    backgroundColor: '#6EFFFF',
                    margin: '8px 0px 4px 0px',
                  }}
                />
                <div className={styles.courseNameContainter}>
                  <span>{data?.Name}</span>
                  <span>
                    Type:{' '}
                    {data?.CredentialType != undefined
                      ? data?.CredentialType.replace('ceterms:', '')
                      : ''}
                  </span>
                </div>
              </div>
              <span
                className={styles.ornageSection + ' ' + styles.right}
              ></span>
            </>
          )}

          {isConditionalCard && (
            <>
              <React.Fragment>
                <div className={styles.conditionalCardContent}>
                  <FontAwesomeIcon
                    color="#ffffff"
                    style={{ height: '20px', cursor: 'pointer' }}
                    icon={faSitemap}
                    onClick={noop}
                  />
                  <span>Required: {data?.RequiredNumber}</span>
                  <FontAwesomeIcon
                    color="#000000"
                    style={{ height: '20px', cursor: 'pointer' }}
                    icon={faEllipsis}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setShowPopover(true);
                    }}
                  />
                </div>
                {showPopover && !showRightPenal && !showRightPanelEdit && (
                  <Popover
                    visible={showPopover}
                    arrowPointAtCenter
                    placement="bottomRight"
                    content={
                      <div className={styles.popoverMenu} ref={ref}>
                        <span onClick={(e: any) => handleConditionEdit(e)}>
                          {!isViewMode ? 'Edit' : 'View'}
                        </span>
                        {!isViewMode && (
                          <span
                            onClick={(e: any) => {
                              e.stopPropagation();
                              e.preventDefault();
                              onDelete(data);
                            }}
                          >
                            Delete
                          </span>
                        )}
                      </div>
                    }
                  ></Popover>
                )}
                <Divider
                  style={{
                    backgroundColor: '#ffb90b',
                    margin: '8px 0px 4px 0px',
                  }}
                />
                <div className={styles.requiredSection}>
                  {!!data?.Description ? (
                    <span title={data?.Description}>{data?.Description}</span>
                  ) : (
                    <span>{data?.Name}</span>
                  )}
                </div>

                <div className={styles.creditSection}>
                  <span>
                    Logic: {data?.LogicalOperator?.replace('logic:', '')}
                  </span>
                  <span>Constraints: {data?.HasConstraint.length}</span>
                </div>
              </React.Fragment>
            </>
          )}

          {isAddComponentCard && (
            <div className={styles.addComponentContent}>
              <div className={styles.topContent}>
                <span className={styles.circle}>
                  <FontAwesomeIcon
                    color={darkColor}
                    style={{ height: '18px', cursor: 'pointer' }}
                    icon={faSitemap}
                    onClick={noop}
                  />
                </span>
                <span className={styles.topMiddle}>Required: 0</span>
                <FontAwesomeIcon
                  color={darkColor}
                  style={{ height: '20px', cursor: 'pointer' }}
                  icon={faEllipsis}
                  onClick={noop}
                />
              </div>
              <Divider
                style={{
                  backgroundColor: 'rgb(255,185,11)',
                  margin: '4px 0px',
                  opacity: 1,
                }}
              />
              <span className={styles.totalCredit}>
                8 of 8 Courses (120 Credits at level 7) minimum grade D in 7
                specified Courses
              </span>
            </div>
          )}
        </div>
      )}

      {!!showRightPenal && (
        <RightPanel
          visible={showRightPenal}
          onCloseHandler={(val: boolean) => setShowRightPenal(val)}
          panelData={data}
        />
      )}
      {!!showRightPanelEdit && (
        <EditComponent
          visible={showRightPanelEdit}
          onCloseHandler={(val: boolean) => setShowRightPanelEdit(val)}
          panelData={data}
        />
      )}
    </>
  );
};

export default MultiCard;
