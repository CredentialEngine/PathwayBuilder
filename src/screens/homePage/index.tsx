import { Col, Row } from 'antd';
import React from 'react';

import CourseCard from '../../components/courseCard';
import DropWrapper from '../../components/dropWrapper';

const Columns: React.FC = () => {
  const items = [
    {
      id: 1,
      level: '29',
      credit: '40',
      title: 'first test card',
    },
    {
      id: 2,
      level: '69',
      credit: '11',
      title: 'first test card',
    },
    {
      id: 3,
      level: '12',
      credit: '38',
      title: 'first test card',
    },
    {
      id: 4,
      level: '76',
      credit: '23',
      title: 'first test card',
    },
  ];
  const columns = [
    {
      title: 'Stage 1',
      color: '#83edea',
      children: [
        {
          id: 1,
          title: 'Semster 1',
          color: '#48bdba',
        },
        {
          id: 2,
          title: 'Semster 2',
          color: '#adf1ef',
        },
      ],
    },
    {
      title: 'Stage 2',
      color: '#5fb3b8',
      children: [
        {
          id: 1,
          title: 'Semster 1',
          color: '#48bdba',
        },
        {
          id: 2,
          title: 'Semster 2',
          color: '#adf1ef',
        },
      ],
    },
    {
      title: 'Stage 3',
      color: '#83edea',
      children: [
        {
          id: 1,
          title: 'Semster 1',
          color: '#48bdba',
        },
        {
          id: 2,
          title: 'Semster 2',
          color: '#adf1ef',
        },
      ],
    },
    {
      title: 'Stage 4',
      color: '#5fb3b8',
      children: [
        {
          id: 1,
          title: 'Semster 1',
          color: '#48bdba',
        },
        {
          id: 2,
          title: 'Semster 2',
          color: '#adf1ef',
        },
      ],
    },
  ];

  const ondrop = (e: any) => {
    e.preventDefault();
    const card_id: string = e?.dataTransfer?.getData('card_id');
    const card = document.getElementById(card_id);

    e.target.style.visibility = 'visible';
    e.target.style.display = 'block';

    e.target.appendChild(card);
  };

  // const onDragOver = (e: any) => {
  //   e.preventDefault();
  // };

  // const onLeftDrawerClickHandler = () => {
  //   const element = document.getElementById('left-frame');
  //   if (element != null) {
  //     element.style.display = 'none';
  //   }
  // };

  return (
    <div style={{ width: '100%', marginLeft: '395px' }}>
      <Row>
        {/* <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: 'white',
            position: 'fixed',
            top: 'auto',
            left: '30px',
            zIndex: 9,
          }}
          onClick={onLeftDrawerClickHandler}
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
        </div> */}

        {columns.map((column: any) => (
          <Col
            key={column.title}
            span={24 / columns.length}
            style={{ backgroundColor: `${column.color}`, textAlign: 'center' }}
          >
            <span style={{ color: '#000000' }}>{column.title}</span>
            <Row>
              <DropWrapper onDrop={ondrop}>
                {column.children.map((child: any) => (
                  <Col
                    draggable={true}
                    key={child.title}
                    span={24 / column.children.length}
                    style={{
                      backgroundColor: `${
                        child.id % 2 !== 0 ? '#ffffff' : '#f0f0f0'
                      }`,
                      textAlign: 'center',
                      height: '100vh',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          width: '100%',
                          backgroundColor: `${
                            child.id % 2 === 0 ? child.color : '#aeaeae'
                          }`,
                        }}
                      >
                        {child.title}
                      </span>
                      {items.map((item: any) => (
                        <CourseCard
                          key={item.id}
                          level={item.level}
                          credits={item.credits}
                        />
                      ))}
                    </div>
                  </Col>
                ))}
              </DropWrapper>
            </Row>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Columns;
