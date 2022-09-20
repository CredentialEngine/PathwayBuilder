import React from 'react';

interface Props {
  onDrop: (a: any, b: any, c: any, d: any, e: any) => void;
  children: any;
  key: string;
  column: string;
  width?: any;
  CTID?: string;
  id?: number | string;
  destinationColumn?: boolean;
  HasProgressionLevel: string;
  index: number;
  className?: any;
  isDestinationColumnSelected?: any;
  number: number;
  forwardRef: any;
}

const DropWrapper: React.FC<Props> = ({
  id,
  onDrop,
  children,
  width,
  CTID,
  destinationColumn,
  HasProgressionLevel,
  className,
  number,
  isDestinationColumnSelected,
  forwardRef,
}) => {
  const allowDrop = (e: any) => e.preventDefault();

  const handleDrop = (e: any) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('card_id'));
    e.stopPropagation();

    onDrop(
      data,
      CTID,
      destinationColumn,
      HasProgressionLevel,
      isDestinationColumnSelected
    );
  };

  return (
    <div
      id={id?.toString()}
      onDragOver={allowDrop}
      onDrop={handleDrop}
      style={{
        display: 'flex',
        width: `${width}`,
        flexDirection: 'column',
        height: 'auto',
        backgroundColor: '#ffffff',
      }}
      className={className}
      ref={(element: any) => {
        forwardRef.current[number] = element;
      }}
    >
      <div d-attr="title">{children}</div>
    </div>
  );
};

export default DropWrapper;
