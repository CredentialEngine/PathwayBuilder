import React, { useEffect } from 'react';

interface Props {
  onDrop: (a: any) => void;
  children: any;
  key: string;
  column: string;
  forwardRef?: any;
  width?: any;
  status?: any;
  CTID?: string;
  id?: number | string;
}

const DropWrapper: React.FC<Props> = ({
  id,
  onDrop,
  children,
  forwardRef,
  width,
  status,
  CTID,
}) => {
  const allowDrop = (e: any) => e.preventDefault();
  // const [updatedWidth, setWidth] = useState(width);
  const handleDrop = (e: any) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('card_id'));
    onDrop({ ...data, status, CTID });
  };

  useEffect(() => {
    /* 
    Will try this method to increase speccific width of a div 

    const element = forwardRef.current.getBoundingClientRect();
    element.width = '600px';
    setWidth('600px');

    */
  }, []);

  return (
    <div
      id={id?.toString()}
      onDragOver={allowDrop}
      onDrop={handleDrop}
      ref={forwardRef}
      style={{
        display: 'flex',
        width: `${width}`,
        flexDirection: 'column',
        height: 'auto',
        backgroundColor: '#ffffff',
      }}
    >
      {children}
    </div>
  );
};

export default DropWrapper;
