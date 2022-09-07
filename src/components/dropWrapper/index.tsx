import _ from 'lodash';
import React, { useEffect, useRef } from 'react';

interface Props {
  onDrop: (a: any, b: any, c: any, d: any) => void;
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
}

const DropWrapper: React.FC<Props> = ({
  id,
  onDrop,
  children,
  width,
  CTID,
  destinationColumn,
  HasProgressionLevel,
  index,
  className,
}) => {
  const allowDrop = (e: any) => e.preventDefault();
  const wrapperRef = useRef<Array<HTMLDivElement | null>>([]);

  const handleDrop = (e: any) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('card_id'));
    e.stopPropagation();

    onDrop(data, CTID, destinationColumn, HasProgressionLevel);
  };

  useEffect(() => {
    // Will try this method to increase speccific width of a div
    if (!_.isNull(wrapperRef)) {
      wrapperRef.current = wrapperRef.current.slice(0, index);
    }
  }, [wrapperRef]);

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
        wrapperRef.current[index] = element;
      }}
    >
      <div d-attr="title">{children}</div>
    </div>
  );
};

export default DropWrapper;
