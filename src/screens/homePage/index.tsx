import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import React, { useEffect, useRef, useState } from 'react';
import { ArcherContainer, ArcherElement } from 'react-archer';
import { useDispatch, useSelector } from 'react-redux';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import DropWrapper from '../../components/dropWrapper';
import Header from '../../components/header';
import LeftPanel from '../../components/leftPanel';
import MultiCard from '../../components/multiCards';
import RightPanel from '../../components/rightPanel';
import { updateMappedDataRequest } from '../../states/actions';
// import AddPathwayForm from '../addPathwayForm';

import Styles from './index.module.scss';

interface Props {
  isLeftPanelVisible: boolean;
  setIsEditPathwayFormVisible: (a: boolean) => void;
}
const HomePage: React.FC<Props> = ({
  isLeftPanelVisible,
  setIsEditPathwayFormVisible,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [pathwayComponentCards, setPathwayComponentCards] = useState<any>([]);
  const [deletedComponentCards, setDeletedComponentCards] = useState<any>([]);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [isZoomDisabled, setIsZoomDisabled] = useState(false);
  // const [isEditPathwayFormVisible, setIsEditPathwayFormVisible] =
  //   useState<boolean>(false);
  const [columnsData, setColumnsData] = useState<any>([]);
  const pathwayWrapper = useSelector((state: any) => state.initalReducer);
  const { mappedData: pathwayComponent } = pathwayWrapper;

  const dispatch = useDispatch();

  useEffect(() => {
    const updatedPathwayWrapper = { ...pathwayComponent };
    updatedPathwayWrapper.PathwayComponents = pathwayComponentCards;
    updatedPathwayWrapper.DeletedComponents = deletedComponentCards;
    if (updatedPathwayWrapper.PathwayComponents?.length > 1) {
      for (let i = 1; i < updatedPathwayWrapper.PathwayComponents.length; i++) {
        if (
          !updatedPathwayWrapper.PathwayComponents[0]?.HasChild?.includes(
            updatedPathwayWrapper.PathwayComponents[0 + i].CTID
          )
        )
          updatedPathwayWrapper.PathwayComponents[0]?.HasChild.push(
            updatedPathwayWrapper.PathwayComponents[0 + i].CTID
          );
      }
    }
    dispatch(updateMappedDataRequest(updatedPathwayWrapper));
    setDeletedComponentCards([]);
  }, [pathwayComponentCards]);

  useEffect(() => {
    if (pathwayComponent) {
      if (pathwayComponent?.Pathway?.HasProgressionModel?.length > 0) {
        const tempData = [] as any;
        pathwayComponent?.ProgressionLevels?.forEach((item: any) => {
          tempData.push({
            ...item,
            semesters: [
              { id: 1, name: 'Semester 1' },
              { id: 2, name: 'Semester 2' },
            ],
          });
        });
        setColumnsData([
          ...tempData,
          {
            destinationComponent: true,
            Id: '0101',
            Name: 'Destination Component',
            semesters: [{ id: 1, name: '' }],
          },
        ]);
      } else {
        setColumnsData([
          { id: 0, name: '' },
          { id: 1, name: 'Destination Component' },
        ]);
      }
    }
  }, [pathwayComponent]);

  const columnRef = useRef<any>([]);

  columnRef.current =
    columnsData &&
    columnsData?.map((column: any) =>
      column?.semesters?.map(
        (element: any, i: any) => (columnRef.current[i] = React.createRef())
      )
    );

  const onDropHandler = (
    card: any,
    CTID: string,
    destinationColumn: boolean,
    HasProgressionLevel: string,
    inProgressLevel: string
  ) => {
    /* Need to write a logic where same card should not be added
      Need to filter accorrding to column type like which card should be display where
      filtered card display accoriding to their column 

      need to find column id as well so we can expand column width at a moment

      Need to set item move to any place
    */
    if (card.inProgressLevel === inProgressLevel) {
      return;
    }

    pathwayComponentCards.length === 0
      ? setPathwayComponentCards([
          ...pathwayComponentCards,
          { ...card, destinationColumn, HasProgressionLevel, inProgressLevel },
        ])
      : setPathwayComponentCards(
          pathwayComponentCards
            .filter((item: any) => item.CTID !== card.CTID)
            .concat({ ...card, inProgressLevel, HasProgressionLevel })
        );
  };

  const onCloseHandler = () => {
    const element = document.getElementById('left-frame');
    if (element != null) {
      element.style.display = 'none';
    }
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
                  style={{ position: 'fixed' }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faAngleDoubleLeft}
                  onClick={() => setCollapsed(!collapsed)}
                  style={{ position: 'fixed' }}
                />
              )}
            </div>

            <Content className="site-layout-background">
              <TransformWrapper disabled={isZoomDisabled}>
                <TransformComponent>
                  <div style={{ display: 'flex' }}>
                    {columnsData &&
                      columnsData?.map((column: any, index: any) => (
                        <div
                          key="column.id"
                          style={{
                            backgroundColor: `${
                              index % 2 !== 0 ? '#4EE5E1' : '#f0f0f0'
                            }`,
                            textAlign: 'center',
                          }}
                        >
                          <span style={{ color: '#000000' }}>
                            {column.Name}
                          </span>
                          <div style={{ display: 'flex' }}>
                            {column?.semesters?.map((child: any, i: any) => (
                              <DropWrapper
                                id={`${column.Id} ${child.name}`}
                                onDrop={onDropHandler}
                                key={child.id}
                                column={child.name}
                                inProgressLevel={`${column.CTID} ${child?.name}`}
                                HasProgressionLevel={column.CTID}
                                destinationColumn={
                                  !!column?.destinationComponent
                                }
                                forwardRef={columnRef.current[i]}
                                width="450px"
                              >
                                <div
                                  key={child.title}
                                  className={Styles.container}
                                  style={{
                                    backgroundColor: `${
                                      i % 2 !== 0 ? '#ffffff' : '#f0f0f0'
                                    }`,
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
                                            ? '#D3F8F7'
                                            : '#6EFFFF'
                                        }`,
                                      }}
                                    >
                                      {child.name}
                                    </span>
                                    <ArcherContainer strokeColor="red">
                                      {pathwayComponentCards.length > 0 ? (
                                        pathwayComponentCards
                                          .filter(
                                            (card: any) =>
                                              card?.inProgressLevel ==
                                                `${column?.CTID} ${child?.name}` &&
                                              card.HasProgressionLevel ===
                                                column.CTID
                                          )
                                          .map((item: any) => {
                                            const relations = [] as any;
                                            if (
                                              column?.destinationComponent &&
                                              item?.HasChild?.length > 0
                                            ) {
                                              item?.HasChild?.forEach(
                                                (item: any) =>
                                                  relations.push({
                                                    targetId: item,
                                                    targetAnchor: 'left',
                                                    sourceAnchor: 'right',
                                                    style: {
                                                      strokeColor: 'blue',
                                                      strokeWidth: 1,
                                                    },
                                                  })
                                              );
                                            }
                                            return (
                                              <ArcherElement
                                                id={
                                                  column?.destinationComponent
                                                    ? item?.CTID
                                                    : ''
                                                }
                                                key={item?.CTID}
                                                relations={
                                                  column?.destinationComponent
                                                    ? relations
                                                    : []
                                                }
                                              >
                                                <>
                                                  <MultiCard
                                                    onClick={() =>
                                                      setShowRightPanel(true)
                                                    }
                                                    key={item.id}
                                                    id={item.CTID}
                                                    isCredentialCard={
                                                      column?.destinationComponent ||
                                                      item.Type?.toLowerCase().includes(
                                                        'credential'.toLowerCase()
                                                      )
                                                    }
                                                    isCourseCard={item.Type?.toLowerCase().includes(
                                                      'basic'.toLowerCase()
                                                    )}
                                                    isConditionalCard={item.Type?.toLowerCase().includes(
                                                      'condition'.toLowerCase()
                                                    )}
                                                    isDestination={item.Type?.toLowerCase().includes(
                                                      'destination'.toLowerCase()
                                                    )}
                                                    data={item}
                                                    setIsZoomDisabled={
                                                      setIsZoomDisabled
                                                    }
                                                    status={column.Id}
                                                    inProgressLevel={`${column.CTID} ${child?.name}`}
                                                  />
                                                </>
                                              </ArcherElement>
                                            );
                                          })
                                      ) : (
                                        <>
                                          <MultiCard
                                            onClick={() =>
                                              setShowRightPanel(true)
                                            }
                                            key={0}
                                            id={0}
                                            isAddDestination={
                                              column?.destinationComponent
                                                ? true
                                                : false
                                            }
                                            data={{ Type: 'addDestination' }}
                                            destinationComponent={
                                              column?.destinationComponent
                                            }
                                            setIsZoomDisabled={
                                              setIsZoomDisabled
                                            }
                                            status={column.Id}
                                            inProgressLevel={`${column.CTID} ${child?.name}`}
                                          />
                                        </>
                                      )}
                                    </ArcherContainer>
                                  </div>
                                </div>
                              </DropWrapper>
                            ))}
                          </div>
                        </div>
                      ))}
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
      {/* <Modal
        visible={isEditPathwayFormVisible}
        onOk={onEditPathwayOkHandler}
        onCancel={onEditPathwayCancelHandler}
        title="Add a Pathway"
      >
        <AddPathwayForm />
      </Modal> */}
    </Layout>
  );
};

export default HomePage;
