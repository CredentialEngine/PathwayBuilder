import React from 'react';

export interface Props {
  id: string;
  children: JSX.Element;
  className?: string;
  draggable: boolean;
}

const Card: React.FC<Props> = (props) => {
  const dragStart = (e: any) => {
    const target = e.target;

    e.dataTransfer.setData('card_id', target.id);

    setTimeout(() => {
      target.style.display = 'none';
    }, 0);
  };

  const dragOver = (e: any) => {
    e.stopPropagation();
  };
  return (
    <div
      id={props.id}
      className={props.className}
      draggable={props.draggable}
      onDragStart={dragStart}
      onDragOver={dragOver}
    >
      {props.children}
    </div>
  );
};

export default Card;
