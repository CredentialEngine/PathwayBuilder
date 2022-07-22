import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import React, { useState } from 'react';

import DropWrapper from '../../components/dropWrapper';
import Header from '../../components/header';
import LeftPanel from '../../components/leftPanel';
import MultiCard from '../../components/multiCards';

import styles from './index.module.scss';

const Columns: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [cardsArray, setCardsArray] = useState<any>([]);
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

  const ondrop = (cards: []) => {
    /* Need to write a logic where same card should not be added
      Need to filter accorrding to column type like which card should be display where
      filtered card display accoriding to their column 

      need to find column id as well so we can expand column width at a moment

      Need to set item move to any place
    */

    setCardsArray([...cardsArray, cards]);
  };

  const onCloseHandler = () => {
    const element = document.getElementById('left-frame');
    if (element != null) {
      element.style.display = 'none';
    }
  };

  return (
    <Layout className={styles.centralPannel}>
      <Header />
      <Layout style={{ display: 'flex', flexDirection: 'row' }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <LeftPanel onCloseHandler={() => onCloseHandler} />
        </Sider>
        <Layout
          className="site-layout"
          style={{
            marginLeft: !collapsed ? '397px' : '0px',
          }}
        >
          <div>
            {collapsed ? (
              <FontAwesomeIcon
                icon={faAngleDoubleRight}
                onClick={() => setCollapsed(!collapsed)}
              />
            ) : (
              <FontAwesomeIcon
                icon={faAngleDoubleLeft}
                onClick={() => setCollapsed(!collapsed)}
              />
            )}
          </div>
          <Content className="site-layout-background">
            <div style={{ display: 'flex' }}>
              {columns.map((column: any) => (
                <div
                  key={column.title}
                  style={{
                    backgroundColor: `${column.color}`,
                    textAlign: 'center',
                  }}
                >
                  <span style={{ color: '#000000' }}>{column.title}</span>
                  <div style={{ display: 'flex' }}>
                    {column.children.map((child: any) => (
                      <DropWrapper
                        onDrop={ondrop}
                        key={child.title}
                        column={child.title}
                      >
                        <div
                          key={child.title}
                          style={{
                            backgroundColor: `${
                              child.id % 2 !== 0 ? '#ffffff' : '#f0f0f0'
                            }`,
                            textAlign: 'center',
                            height: '100vh',
                            width: '750px',
                          }}
                        >
                          <div
                            style={{
                              // display: 'flex',
                              // flexDirection: 'column',
                              // justifyContent: 'center',
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
                            {cardsArray.map((item: any) => (
                              <MultiCard
                                key={item.id}
                                data={{
                                  semester: child.title,
                                  level: item.level,
                                  credits: item.credits,
                                  draggable: true,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </DropWrapper>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Columns;
