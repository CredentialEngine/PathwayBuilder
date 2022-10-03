import _ from 'lodash';
import React, { useState } from 'react';

interface Props {
  onDrop: (
    a: any,
    b: any,
    c: any,
    d: any,
    e: any,
    f: any,
    g: any,
    h: any
  ) => void;
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
  rowNumber: number;
  colNumber: number;
  columnNumber: number;
  abc: number;
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
  rowNumber,
  colNumber,
  columnNumber,
  abc,
}) => {
  const allowDrop = (e: any) => e.preventDefault();
  const [columnNumberEsixt, setColumnNumber] = useState<boolean>(false);
  const [overlayData, setOverlayData] = useState<any>({
    columnNumber: 0,
    rowNumber: 0,
  });

  // console.log('overlayData  ===>', overlayData);
  // const columnNumber1 = 0;
  // console.log('colNumber - -->', columnNumber, colNumber);
  // console.log('abc --->', abc);
  const handleDrop = (e: any) => {
    e.preventDefault();
    setColumnNumber(false);

    const data = JSON.parse(e.dataTransfer.getData('card_id'));
    e.stopPropagation();
    // need to check heremi
    // console.log('columnNumber  -dropWrapper->', columnNumber);
    // console.log('data  -dropWrapper->', data);
    // console.log('columnNumberEsixt ==>', columnNumberEsixt);

    // console.log('overlayData  inside ===>', overlayData);

    columnNumberEsixt
      ? onDrop(
          data,
          CTID,
          destinationColumn,
          HasProgressionLevel,
          isDestinationColumnSelected,
          rowNumber,
          colNumber + 1,
          columnNumber + 1
        )
      : onDrop(
          data,
          CTID,
          destinationColumn,
          HasProgressionLevel,
          isDestinationColumnSelected,
          rowNumber,
          colNumber,
          abc + 1
        );
  };

  const onDragEnterHandler = (event: any) => {
    // console.log('onDragEnter -->', event);

    // if (!_.isNull(event.currentTarget)) {
    //   console.log(
    //     'check -condition -->',
    //     event.currentTarget.contains(event.relatedTarget)
    //   );

    //   console.log(
    //     'check-data -->',
    //     event.relatedTarget.getAttribute('data-ticket')
    //   );
    // }

    if (event.currentTarget.contains(event.relatedTarget)) {
      const columnNumber =
        event.relatedTarget.getAttribute('data-columnNumber');
      const rowNumber = event.relatedTarget.getAttribute('data-rowNumber');
      if (!_.isNull(columnNumber) && !_.isNull(rowNumber)) {
        setOverlayData({ ...overlayData, columnNumber, rowNumber });
      }
      setColumnNumber(true);
    } else {
      setColumnNumber(false);
    }
  };

  const onDragEndHandler = () => {
    setColumnNumber(false);
  };

  // const onMouseOverHandler = (event: any) => {
  //   if (event.currentTarget.contains(event.relatedTarget)) {
  //     const columnNumber =
  //       event.relatedTarget.getAttribute('data-columnNumber');
  //     const rowNumber = event.relatedTarget.getAttribute('data-rowNumber');
  //     if (!_.isNull(columnNumber) && !_.isNull(rowNumber)) {
  //       setOverlayData({ ...overlayData, columnNumber, rowNumber });
  //     }
  //   }
  // };

  return (
    <div
      id={id?.toString()}
      onDragOver={allowDrop}
      onDrop={handleDrop}
      onDragEnter={onDragEnterHandler}
      onDragEnd={onDragEndHandler}
      // onMouseOver={onMouseOverHandler}
      style={{
        display: 'flex',
        width: `${width}`,
        flexDirection: 'column',
        height: '200px',
        backgroundColor: '#ffffff',
      }}
      className={className}
      ref={(element: any) => {
        forwardRef.current[number] = element;
      }}
    >
      {children}
    </div>
  );
};

export default DropWrapper;
