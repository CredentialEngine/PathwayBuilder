import _ from 'lodash';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  onDrop: (
    cardData: any,
    destinationColumn: any,
    HasProgressionLevel: any,
    isDestinationColumnSelected: any,
    rowNumber: any,
    columnNumber: any,
    columnNumberEsixt: any,
    isFirstColumneSelected: any,
    firstColumn: boolean
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
  column_num: number;
  setOverlayData: (a: any) => void;
  overlayData: any;
  updatedPathwayComponentConditionCards: any;
  isFirstColumneSelected: boolean;
  firstColumn: boolean;
  setDraggableCardVisible: (a: any) => void;
  isViewMode: boolean;
  setGridMode: boolean;
}

const DropWrapper: React.FC<Props> = ({
  id,
  onDrop,
  children,
  width,
  destinationColumn,
  HasProgressionLevel,
  className,
  number,
  isDestinationColumnSelected,
  forwardRef,
  rowNumber,
  // columnNumber,
  column_num,
  setOverlayData,
  overlayData,
  // updatedPathwayComponentConditionCards,
  isFirstColumneSelected,
  firstColumn,
  setDraggableCardVisible,
  isViewMode,
  setGridMode,
}) => {
  const allowDrop = (e: any) => e.preventDefault();
  const [columnNumberEsixt, setColumnNumber] = useState<boolean>(false);

  const handleDrop = (e: any) => {
    if (!isViewMode) {
      e.preventDefault();
      setColumnNumber(false);
      // const conditinalComponentColumnNumber =
      //   updatedPathwayComponentConditionCards
      //     .filter(
      //       (condtional_card: any) =>
      //         condtional_card.HasProgressionLevel === HasProgressionLevel
      //     )
      //     .reduce((acc: any, curr: any) => {
      //       if (acc >= curr.ColumnNumber) {
      //         return acc;
      //       } else {
      //         return curr.ColumnNumber;
      //       }
      //     }, 1);
      let data = JSON.parse(e.dataTransfer.getData('card_id'));
      if (data?.isComponentTab === true) {
        const CTID = `ce-${uuidv4()}`;
        data = {
          ...data,
          CTID,
          RowId: uuidv4(),
        };
      }
      e.stopPropagation();
      debugger;
      onDrop(
        data,
        destinationColumn,
        HasProgressionLevel,
        isDestinationColumnSelected,
        rowNumber,
        column_num + 1,
        columnNumberEsixt,
        isFirstColumneSelected,
        firstColumn
      );
    }
  };

  const onDragEnterHandler = (event: any) => {
    if (
      event?.target?.id === 'multiCard-Wrapper' ||
      event?.target?.id === 'horizontalBorder'
    ) {
      setColumnNumber(true);
      return;
    }

    if (
      event.currentTarget.contains(event.relatedTarget) ||
      event?.target?.innerHTML?.includes('span')
    ) {
      const columnNumber =
        event?.relatedTarget?.getAttribute('data-columnNumber');
      const rowNumber = event?.relatedTarget?.getAttribute('data-rowNumber');
      const onHoverCTID = event?.relatedTarget?.getAttribute('data-CTID');

      if (
        !_.isNull(columnNumber) &&
        !_.isNull(rowNumber) &&
        onHoverCTID !== ''
      ) {
        setOverlayData({
          ...overlayData,
          columnNumber: columnNumber + 1,
          rowNumber,
          CTID: onHoverCTID,
        });
      }
      setColumnNumber(true);
    } else {
      setColumnNumber(false);
    }
  };

  const onDragEndHandler = (e: any) => {
    e.target.style.visibility = 'visible';
    !!setDraggableCardVisible && setDraggableCardVisible(false);

    setColumnNumber(false);
  };

  return (
    <div
      id={id?.toString()}
      onDragOver={allowDrop}
      onDrop={handleDrop}
      onDragEnter={onDragEnterHandler}
      onDragEnd={onDragEndHandler}
      style={
        setGridMode
          ? {
              display: 'flex',
              width: `${width}`,
              flexDirection: 'column',
              height: '200px',
              border: '1px dashed rgb(78, 229, 225)',
            }
          : {
              display: 'flex',
              width: `${width}`,
              flexDirection: 'column',
              height: '200px',
            }
      }
      className={className}
      ref={(element: any) => {
        forwardRef.current[number] = element;
      }}
      data-cardType="multiCard"
      data-ColumnNumber={children?.CTID}
    >
      {children}
    </div>
  );
};

export default DropWrapper;
