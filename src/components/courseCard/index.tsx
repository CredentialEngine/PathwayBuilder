import { Card, Divider } from 'antd';
import React from 'react';

import Icon from '../../assets/images/abc.png';

import styles from './index.module.scss';

interface Props {
  credits: number;
  level: number;
  draggable?: boolean;
  id?: string;
}
const CourseCard = (props: Props) => {
  const { credits, level, draggable = true, id } = props;

  const onDragStart = (e: any) => {
    const target = e.target;
    e.dataTransfer.setData('card_id', target.id);
    setTimeout(() => {
      target.style.display = 'hidden';
    }, 0);
  };

  const onDragOver = (e: any) => {
    e.stopPropagation();
  };

  const onDragEnd = (e: any) => {
    e.target.style.visibility = 'visible';
  };

  return (
    <div>
      <Card
        id={id}
        className={styles.cardPadding}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className={styles.cardContainer}>
          <div className={styles.cardHeaders}>
            <img src={Icon} className={styles.img} alt="icon" />
            <span className={styles.course}>Course</span>
          </div>
          <span className={styles.img}>Ashish</span>
        </div>
        <Divider className={styles.divider} />
        <div className={styles.title}>Ashish Yadav</div>
        <div className={styles.cardFooter}>
          <span>Credits: {credits}</span>
          <span>Level {level}</span>
        </div>
      </Card>
    </div>
  );
};
export default CourseCard;
