import {
  faCirclePlus,
  faCubes,
  faEllipsis,
  faSitemap,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, Popover } from 'antd';
import { noop } from 'lodash';

import React, { useEffect, useRef, useState } from 'react';

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
  CTID?: string;
  id?: number | string;
  inProgressLevel?: string;
  columnId?: string;
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
  rowNumber: number;
  columnNumber: number;
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
  id,
  inProgressLevel,
  destinationComponent,
  onSelectDragElemenet,
  isAddFirst,
  firstComponent,
  getEndPoints,
  isDraggableCardVisible,
  constraintIcon,
  // onMoveItem,
  // number,
  // forwardRef,
  // leftpanelSelectedElem,
  rowNumber,
  columnNumber,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  showPopover;
  const ref = useRef(null);
  const [visibleConstraintCondition, setVisibleConstraintCondition] =
    useState(false);
  const [showRightPenal, setShowRightPenal] = useState(false);

  const handledConstraintsModal = (bool: boolean) => {
    setVisibleConstraintCondition(bool);
  };
  // useEffect(() => {
  //   const dragElement = leftpanelSelectedElem;
  //   if (!_.isNull(dragElement) && !_.isUndefined(dragElement)) {
  //     const element = dragElement.getBoundingClientRect();
  //   }
  // }, [leftpanelSelectedElem]);

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
    getEndPoints(e, id);
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
    onSelectDragElemenet(data);
    setTimeout(() => {
      target.style.visibility = 'hidden';
    }, 0);
  };

  const onDragOver = (e: any) => {
    // onMoveItem(e.target.innerText);

    e.preventDefault();
    e.stopPropagation();
  };

  const onDragEnd = (e: any) => {
    setIsZoomDisabled(false);
    e.target.style.visibility = 'visible';
    // e.target.style.position = 'absolute';
    // // e.target.style.left = `${e.pageX - 75}px`;
    // e.target.style.top = `${e.pageY - 75}px`;
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

  const darkColor = '#0A2942';

  return (
    <>
      {isDraggableCardVisible ? (
        <div className={styles.draggableAreaContainer}>
          <div
            id="verticalBorder"
            draggable={true}
            // onDragEnter={onDragEnterHandler}
            className={styles.draggableAreaBox}
          ></div>
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
              onMouseLeave={() => setIsZoomDisabled(false)}
              onMouseOver={() => setIsZoomDisabled(true)}
              id={id?.toString()}
              data-ticket="1223887"
              data-columnNumber={columnNumber}
              data-rowNumber={rowNumber}
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
                    <span>Component Condition</span>
                    <FontAwesomeIcon
                      color="#ffffff"
                      style={{ height: '20px', cursor: 'pointer' }}
                      icon={faEllipsis}
                      onClick={noop}
                    />
                  </div>
                  <div className={styles.requiredSection}>
                    <span>4/4 Required</span>
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
          // onClick={(e) => {
          //   onClick;
          //   getEndPoints(e, id);
          // }}
          onClick={(e: any) => {
            getOnClick(e);
          }}
          onMouseLeave={() => setIsZoomDisabled(false)}
          onMouseOver={() => setIsZoomDisabled(true)}
          id={id?.toString()}
          data-ticket="1223887"
          data-columnNumber={columnNumber}
          data-rowNumber={rowNumber}
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
                    onClick={() => {
                      setVisibleConstraintCondition(true);
                    }}
                  />
                </div>
              )}

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
            <React.Fragment>
              <div className={styles.conditionalCardContent}>
                <FontAwesomeIcon
                  color="#ffffff"
                  style={{ height: '20px', cursor: 'pointer' }}
                  icon={faSitemap}
                  onClick={noop}
                />
                <span>Component Condition</span>
                <FontAwesomeIcon
                  color="#ffffff"
                  style={{ height: '20px', cursor: 'pointer' }}
                  icon={faEllipsis}
                  onClick={noop}
                />
              </div>
              <div className={styles.requiredSection}>
                <span>4/4 Required</span>
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
      )}
      <Modal
        visible={visibleConstraintCondition}
        title=""
        footer={[]}
        onCancel={() => setVisibleConstraintCondition(false)}
      >
        <AddConditionalComponent
          visibleConstraintConditionProp={handledConstraintsModal}
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
