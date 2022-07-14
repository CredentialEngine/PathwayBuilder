import React from 'react';

interface Props {
  onDrop: (a: any) => void;
  children: any;
}

const DropWrapper = (props: Props) => {
  const { onDrop, children } = props;
  const allowDrop = (e: any) => e.preventDefault();

  const handleDrop = (e: any) => {
    const data = JSON.parse(e.dataTransfer.getData('item'));
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
