import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import React, { useRef, useState } from 'react';
// import { useSelector } from 'react-redux';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import DropWrapper from '../../components/dropWrapper';
import Header from '../../components/header';
import LeftPanel from '../../components/leftPanel';
import Modal from '../../components/modal';
import MultiCard from '../../components/multiCards';
import RightPanel from '../../components/rightPanel';
import AddPathwayForm from '../addPathwayForm';

import Styles from './index.module.scss';

interface Props {
  isLeftPanelVisible: boolean;
}
const HomePage: React.FC<Props> = ({ isLeftPanelVisible }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [cardsArray, setCardsArray] = useState<any>([]);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [isZoomDisabled, setIsZoomDisabled] = useState(false);
  const [isEditPathwayFormVisible, setIsEditPathwayFormVisible] =
    useState<boolean>(false);
  // const result = useSelector((state: any) => state.app);
  // const {
  //   pathwayComponentData: { data: componentsData },
  // } = result;

  const columnRef = useRef<any>([]);

  const columns = [
    {
      id: '12436789',
      rowId: 298932,
      name: 'Stage 1',
      description: 'Description Stage 1',
      cTID: 'ABCD',
      color: '#83edea',
      children: [
        {
          id: 1,
          rowId: 237,
          name: 'Semester 1',
          description: 'Description Semster 1',
          codedNotation: '6763827',
          CTID: 'ab13288',
        },
        {
          id: 2,
          rowId: 237737,
          name: 'Semester 2',
          description: 'Description Semster 2',
          codedNotation: '6763827',
          color: '#adf1ef',
          CTID: 'ab1',
        },
      ],
    },
    {
      id: '1243df6789',
      rowId: 29893232,
      name: 'Stage 2',
      description: 'Description Stage 1',
      cTID: 'ABCD',
      color: '#83edea',
      children: [
        {
          id: 1,
          rowId: 237,
          name: 'Semester 1',
          description: 'Description Semster 1',
          codedNotation: '623483827',
          CTID: 'ab12',
        },
        {
          id: 2,
          rowId: 237737,
          name: 'Semester 2',
          description: 'Description Semster 2',
          codedNotation: '623483827',
          color: '#adf1ef',
          CTID: 'ab123',
        },
      ],
    },
    {
      id: '12436343789',
      rowId: 29893432,
      name: 'Stage 3',
      description: 'Description Stage 1',
      cTID: 'ABCD',
      color: '#83edea',
      children: [
        {
          id: 1,
          rowId: 237,
          name: 'Semester 1',
          description: 'Description Semster 1',
          codedNotation: '6763898927',
          CTID: 'abcd123728',
        },
        {
          id: 2,
          rowId: 237737,
          name: 'Semester 2',
          description: 'Description Semster 2',
          codedNotation: '6763898927',
          color: '#adf1ef',
          CTID: 'abcd23728',
        },
      ],
    },
    {
      id: '124332326789',
      rowId: 298932,
      name: 'Stage 4',
      description: 'Description Stage 1',
      cTID: 'ABCD',
      color: '#83edea',
      children: [
        {
          id: 1,
          rowId: 237,
          name: 'Semester 1',
          description: 'Description Semster 1',
          codedNotation: '6761113827',
          CTID: 'abc2378',
        },
        {
          id: 2,
          rowId: 237737,
          name: 'Semester 2',
          description: 'Description Semster 2',
          codedNotation: '6761113827',
          color: '#adf1ef',
          CTID: 'abcd2378',
        },
      ],
    },
  ];

  columnRef.current = columns.map((column: any) =>
    column.children.map(
      (element: any, i: any) => (columnRef.current[i] = React.createRef())
    )
  );
  const onDropHandler = (card: any, status: string, CTID: string) => {
    /* Need to write a logic where same card should not be added
      Need to filter accorrding to column type like which card should be display where
      filtered card display accoriding to their column 

      need to find column id as well so we can expand column width at a moment

      Need to set item move to any place
    */
    if (card.CTID === CTID) {
      return;
    }

    cardsArray.length === 0
      ? setCardsArray([...cardsArray, { ...card, status, CTID }])
      : setCardsArray(
          cardsArray
            .filter((item: any) => item.id !== card.id)
            .concat({ ...card, status, CTID })
        );
  };

  const onCloseHandler = () => {
    const element = document.getElementById('left-frame');
    if (element != null) {
      element.style.display = 'none';
    }
  };

  const onEditPathwayOkHandler = () => {
    setIsEditPathwayFormVisible(false);
  };

  const onEditPathwayCancelHandler = () => {
    setIsEditPathwayFormVisible(false);
  };

  return (
    <Layout className={Styles.centralPannel}>
      <Header setIsEditPathwayFormVisible={setIsEditPathwayFormVisible} />
      {!!isLeftPanelVisible && (
        <Layout style={{ display: 'flex', flexDirection: 'row' }}>
          <Sider trigger={null} collapsible collapsed={collapsed}>
            <LeftPanel onCloseHandler={() => onCloseHandler} />
          </Sider>
          <Layout
            className="site-layout"
            style={{
              marginLeft: !collapsed ? '277px' : '0px',
            }}
          >
            <div className={Styles.leftPanelTrigger}>
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
              <TransformWrapper disabled={isZoomDisabled}>
                <TransformComponent>
                  <div style={{ display: 'flex' }}>
                    {columns.map((column: any) => (
                      <div
                        key={column.id}
                        style={{
                          backgroundColor: `${column?.color}`,
                          textAlign: 'center',
                        }}
                      >
                        <span style={{ color: '#000000' }}>{column.name}</span>
                        <div style={{ display: 'flex' }}>
                          {column?.children?.map((child: any, i: any) => (
                            <DropWrapper
                              id={`${column.title} ${child.title}`}
                              onDrop={onDropHandler}
                              status={child.codedNotation}
                              key={child.id}
                              column={child.name}
                              CTID={child.CTID}
                              forwardRef={columnRef.current[i]}
                              width="450px"
                            >
                              <div
                                key={child.title}
                                style={{
                                  backgroundColor: `${
                                    child.id % 2 !== 0 ? '#ffffff' : '#f0f0f0'
                                  }`,
                                  textAlign: 'center',
                                  minHeight: '100vh',
                                  height: 'auto',
                                }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: '150px',
                                  }}
                                >
                                  <span
                                    style={{
                                      width: '100%',
                                      backgroundColor: `${
                                        child.id % 2 === 0
                                          ? child.color
                                          : '#aeaeae'
                                      }`,
                                    }}
                                  >
                                    {child.name}
                                  </span>
                                  {cardsArray
                                    .filter(
                                      (card: any) =>
                                        card?.status?.toLowerCase().trim() ===
                                          child.codedNotation
                                            .toLowerCase()
                                            .trim() &&
                                        card?.CTID?.toLowerCase().trim() ===
                                          child.CTID.toLowerCase().trim()
                                    )
                                    .map((item: any) => (
                                      <MultiCard
                                        onClick={() => setShowRightPanel(true)}
                                        key={item.id}
                                        id={item.id}
                                        isCourseCard={item.type === 'course'}
                                        isCredentialCard={
                                          item.type === 'credentials'
                                        }
                                        data={{
                                          semester: child.title,
                                          level: item.level,
                                          name: item.name,
                                          description: item.description,
                                          credits: item.credits,
                                          draggable: true,
                                          IconName: item.IconName,
                                          IconColor: item.IconColor,
                                          type: item.type,
                                          id: item.id,
                                        }}
                                        setIsZoomDisabled={setIsZoomDisabled}
                                        status={child.codedNotation}
                                        CTID={child.CTID}
                                      />
                                    ))}
                                </div>
                              </div>
                            </DropWrapper>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div>
                      <DropWrapper
                        id={10000000}
                        onDrop={onDropHandler}
                        status="child.codedNotation"
                        key="child.id"
                        column="child.name"
                        CTID="child.CTID"
                        forwardRef={columnRef.current[1]}
                        width="450px"
                      >
                        <MultiCard
                          data={{ type: 'credentials' }}
                          isCredentialCard={true}
                          setIsZoomDisabled={setIsZoomDisabled}
                        />
                      </DropWrapper>
                    </div>
                  </div>
                </TransformComponent>
              </TransformWrapper>
            </Content>
          </Layout>
        </Layout>
      )}
      {showRightPanel && (
        <RightPanel
          visible={showRightPanel}
          onCloseHandler={(value: boolean) => setShowRightPanel(value)}
        />
      )}
      <Modal
        visible={isEditPathwayFormVisible}
        onOk={onEditPathwayOkHandler}
        onCancel={onEditPathwayCancelHandler}
        title="Add a Pathway"
      >
        <AddPathwayForm />
      </Modal>
    </Layout>
  );
};

export default HomePage;
