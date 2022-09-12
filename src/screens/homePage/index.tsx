import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import React, { useEffect, useState } from 'react';
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
  isDestinationColumnSelected: boolean;
}
const HomePage: React.FC<Props> = ({
  isLeftPanelVisible,
  setIsEditPathwayFormVisible,
  isDestinationColumnSelected,
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
  const [rightPanelData, setRightPanelData] = useState({});
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

  const getSemester = (level: any) => {
    if (level?.Narrower?.length > 0) {
      const semesters = [] as any;

      level?.Narrower?.forEach((narrow: any) => {
        pathwayComponent?.ProgressionLevels.forEach((level1: any) => {
          if (narrow === level1.CTID) {
            let result = [] as any;
            if (level1?.Narrower?.length > 0) {
              result = getSemester(level1);
              semesters.push({
                ...level1,
                semesters: result?.length > 0 && narrow !== null ? result : [],
              });
            } else {
              semesters.push(level1);
            }
          }
        });
      });

      return semesters;
    }
  };

  useEffect(() => {
    if (pathwayComponent) {
      const pathwayModel =
        pathwayComponent?.Pathway?.HasProgressionModel?.length > 0;
      if (pathwayModel) {
        const updatedPathwayLevel = [] as any;
        const updatedPathwayLevel2 = [] as any;

        const level2ProgressionModel = [];

        pathwayComponent?.ProgressionModels?.map((model: any) =>
          model?.HasTopConcept?.forEach((CTID: any) => {
            pathwayComponent?.ProgressionLevels?.forEach((level: any) => {
              if (CTID === level.CTID) {
                return updatedPathwayLevel.push(level);
              } else {
                level2ProgressionModel.push(level);
              }
            });
          })
        );

        const levelLength = updatedPathwayLevel?.length;

        updatedPathwayLevel.forEach((upd_level: any, index: any) => {
          let semesters = [] as any;
          if (upd_level?.Narrower?.length > 0) {
            const result = getSemester(upd_level);
            semesters = result;
          }

          if (levelLength - 1 === index) {
            const updatedSem = semesters?.map((sem: any, i: any) =>
              semesters.length - 1 === i
                ? {
                    ...sem,
                    id: 'destinationColumn',
                    isDestinationColumnSelected,
                  }
                : sem
            );
            updatedPathwayLevel2.push({
              ...upd_level,
              Name: 'Destination Column',
              id: 'destinationColumn',
              isDestinationColumnSelected,
              semesters: updatedSem,
            });
          } else if (index === 0) {
            const updatedSem = semesters?.map((sem: any, i: any) =>
              0 === i ? { ...sem, id: 'firstColumn' } : sem
            );
            updatedPathwayLevel2.push({
              ...upd_level,
              id: 'firstColumn',
              semesters: updatedSem,
            });
          } else {
            updatedPathwayLevel2.push({
              ...upd_level,
              id: index,
              semesters,
            });
          }
        });

        setColumnsData(updatedPathwayLevel2);
      } else {
        setColumnsData([
          { id: 0, name: 'Stage 1' },
          { id: 1, name: 'Destination Component' },
        ]);
      }
    }
  }, [pathwayComponent, isDestinationColumnSelected]);

  const onDropHandler = (
    card: any,
    isComponentTabCards: string,
    destinationColumn: boolean,
    HasProgressionLevel: string
  ) => {
    /* Need to write a logic where same card should not be added
      Need to filter accorrding to column type like which card should be display where
      filtered card display accoriding to their column 

      need to find column id as well so we can expand column width at a moment

      Need to set item move to any place
    */
    if (card.HasProgressionLevel === HasProgressionLevel) {
      return;
    }

    pathwayComponentCards.length === 0
      ? setPathwayComponentCards([
          ...pathwayComponentCards,
          { ...card, destinationColumn, HasProgressionLevel },
        ])
      : setPathwayComponentCards(
          pathwayComponentCards
            .filter((item: any) => item.CTID !== card.CTID)
            .concat({ ...card, HasProgressionLevel })
        );
  };

  const onCloseHandler = () => {
    const element = document.getElementById('left-frame');
    if (element != null) {
      element.style.display = 'none';
    }
  };
  const getDropWrapperLayout = (column: any, index: any = 0) => {
    if (!column.semesters || !column.semesters.length) {
      return (
        <div key={index} style={{ display: 'flex' }}>
          <DropWrapper
            id={`${column.id}`}
            onDrop={onDropHandler}
            key={column.Id}
            index={index}
            column={column.Name}
            HasProgressionLevel={column.CTID}
            destinationColumn={!!column?.destinationComponent}
            width="450px"
          >
            <div
              style={{
                height: '100vh',
                backgroundColor: `${index % 2 !== 0 ? '#f0f0f0' : '#ffffff'}`,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <>
                <ArcherContainer strokeColor="red">
                  {pathwayComponentCards.length > 0 ? (
                    pathwayComponentCards
                      .filter(
                        (card: any) => card.HasProgressionLevel === column.CTID
                      )
                      .map((item: any) => {
                        const relations = [] as any;
                        if (
                          column?.isDestinationColumnSelected &&
                          item?.HasChild?.length > 0
                        ) {
                          item?.HasChild?.forEach((child_item: any) =>
                            relations.push({
                              targetId: child_item,
                              targetAnchor: 'bottom',
                              sourceAnchor: 'top',
                              style: {
                                strokeColor: 'blue',
                                strokeWidth: 1,
                              },
                            })
                          );
                        }

                        return (
                          <ArcherElement
                            id={item?.CTID}
                            key={item?.CTID}
                            relations={
                              column?.isDestinationColumnSelected
                                ? relations
                                : []
                            }
                          >
                            <MultiCard
                              onClick={() => {
                                setRightPanelData(item);
                                setShowRightPanel(true);
                              }}
                              key={item.id}
                              id={item.CTID}
                              isCredentialCard={item.Type.toLowerCase().includes(
                                'credential'.toLowerCase()
                              )}
                              isCourseCard={
                                item.Type.toLowerCase().includes(
                                  'basic'.toLowerCase()
                                ) ||
                                item.Type.toLowerCase().includes(
                                  'AssessmentComponent'.toLowerCase()
                                )
                              }
                              isConditionalCard={item.Type.toLowerCase().includes(
                                'condition'.toLowerCase()
                              )}
                              isDestination={item.Type.toLowerCase().includes(
                                'destination'.toLowerCase()
                              )}
                              data={item}
                              setIsZoomDisabled={setIsZoomDisabled}
                              status={column.Id}
                              inProgressLevel={column.CTID}
                            />
                          </ArcherElement>
                        );
                      })
                  ) : (
                    <MultiCard
                      onClick={() => setShowRightPanel(true)}
                      key={0}
                      id={0}
                      isAddDestination={
                        column?.isDestinationColumnSelected ? true : false
                      }
                      data={{ Type: 'addDestination' }}
                      destinationComponent={column?.isDestinationColumnSelected}
                      setIsZoomDisabled={setIsZoomDisabled}
                      status={column.Id}
                      inProgressLevel={column.CTID}
                    />
                  )}
                </ArcherContainer>
              </>
            </div>
          </DropWrapper>
        </div>
      );
    }

    return (
      <div
        style={{
          display: 'flex',
        }}
      >
        {!!column.semesters &&
          column.semesters.map((semester: any, index: any) => (
            <>
              <div>
                <div
                  style={{
                    backgroundColor: `${
                      index % 2 !== 0 ? '#d3f8f7' : '#6effff'
                    }`,
                  }}
                >
                  <span
                    style={{
                      color: '#000000',
                      backgroundColor: `${
                        index % 2 !== 0 ? '#d3f8f7' : '#6effff'
                      }`,
                    }}
                  >
                    {semester.Description}
                  </span>
                </div>
                {semester && getDropWrapperLayout(semester, index)}
              </div>
            </>
          ))}
      </div>
    );
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
                          id={column.Id}
                          key={column.id}
                          style={{
                            textAlign: 'center',
                            width: 'auto',
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: `${
                                index % 2 === 0 ? '#f0f0f0' : '#4EE5E1'
                              }`,
                            }}
                          >
                            <span
                              style={{
                                color: '#000000',
                                backgroundColor: `${
                                  index % 2 === 0 ? '#f0f0f0' : '#4EE5E1'
                                }`,
                              }}
                            >
                              {column.Name}
                            </span>
                          </div>
                          <div style={{ display: 'flex' }}>
                            {getDropWrapperLayout(column, index)}
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
          panelData={rightPanelData}
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
