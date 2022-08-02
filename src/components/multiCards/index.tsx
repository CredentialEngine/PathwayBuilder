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
  data?: any;
  onClick?: () => void;
  setIsZoomDisabled: (a: any) => void;
}

const MultiCard: React.FC<Props> = ({
  isAddDestination,
  isDestination = true,
  isCourseCard,
  isConditionalCard,
  isAddComponentCard,
  data,
  onClick,
  setIsZoomDisabled,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const ref = useRef(null);

  const onDragStart = (e: any) => {
    setIsZoomDisabled(true);
    const target = e.target;
    e.dataTransfer.setData('card_id', JSON.stringify(data));
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

    const shiftX = e.clientX - e.target.getBoundingClientRect().left;
    const shiftY = e.clientY - e.target.getBoundingClientRect().top;

    e.target.style.left = `${e.pageX - shiftX}px`;
    e.target.style.top = `${e.pageY - shiftY}px`;
    e.target.style.position = 'absolute';
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
      }`}
      draggable={true}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onClick={onClick}
      onMouseLeave={() => setIsZoomDisabled(false)}
      onMouseOver={() => setIsZoomDisabled(true)}
    >
      {isAddDestination && (
        <div className={styles.addDestinationContent}>
          <p className={styles.addDestinationTitle}>
            Add your destination component
          </p>
          <FontAwesomeIcon
            style={{ height: '20px' }}
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
            <p className={styles.credentials}>Credential</p>
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
          <div className={styles.bottomDestinationContent}>
            <p className={styles.title}>
              Business of Retail: Operations and Profit
            </p>
          </div>
        </div>
      )}

      {isCourseCard && (
        <div className={styles.courseCardWrapeer}>
          <div className={styles.topCourseContent}>
            <FontAwesomeIcon
              icon={faCubes}
              style={{ height: '24px', width: '24px' }}
            />
            <span className={styles.title}>Course</span>
            <FontAwesomeIcon
              color={darkColor}
              style={{ height: '20px', cursor: 'pointer' }}
              icon={faEllipsis}
              onClick={noop}
            />
          </div>
          <div className={styles.courseNameContainter}>
            <span>Business of Retail Course</span>
          </div>
          <div className={styles.creditSection}>
            <span>3 Credits</span>
            <span>Management Level</span>
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
          <Divider style={{ color: '#ffb90b', margin: '0px', opacity: 1 }} />
          <span className={styles.totalCredit}>480 Credits Total</span>
        </div>
      )}
    </div>
  );
};

export default MultiCard;
