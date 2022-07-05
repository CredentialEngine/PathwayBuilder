import React from 'react';

import styles from './dragBoard.module.scss';

export interface Props {
  id: string;
  children?: JSX.Element;
  className?: string;
}
const DragBoard: React.FC<Props> = (props) => {
  const drop = (e: any) => {
    e.preventDefault();
    const card_id: string = e?.dataTransfer?.getData('card_id');
    const card = document.getElementById(card_id);

    e.target.style.visibility = 'visible';
    e.target.style.display = 'block';

    e.target.appendChild(card);
  };

  const onDragOver = (e: any) => {
    e.preventDefault();
  };

  return (
    <div
      className={styles.board}
      id={props.id}
      onDrop={drop}
      onDragOver={onDragOver}
    >
      {props?.children}
    </div>
  );
};

export default DragBoard;
