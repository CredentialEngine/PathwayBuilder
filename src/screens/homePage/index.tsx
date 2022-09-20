import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Xarrow, { Xwrapper } from 'react-xarrows';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { v4 as uuidv4 } from 'uuid';

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

  const [showAddDestination, setShowAddDestination] = useState(false);
  const [isDraggableCardVisible, setDraggableCardVisible] = useState(false);
  const [columnsData, setColumnsData] = useState<any>([]);
  const pathwayWrapper = useSelector((state: any) => state.initalReducer);
  const [rightPanelData, setRightPanelData] = useState({});
  const [dragElem, setDragElem] = useState<any>();
  const [leftpanelSelectedElem, setLeftpanelSelectedElem] =
    useState<HTMLElement>();

  const [point, setPoint] = useState({
    start: '',
    end: '',
  });
  const [connection, setConnection] = useState<any>([]);
  const [constraintIcon, setConstraintIcon] = useState<boolean>(false);

  const { mappedData: pathwayComponent } = pathwayWrapper;
  const [generatedUuid, setGeneratedUuid] = useState<any>({
    destinationCTID: '',
    firstStageCTID: '',
  });

  const wrapperRef = useRef<Array<HTMLDivElement | null>>([]);
  useEffect(() => {
    setGeneratedUuid({
      ...generatedUuid,
      destinationCTID: uuidv4(),
      firstStageCTID: uuidv4(),
    });
  }, []);

  let count = 0;

  const dispatch = useDispatch();
  useEffect(() => {
    const updatedPathwayWrapper = { ...pathwayComponent };
    updatedPathwayWrapper.PathwayComponents = pathwayComponentCards;
    updatedPathwayWrapper.DeletedComponents = deletedComponentCards;
    if (updatedPathwayWrapper.PathwayComponents?.length > 1) {
      for (let i = 1; i < updatedPathwayWrapper.PathwayComponents.length; i++) {
        if (
          !updatedPathwayWrapper.PathwayComponents[0]?.HasChild?.includes(
            updatedPathwayWrapper.PathwayComponents[0 + i]?.CTID
          )
        )
          updatedPathwayWrapper.PathwayComponents[0]?.HasChild.push(
            updatedPathwayWrapper.PathwayComponents[0 + i].CTID
          );
      }
    }
    dispatch(updateMappedDataRequest(updatedPathwayWrapper));
    setDeletedComponentCards([]);
    pathwayComponentCards?.some(
      (item: any) =>
        item?.isDestinationColumnSelected && setShowAddDestination(true)
    );
  }, [pathwayComponentCards]);

  const getSemester = (level: any) => {
    if (level?.Narrower?.length > 0) {
      const semesters = [] as any;
      level?.Narrower?.forEach((narrow: any) => {
        count = Math.floor(Math.random() * (99 - 10) + 10);
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
              semesters.push({ ...level1, number: count });
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

      let count = 0;
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

        updatedPathwayLevel
          .map((level: any) => {
            count++;
            return { ...level, number: count };
          })
          .forEach((upd_level: any, index: any) => {
            let semesters = [] as any;
            if (upd_level?.Narrower?.length > 0) {
              const result = getSemester(upd_level);
              semesters = result;
            }
            if (index === 0) {
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

        setColumnsData([
          ...updatedPathwayLevel2,
          {
            isDestinationColumnSelected,
            id: 'destinationColumn',
            CTID: generatedUuid.destinationCTID,
            Name: 'Destination Component',
            Narrower: null,
          },
        ]);
      } else {
        setColumnsData([
          { Id: 0, Name: 'Stage 1', CTID: generatedUuid.firstStageCTID },
          {
            isDestinationColumnSelected,
            Id: 1,
            id: 'destinationColumn',
            Name: 'Destination Component',
            Narrower: null,
            CTID: generatedUuid.destinationCTID,
          },
        ]);
      }
    }
  }, [pathwayComponent, isDestinationColumnSelected]);

  const onSelectDragElemenet = (elem: HTMLElement) => {
    setDragElem(elem);
  };

  const onMoveItem = (elem: any) => {
    if (!_.isNull(dragElem) && !_.isUndefined(dragElem)) {
      setPathwayComponentCards((prevState: any) => {
        const itemIndex = prevState.findIndex(
          (i: any) => i?.CTID === dragElem?.CTID
        );

        const hoverIndex = prevState.findIndex((i: any) =>
          i?.Description?.toLowerCase()
            .trim()
            .includes(elem?.toLowerCase().trim())
        );
        const newState = [...prevState];
        newState.splice(itemIndex, 1);
        newState.splice(hoverIndex, 0, dragElem);

        return [...newState];
      });
    }
  };

  const onDropHandler = (
    card: any,
    isComponentTabCards: string,
    destinationColumn: boolean,
    HasProgressionLevel: string,
    isDestinationColumnSelected: boolean
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
    if (isDestinationColumnSelected) {
      const updatedPathwayWrapper = { ...pathwayComponent };
      const updatedPathwayComponent = { ...updatedPathwayWrapper.Pathway };
      updatedPathwayComponent.HasDestinationComponent = card.CTID;
      updatedPathwayWrapper.Pathway = updatedPathwayComponent;
      dispatch(updateMappedDataRequest(updatedPathwayWrapper));
    }

    pathwayComponentCards.length === 0
      ? setPathwayComponentCards([
          ...pathwayComponentCards,
          {
            ...card,
            destinationColumn,
            HasProgressionLevel,
            isDestinationColumnSelected: isDestinationColumnSelected
              ? true
              : false,
          },
        ])
      : setPathwayComponentCards(
          pathwayComponentCards
            .filter((item: any) => item.CTID !== card.CTID)
            .concat({
              ...card,
              HasProgressionLevel,
              isDestinationColumnSelected: isDestinationColumnSelected
                ? true
                : false,
            })
        );
  };

  const onCloseHandler = () => {
    const element = document.getElementById('left-frame');
    if (element != null) {
      element.style.display = 'none';
    }
  };

  const setEndpoints = (e: any, id: any) => {
    e.stopPropagation();
    if (point.start && point.start !== id) {
      setPoint({
        ...point,
        end: id,
      });
      e?.target?.classList?.add('active');
      setConnection([
        ...connection,
        {
          start: point.start,
          end: id,
        },
      ]);
      setConstraintIcon(true);
    } else {
      setPoint({
        ...point,
        start: id,
        end: point?.end,
      });
      e?.target?.classList?.add('active');
    }
  };

  useEffect(() => {
    if (point && point?.start?.length > 0 && point?.end?.length > 0) {
      setPoint({
        start: '',
        end: '',
      });
    }
  }, [point]);

  const removeConnection = (item: any) => {
    const newarray = connection;
    const index = newarray.findIndex((items: any) => items === item);
    newarray.splice(index, 1);
    setConnection([...newarray]);
    document.getElementById(item?.start)?.classList?.remove('active');
    document.getElementById(item?.end)?.classList?.remove('active');
    setConstraintIcon(false);
  };

  const getDropWrapperLayout = (column: any, index: any = 0) => {
    if (!column.semesters || !column.semesters.length) {
      return (
        <div key={index} style={{ display: 'flex' }}>
          <DropWrapper
            id={column.id}
            onDrop={onDropHandler}
            key={column.Id}
            index={index}
            column={column.Name}
            number={column.number}
            forwardRef={wrapperRef}
            HasProgressionLevel={column.CTID}
            isDestinationColumnSelected={column?.isDestinationColumnSelected}
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
                position: 'relative',
              }}
            >
              <Xwrapper>
                {pathwayComponentCards.length > 0 &&
                  pathwayComponentCards
                    .filter(
                      (card: any) => card.HasProgressionLevel === column.CTID
                    )
                    .map((item: any) => (
                      <MultiCard
                        isDraggableCardVisible={isDraggableCardVisible}
                        constraintIcon={constraintIcon}
                        number={column.number}
                        forwardRef={wrapperRef}
                        onClick={() => {
                          setRightPanelData(item);
                          setShowRightPanel(true);
                        }}
                        getEndPoints={setEndpoints}
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
                        isDestination={
                          item?.isDestinationColumnSelected ||
                          item.Type.toLowerCase().includes(
                            'destination'.toLowerCase()
                          )
                        }
                        data={item}
                        setIsZoomDisabled={setIsZoomDisabled}
                        status={column.Id}
                        inProgressLevel={column.CTID}
                        leftpanelSelectedElem={leftpanelSelectedElem}
                        onSelectDragElemenet={onSelectDragElemenet}
                        onMoveItem={onMoveItem}
                      />
                    ))}
                {!showAddDestination && (
                  <MultiCard
                    onClick={() => setShowRightPanel(true)}
                    key={0}
                    id={0}
                    isAddDestination={
                      column?.isDestinationColumnSelected ? true : false
                    }
                    getEndPoints={setEndpoints}
                    data={{ Type: 'addDestination' }}
                    destinationComponent={column?.isDestinationColumnSelected}
                    setIsZoomDisabled={setIsZoomDisabled}
                    status={column.Id}
                    inProgressLevel={column.CTID}
                    onSelectDragElemenet={onSelectDragElemenet}
                    onMoveItem={onMoveItem}
                    number={column.number}
                    forwardRef={wrapperRef}
                    leftpanelSelectedElem={leftpanelSelectedElem}
                  />
                )}
                {showAddDestination &&
                  column?.CTID === getLastColumn() &&
                  pathwayComponentCards?.length <= 1 && (
                    <MultiCard
                      onClick={() => setShowRightPanel(true)}
                      key={0}
                      id={0}
                      firstComponent={
                        column?.CTID === getLastColumn() ? true : false
                      }
                      getEndPoints={setEndpoints}
                      isAddFirst={
                        column?.CTID === getLastColumn() ? true : false
                      }
                      data={{ Type: 'addDestination' }}
                      destinationComponent={column?.isDestinationColumnSelected}
                      setIsZoomDisabled={setIsZoomDisabled}
                      status={column.Id}
                      inProgressLevel={column.CTID}
                      onSelectDragElemenet={onSelectDragElemenet}
                      onMoveItem={onMoveItem}
                      number={column.number}
                      forwardRef={wrapperRef}
                      leftpanelSelectedElem={leftpanelSelectedElem}
                    />
                  )}
                {connection.length
                  ? connection.map((items: any, idx: number) => (
                      <Xarrow
                        path="grid"
                        strokeWidth={1}
                        zIndex={1000}
                        headSize={16}
                        color="black"
                        start={items?.start}
                        end={items?.end}
                        key={idx}
                        labels={
                          <span className={Styles.addConditionIcon}>
                            <FontAwesomeIcon
                              icon={faXmarkCircle}
                              style={{ cursor: 'pointer' }}
                              onClick={() => removeConnection(items)}
                            />
                          </span>
                        }
                        startAnchor="auto"
                        endAnchor="auto"
                        // gridBreak="20%"
                      />
                    ))
                  : ''}
              </Xwrapper>
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

  const getLastColumn = () => {
    const ids = [] as any;
    columnsData?.map((column: any) => {
      if (!column.semesters || !column.semesters.length) {
        ids?.push(column?.CTID);
      } else {
        ids.push(...renderSemester(column?.semesters));
      }
    });
    return ids[ids?.length - 2];
  };
  const renderSemester = (semesters: any) => {
    const ids = [] as any;
    if (!semesters || !semesters.length) {
      return null;
    }
    semesters.map((sem: any) => {
      ids?.push(sem?.CTID);
      sem?.semesters && renderSemester(sem?.semesters);
    });
    return ids;
  };

  return (
    <Layout className={Styles.centralPannel}>
      <Header setIsEditPathwayFormVisible={setIsEditPathwayFormVisible} />
      {!!isLeftPanelVisible && (
        <Layout style={{ display: 'flex', flexDirection: 'row' }}>
          <Sider trigger={null} collapsible collapsed={collapsed}>
            <LeftPanel
              onCloseHandler={() => onCloseHandler}
              isDraggableCardVisibleMethod={(isDragTure: boolean) =>
                setDraggableCardVisible(isDragTure)
              }
              setLeftpanelSelectedElem={setLeftpanelSelectedElem}
            />
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
