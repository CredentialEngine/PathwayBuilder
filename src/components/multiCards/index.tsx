import {
  faCirclePlus,
  faCubes,
  faEllipsis,
  faSitemap,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, Popover } from 'antd';
import _, { noop } from 'lodash';

import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import AddConditionalComponent from '../../screens/addComponent';

import InfoTooltip from '../infoTooltip';
import Modal from '../modal';
import RightPanel from '../rightPanel';

import styles from './index.module.scss';

interface Props {
  isAddDestination?: boolean;
  isDestination?: boolean;
  isCourseCard?: boolean;
  isConditionalCard?: boolean;
  isAddComponentCard?: boolean;
  isCredentialCard?: boolean;
  data?: any;
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
  pathwayComponentCards: [any];
  isConditionalModalStatus?: boolean;
  setIsConditionalModalStatus?: (a: boolean) => void;
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
  constraintIcon,
  // onDelete,
  // onMoveItem,
  // number,
  // forwardRef,
  rowNumber,
  columnNumber,
  updatedPathwayComponentConditionCards,
  HasProgressionLevel,
  isConditionalModalStatus,
  setIsConditionalModalStatus,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const pathwayWrapper = useSelector((state: any) => state.initalReducer);
  const ref = useRef(null);
  const [visibleConstraintCondition, setVisibleConstraintCondition] =
    useState(false);
  const [showRightPenal, setShowRightPenal] = useState(false);
  const [filteredConditionalComponent, setFilteredConditionalComponent] =
    useState<any>([]);
  const [filteredPathwayComponent, setFilteredPathwayComponent] = useState<any>(
    []
  );

  const { mappedData: PathwayWrapper } = pathwayWrapper;
  const handledConstraintsModal = (bool: boolean) => {
    setVisibleConstraintCondition(bool);
  };

  useEffect(() => {
    if (isConditionalModalStatus) {
      setVisibleConstraintCondition(true);
    } else {
      setVisibleConstraintCondition(false);
    }
  }, [isConditionalModalStatus]);

  useEffect(() => {
    setFilteredConditionalComponent(
      updatedPathwayComponentConditionCards?.filter(
        (condition_card: any) =>
          condition_card.HasProgressionLevel === _.toString(HasProgressionLevel)
      )
    );

    setFilteredPathwayComponent(
      PathwayWrapper.PathwayComponents?.filter(
        (pathway_card: any) =>
          pathway_card.HasProgressionLevel === _.toString(HasProgressionLevel)
      )
    );
  }, [updatedPathwayComponentConditionCards]);

  const darkColor = '#0A2942';

  const onCancelHandler = (value: any) => {
    setVisibleConstraintCondition(value);
    !!setIsConditionalModalStatus && setIsConditionalModalStatus(value);
  };

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

  // const onDragEnterHandler = () => {
  //   const getElement = forwardRef.current[number];
  //   if (!_.isNull(getElement)) {
  //     const rect = getElement.getBoundingClientRect();
  //     getElement.style.width = `${rect.width * 2}px`;
  //   }
  // };

  const onDragStart = (e: any) => {
    setIsZoomDisabled(true);
    const target = e.target;
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
  };

  const onDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDragEnd = (e: any) => {
    setIsZoomDisabled(false);
    e.target.style.visibility = 'visible';
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

  const onPlusCircleClickHandler = (e: any) => {
    e.stopPropagation();
    setVisibleConstraintCondition(true);
  };

  return (
    <>
      {isDraggableCardVisible ? (
        <div className={styles.draggableAreaContainer} id={CTID?.toString()}>
          <div>
            <div className={styles.draggableAreaBox + ' ' + styles.hori}></div>
            <div
              className={`${styles.multiCardWrapper} ${
                (isAddDestination && destinationComponent) ||
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
              // onDragEnter={onDragEnterHandler}
              onMouseLeave={() => setIsZoomDisabled(false)}
              onMouseOver={() => setIsZoomDisabled(true)}
              id={CTID?.toString()}
              data-cardType="multiCard"
              data-columnNumber={columnNumber}
              data-rowNumber={rowNumber}
              data-CTID={data.CTID}
            >
              {destinationComponent && isAddDestination && (
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

              {/* {isDestination && (
                <div className={styles.destinationContentWrapper}>
                  <div className={styles.topDestinationContent}>
                    <FontAwesomeIcon
                      color={darkColor}
                      style={{ height: '20px' }}
                      icon={faStar}
                    />
                    <p className={styles.credentials}>Credential Component</p>
                    <FontAwesomeIcon
                      color={darkColor}
                      style={{ height: '20px', cursor: 'pointer' }}
                      icon={faEllipsis}
                      onClick={(e: any) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowPopover(!showPopover);
                      }}
                    />
                    {showPopover && (
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
                              }}
                            >
                              View
                            </span>
                            <span
                              onClick={(e: any) => {
                                e.stopPropagation();
                                e.preventDefault();
                              }}
                            >
                              Delete
                            </span>
                          </div>
                        }
                      ></Popover>
                    )}
                  </div>
                  <Divider style={{ backgroundColor: '#4EE5E1', margin: '8px 0px ' }} />
                  <div className={styles.bottomDestinationContent}>
                    <p className={styles.title}>
                      F291-COS BSCH - Bachlor of Science Honours
                    </p>
                  </div>
                </div>
                )} */}

              {((isCourseCard && !isCredentialCard) ||
                data.Type === 'course') && (
                <div className={styles.credentialsCardWrapeer}>
                  <div className={styles.topCourseContent}>
                    <FontAwesomeIcon
                      icon={faCubes}
                      style={{ height: '24px', width: '24px' }}
                    />
                    <span className={styles.title}>
                      {data.Name.slice(0, 30)}
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
                    {showPopover && !showRightPenal && (
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
                              }}
                            >
                              View
                            </span>
                            <span
                              onClick={(e: any) => {
                                e.stopPropagation();
                                e.preventDefault();
                              }}
                            >
                              Delete
                            </span>
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
                    <span>{data.CodedNotation}</span>
                    <span>{data.Description.slice(0, 40)}</span>
                  </div>
                  <div className={styles.creditSection}>
                    <span>Credits: 3</span>
                    <span>Level 10</span>
                  </div>
                </div>
              )}

              {isCredentialCard && (
                <>
                  <div className={styles.courseCredCardWrapper}>
                    <div className={styles.topCourseContent}>
                      <FontAwesomeIcon
                        icon={faCubes}
                        style={{ height: '24px', width: '24px' }}
                      />
                      <span className={styles.title}>
                        {data.Name.slice(0, 30)}
                      </span>
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
                      <span>{data.CodedNotation}</span>
                      <span>{data.Description.slice(0, 40)}</span>
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
                    <span>Required {}</span>
                    <FontAwesomeIcon
                      color="#ffffff"
                      style={{ height: '20px', cursor: 'pointer' }}
                      icon={faEllipsis}
                      onClick={noop}
                    />
                  </div>
                  <div className={styles.requiredSection}>
                    <span>{data.Description}</span>
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
            <div className={styles.draggableAreaBox + ' ' + styles.hori}></div>
          </div>
          <div className={styles.draggableAreaBox}></div>
        </div>
      ) : (
        <div
          className={`${styles.multiCardWrapper} ${
            (isAddDestination && destinationComponent) ||
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
          data-CTID={data.CTID}
        >
          {destinationComponent && isAddDestination && (
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
                direction="right"
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

          {/* {isDestination && (
              <div className={styles.destinationContentWrapper}>
                <div className={styles.topDestinationContent}>
                  <FontAwesomeIcon
                    color={darkColor}
                    style={{ height: '20px' }}
                    icon={faStar}
                  />
                  <p className={styles.credentials}>Credential Component</p>
                  <FontAwesomeIcon
                    color={darkColor}
                    style={{ height: '20px', cursor: 'pointer' }}
                    icon={faEllipsis}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setShowPopover(!showPopover);
                    }}
                  />
                  {showPopover && (
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
                            }}
                          >
                            View
                          </span>
                          <span
                            onClick={(e: any) => {
                              e.stopPropagation();
                              e.preventDefault();
                            }}
                          >
                            Delete
                          </span>
                        </div>
                      }
                    ></Popover>
                  )}
                </div>
                <Divider style={{ backgroundColor: '#4EE5E1', margin: '8px 0px ' }} />
                <div className={styles.bottomDestinationContent}>
                  <p className={styles.title}>
                    F291-COS BSCH - Bachlor of Science Honours
                  </p>
                </div>
              </div>
              )} */}

          {((isCourseCard && !isCredentialCard) || data.Type === 'course') && (
            <>
              {isDestination && constraintIcon && (
                <div className={styles.addIcon}>
                  <FontAwesomeIcon
                    icon={faCirclePlus}
                    fill="#000000"
                    style={{
                      height: '22px',
                      width: '22px',
                      color: '#ffb90b',
                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      onPlusCircleClickHandler(e);
                    }}
                  />
                </div>
              )}

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
                  <FontAwesomeIcon
                    icon={faCubes}
                    style={{ height: '24px', width: '24px' }}
                  />
                  <span className={styles.title}>{data.Name.slice(0, 30)}</span>
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
                  {showPopover && !showRightPenal && (
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
                            }}
                          >
                            View
                          </span>
                          <span
                            onClick={(e: any) => {
                              e.stopPropagation();
                              e.preventDefault();
                              // onDelete(data);
                            }}
                          >
                            Delete
                          </span>
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
                  <span>{data.CodedNotation}</span>
                  <span>{data.Description.slice(0, 40)}</span>
                </div>
                <div className={styles.creditSection}>
                  <span>Credits: 3</span>
                  <span>Level 10</span>
                </div>
              </div>
              <span
                className={styles.ornageSection + ' ' + styles.right}
              ></span>
            </>
          )}

          {isCredentialCard && (
            <>
              <div className={styles.courseCredCardWrapper}>
                <div className={styles.topCourseContent}>
                  <FontAwesomeIcon
                    icon={faCubes}
                    style={{ height: '24px', width: '24px' }}
                  />
                  <span className={styles.title}>{data.Name.slice(0, 30)}</span>
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
                  <span>{data.CodedNotation}</span>
                  <span>{data.Description.slice(0, 40)}</span>
                </div>
              </div>
            </>
          )}

          {isConditionalCard && (
            <>
              {isConditionalCard && (
                <div
                  className={
                    styles.addIcon + ' ' + styles.isConditionalCardIcon
                  }
                >
                  <FontAwesomeIcon
                    icon={faCirclePlus}
                    fill="#000000"
                    style={{
                      height: '22px',
                      width: '22px',
                      color: '#ffb90b',
                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      onPlusCircleClickHandler(e);
                    }}
                  />
                </div>
              )}
              <React.Fragment>
                <div className={styles.conditionalCardContent}>
                  <FontAwesomeIcon
                    color="#ffffff"
                    style={{ height: '20px', cursor: 'pointer' }}
                    icon={faSitemap}
                    onClick={noop}
                  />
                  <span>Required {data?.RequiredNumber}</span>
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
                {showPopover && !showRightPenal && (
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
                          }}
                        >
                          View
                        </span>
                        <span
                          onClick={(e: any) => {
                            e.stopPropagation();
                            e.preventDefault();
                            // onDelete(data);
                          }}
                        >
                          Delete
                        </span>
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
                  <span>{data.Description}</span>
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
      <Modal
        visible={visibleConstraintCondition}
        title=""
        footer={[]}
        onCancel={() => onCancelHandler(false)}
      >
        <AddConditionalComponent
          visibleConstraintConditionProp={handledConstraintsModal}
          data={data}
          filteredConditionalComponent={filteredConditionalComponent}
          filteredPathwayComponent={filteredPathwayComponent}
          isDestinationCard={isDestination}
          setIsConditionalModalStatus={setIsConditionalModalStatus}
        />
      </Modal>

      <RightPanel
        visible={showRightPenal}
        onCloseHandler={(val: boolean) => setShowRightPenal(val)}
        panelData={data}
      />
    </>
  );
};

export default MultiCard;
