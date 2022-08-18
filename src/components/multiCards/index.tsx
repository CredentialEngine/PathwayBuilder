import { faStar } from '@fortawesome/free-regular-svg-icons';
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
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const ref = useRef(null);

  const onDragStart = (e: any) => {
    setIsZoomDisabled(true);
    const target = e.target;
    e.dataTransfer.setData(
      'card_id',
      JSON.stringify({ ...data, status, CTID })
    );
    setTimeout(() => {
      target.style.display = 'hidden';
    }, 0);
  };

  const onDragOver = (e: any) => {
    e.preventDefault();
  };

  const onDragEnd = (e: any) => {
    setIsZoomDisabled(false);

    e.target.style.visibility = 'visible';

    // const shiftX = e.clientX - e.target.getBoundingClientRect().left;
    // const shiftY = e.clientY - e.target.getBoundingClientRect().top;

    // e.target.style.position = 'absolute';
    // e.target.style.left = `${e.pageX - shiftX}px`;
    // e.target.style.top = `${e.pageY - shiftY}px`;
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
    <div
      className={`${styles.multiCardWrapper} ${
        isAddDestination ? styles.addDestinationCard : ''
      } ${isDestination ? styles.isDestination : ''} ${
        isCourseCard ? styles?.isCourseCard : ''
      } ${isConditionalCard ? styles.conditionalCard : ''} ${
        isAddComponentCard ? styles.addComponentCard : ''
      } ${isCredentialCard ? styles.isCredentialCard : ''}`}
      draggable={true}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onClick={onClick}
      onMouseLeave={() => setIsZoomDisabled(false)}
      onMouseOver={() => setIsZoomDisabled(true)}
    >
      {(isAddDestination || data.type === 'addDestination') && (
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
      )}

      {isDestination && (
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
      )}

      {(isCourseCard || data.type === 'course') && (
        <div className={styles.credentialsCardWrapeer}>
          <div className={styles.topCourseContent}>
            <FontAwesomeIcon
              icon={faCubes}
              style={{ height: '24px', width: '24px' }}
            />
            <span className={styles.title}>{data.name}</span>
            <FontAwesomeIcon
              color={darkColor}
              style={{ height: '20px', cursor: 'pointer' }}
              icon={faEllipsis}
              onClick={noop}
            />
          </div>
          <Divider
            style={{ backgroundColor: '#F3F4F6', margin: '8px 0px 4px 0px' }}
          />
          <div className={styles.courseNameContainter}>
            <span>{data.codedNotation}</span>
            <span>{data.description}</span>
          </div>
          <div className={styles.creditSection}>
            <span>Credits: 3</span>
            <span>Level 10</span>
          </div>
        </div>
      )}

      {(isCredentialCard || data.type === 'credentials') && (
        <div className={styles.courseCardWrapeer}>
          <div className={styles.topCourseContent}>
            <FontAwesomeIcon
              icon={faCubes}
              style={{ height: '24px', width: '24px' }}
            />
            <span className={styles.title}>{data.name}</span>
            <FontAwesomeIcon
              color={darkColor}
              style={{ height: '20px', cursor: 'pointer' }}
              icon={faEllipsis}
              onClick={noop}
            />
          </div>
          <Divider
            style={{ backgroundColor: '#6EFFFF', margin: '8px 0px 4px 0px' }}
          />
          <div className={styles.courseNameContainter}>
            <span>{data.codedNotation}</span>
            <span>{data.description}</span>
          </div>
        </div>
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
  );
};

export default MultiCard;
