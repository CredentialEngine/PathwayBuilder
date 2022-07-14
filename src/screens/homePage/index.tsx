import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
// import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Layout, Row } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import React, { useState } from 'react';

import CourseCard from '../../components/courseCard';
import DropWrapper from '../../components/dropWrapper';
import Header from '../../components/header';
import LeftPanel from '../../components/leftPanel';
// import RightPanel from '../../components/rightPanel';

import styles from './index.module.scss';

const Columns: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

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

  const onCloseHandler = () => {
    const element = document.getElementById('left-frame');
    if (element != null) {
      element.style.display = 'none';
    }
    // setRightPanelDrawerVisible(false);
  };

  return (
    <Layout className={styles.centralPannel}>
      <Header />
      <Layout style={{ display: 'flex', flexDirection: 'row' }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <LeftPanel onCloseHandler={() => onCloseHandler} />
        </Sider>
        <Layout className="site-layout">
          <div
            className="site-layout-background"
            style={{
              padding: 0,
              width: 'fit-content',
              position: 'relative',
              top: '8px',
              zIndex: '1',
              backgroundColor: '#FFFFFF',
              height: '0px',
              left: '5px',
            }}
          >
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </div>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              height: '100vh',
              width: '100%',
            }}
          >
            <Row>
              {columns.map((column: any) => (
                <Col
                  key={column.title}
                  span={24 / columns.length}
                  style={{
                    backgroundColor: `${column.color}`,
                    textAlign: 'center',
                  }}
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
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Columns;
