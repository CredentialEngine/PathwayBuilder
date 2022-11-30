import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export interface Props {
  children: React.ReactNode;
}

const TestComponent = (props: Props) => {
  const { children } = props;
  return (
    <div>
      <div
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: 'white',
          position: 'fixed',
          top: 'auto',
          left: '30px',
          zIndex: 9,
        }}
      >
        <FontAwesomeIcon
          icon={faAngleDoubleLeft}
          style={{
            height: '30px',
            width: '30px',
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '7px 8px',
          }}
        />
      </div>
      <div
        id="left-frame"
        style={{
          width: '395px',
          display: 'flex',
          justifyContent: 'flex-end',
          backgroundColor: '#eeecec',
          flexDirection: 'row-reverse',
          position: 'fixed',
          height: '100%',
          minHeight: '100%',
          zIndex: 5,
          transform: 'translate3d(0%, 0, 0)',
          transition: 'transform 100ms ease-in',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default TestComponent;
