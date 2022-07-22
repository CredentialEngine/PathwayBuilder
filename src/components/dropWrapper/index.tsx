import React from 'react';

interface Props {
  onDrop: (a: any, b: string) => void;
  children: any;
  key: string;
  column: string;
}

const DropWrapper = (props: Props) => {
  const { onDrop, children } = props;
  const allowDrop = (e: any) => e.preventDefault();
  const handleDrop = (e: any) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('card_id'));
    onDrop(data);
  };

  return (
    <div
      onDragOver={allowDrop}
      onDrop={handleDrop}
      style={{
        display: 'flex',
        width: '100%',
      }}
    >
      {children}
    </div>
  );
};

export default DropWrapper;
