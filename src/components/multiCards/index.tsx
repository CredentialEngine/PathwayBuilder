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

//import { TEMP_BASE_URL } from '../../apiConfig/setting';
import { GET_ICON_URL } from '../../apiConfig/endpoint';
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
  setSelected: any;
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
  selectedCard?: boolean;
  errorCard?: boolean;
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
  //onClick,
  setIsZoomDisabled,
  status,
  CTID,
  inProgressLevel,
  destinationComponent,
  onSelectDragElemenet,
  isAddFirst,
  firstComponent,
  getEndPoints,
  setSelected,
  isDraggableCardVisible,
  onDelete,
  rowNumber,
  columnNumber,
  skipPreSelect,
  selectedCard,
  errorCard,
  setDraggableCardVisible,
  setIsConditionalEditing,
  getComponentConditionData,
  isViewMode,
}) => {
  //debugger
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
    onclick;
    getEndPoints(e, CTID);
  };
  const selected = (e: any) => {
    ondblclick;
    setSelected(e, CTID);
  };
  const getEndClick = (e: any) => {
    onclick;
    getEndPoints(e, CTID);
  };
  const openInNewTab = () => {
    if (data?.FinderResource?.URI != null) {
      window.open(data?.FinderResource?.URI, '_blank', 'noopener,noreferrer');
    }
  };

  const onDragStart = (e: any) => {
    if (!isViewMode) {
      updateXarrow();
      setIsZoomDisabled(true);
      const target = e.target;
      !!setDraggableCardVisible && setDraggableCardVisible(false);
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
          src={`${GET_ICON_URL}AssessmentComponent.png`}
          alt="AssessmentComponent"
          className="componentIcon"
          style={{ height: '26px', width: '26px' }}
        />
      </span>
    )) ||
    (data?.Type?.toLowerCase().includes('BasicComponent'.toLowerCase()) && (
      <span className={styles.iconwrapper + ' basicCard'}>
        <img
          src={`${GET_ICON_URL}BasicComponent.png`}
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
          src={`${GET_ICON_URL}CocurricularComponent.png`}
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
          src={`${GET_ICON_URL}CompetencyComponent.png`}
          alt="CompetencyComponent"
          className="componentIcon"
          style={{ height: '26px', width: '26px' }}
        />
      </span>
    )) ||
    (data?.Type?.toLowerCase().includes('CourseComponent'.toLowerCase()) && (
      <span className={styles.iconwrapper + ' courseCard'}>
        <img
          src={`${GET_ICON_URL}CourseComponent.png`}
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
          src={`${GET_ICON_URL}ExtracurricularComponent.png`}
          alt="ExtracurricularComponent"
          className="componentIcon"
          style={{ height: '26px', width: '26px' }}
        />
      </span>
    )) ||
    (data?.Type?.toLowerCase().includes('JobComponent'.toLowerCase()) && (
      <span className={styles.iconwrapper + ' jobCard'}>
        <img
          src={`${GET_ICON_URL}JobComponent.png`}
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
          src={`${GET_ICON_URL}WorkExperienceComponent.png`}
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
          src={`${GET_ICON_URL}CredentialComponent.png`}
          alt="CredentialComponent"
          className="componentIcon"
          style={{ height: '26px', width: '26px' }}
        />
      </span>
    )) ||
    (data?.Type?.toLowerCase().includes('ComponentCondition'.toLowerCase()) && (
      <img
        src={`${GET_ICON_URL}ComponentCondition.png`}
        alt="ComponentCondition"
        className="componentIcon"
        style={{ height: '26px', width: '26px' }}
      />
    )) ||
    (data?.Type?.toLowerCase().includes('selection'.toLowerCase()) && (
      <img
        src={`${GET_ICON_URL}SelectionCondition.png`}
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
              onDoubleClick={(e: any) => {
                selected(e);
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
                              {/* <span
                                onClick={(e: any) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  setShowRightPenal(true);
                                  setShowPopover(false);
                                }}
                              >
                                View
                              </span> */}
                              {!isViewMode && (
                                <span
                                  style={{ color: 'black' }}
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
                                  style={{ color: 'black' }}
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
                    <span>{data?.Description?.slice(0, 40)}</span>
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
          className={`${
            selectedCard
              ? styles.multiCardWrapper + ' selectedcard'
              : errorCard
              ? styles.multiCardWrapper + ' errorcard'
              : styles.multiCardWrapper
          } ${
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
          onDoubleClick={(e: any) => {
            selected(e);
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
                onClick={(e: any) => {
                  getEndClick(e);
                }}
              ></span>
              {/* <span
                className={styles.ornageSection + ' ' + styles.top}
                onClick={(e: any) => {
                getEndClick(e);
              }}
              ></span> */}
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
                          {/* <span
                            onClick={(e: any) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setShowRightPenal(true);
                              setShowPopover(false);
                            }}
                          >
                            View
                          </span> */}

                          <span
                            style={{ color: 'black' }}
                            onClick={(e: any) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setShowRightPanelEdit(true);
                              setShowPopover(false);
                            }}
                          >
                            {!isViewMode ? 'Edit' : 'View'}
                          </span>
                          {!isViewMode && (
                            <span
                              style={{ color: 'black' }}
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
                    <>
                      <span>{data?.FinderResource?.Provider?.Name}</span>
                      <span title={data?.Description} onClick={openInNewTab}>
                        {data?.FinderResource?.URI != null ? (
                          <u>{data?.Description?.slice(0, 50)}</u>
                        ) : (
                          data?.Description?.slice(0, 50)
                        )}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>{data?.FinderResource?.Provider?.Name}</span>
                      <span onClick={openInNewTab}>
                        {data?.FinderResource?.URI != null ? (
                          <u>{data?.Name}</u>
                        ) : (
                          data?.Name
                        )}
                      </span>
                    </>
                    //{data?.Name}</span></>
                  )}
                </div>
                <div className={styles.creditSection}>
                  {data?.Type?.toLowerCase().includes(
                    'coursecomponent'.toLowerCase()
                  ) ? (
                    <span>Credits: {data?.CreditValue?.[0]?.Value || 0}</span>
                  ) : (
                    <span></span>
                  )}

                  <span title={ProgressionLevelName}>
                    Level {ProgressionLevelName?.slice(0, 30)}
                  </span>
                </div>
              </div>
              <span
                className={styles.ornageSection + ' ' + styles.bottom}
                onClick={(e: any) => {
                  getEndClick(e);
                }}
              ></span>
              <span
                className={styles.ornageSection + ' ' + styles.right}
                onClick={(e: any) => {
                  getOnClick(e);
                }}
              ></span>
            </>
          )}

          {isCredentialCard && (
            <>
              <span
                className={styles.ornageSection + ' ' + styles.leftSide}
                onClick={(e: any) => {
                  getEndClick(e);
                }}
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
                          {/* <span
                            onClick={(e: any) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setShowRightPenal(true);
                              setShowPopover(false);
                            }}
                          >
                            View
                          </span> */}

                          <span
                            style={{ color: 'black' }}
                            onClick={(e: any) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setShowRightPenal(false);
                              setShowRightPanelEdit(true);
                              setShowPopover(false);
                            }}
                          >
                            {!isViewMode ? 'Edit' : 'View'}
                          </span>

                          {!isViewMode && (
                            <span
                              style={{ color: 'black' }}
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
                  <span>
                    {data?.FinderResource?.Provider?.Name.slice(0, 0)}
                  </span>
                  <span title={data?.Name} onClick={openInNewTab}>
                    {data?.FinderResource?.URI != null ? (
                      <u>{data?.Name?.slice(0, 30)}</u>
                    ) : (
                      data?.Name?.slice(0, 30)
                    )}
                  </span>
                  <span>
                    Type:{' '}
                    {data?.CredentialType != undefined
                      ? data?.CredentialType.replace('ceterms:', '')
                      : ''}
                  </span>
                </div>
                <div className={styles.creditSection}>
                  <span></span>
                  <span title={ProgressionLevelName}>
                    Level {ProgressionLevelName?.slice(0, 30)}
                  </span>
                </div>
              </div>
              <span
                className={styles.ornageSection + ' ' + styles.bottom}
                onClick={(e: any) => {
                  getEndClick(e);
                }}
              ></span>
              <span
                className={styles.ornageSection + ' ' + styles.right}
                onClick={(e: any) => {
                  getOnClick(e);
                }}
              ></span>
            </>
          )}

          {isConditionalCard && (
            <>
              <React.Fragment>
                <span
                  className={
                    styles.ornageConditionSection + ' ' + styles.leftSide
                  }
                  onClick={(e: any) => {
                    getEndClick(e);
                  }}
                ></span>
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
                    placement="right"
                    content={
                      <div className={styles.popoverMenu} ref={ref}>
                        <span
                          style={{ color: 'black' }}
                          onClick={(e: any) => handleConditionEdit(e)}
                        >
                          {!isViewMode ? 'Edit' : 'View'}
                        </span>
                        {!isViewMode && (
                          <span
                            style={{ color: 'black' }}
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
                    <span title={data?.Description}>
                      {data?.Description?.slice(0, 80)}
                    </span>
                  ) : (
                    <span>{data?.Name}</span>
                  )}
                </div>

                <div className={styles.creditSection}>
                  <span>
                    {/* Logic: {data?.LogicalOperator?.replace('logic:', '')} */}
                  </span>
                  <span>Constraints: {data?.HasConstraint.length}</span>
                </div>
                <span
                  className={
                    styles.ornageConditionSection + ' ' + styles.bottom
                  }
                  onClick={(e: any) => {
                    getEndClick(e);
                  }}
                ></span>
                <span
                  className={styles.ornageConditionSection + ' ' + styles.right}
                  onClick={(e: any) => {
                    getOnClick(e);
                  }}
                ></span>
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
          isViewMode={isViewMode}
        />
      )}
    </>
  );
};

export default React.memo(MultiCard);
