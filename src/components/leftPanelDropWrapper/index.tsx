import React from 'react';

interface Props {
  onDrop: (tabName: string, card: any) => void;
  children: any;
  tabName: string;
  className: any;
}

const LeftPanelDropWrapper: React.FC<Props> = ({
  onDrop,
  children,
  tabName,
  className,
}) => {
  const allowDrop = (e: any) => e.preventDefault();

  const handleDrop = (e: any) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('leftPanel_card'));
    e.stopPropagation();
    onDrop(tabName, data);
  };

  return (
    <div
      onDragOver={allowDrop}
      onDrop={handleDrop}
      className={className}
      data-cardtype="leftPanel"
    >
      {children}
    </div>
  );
};

export default LeftPanelDropWrapper;
