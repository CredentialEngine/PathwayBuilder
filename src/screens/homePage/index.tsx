import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faCirclePlus,
  faXmarkCircle,
  faLink,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Layout, Row, Col } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import _ from 'lodash';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Xarrow, { Xwrapper } from 'react-xarrows';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { v4 as uuidv4 } from 'uuid';

import Button from '../../components/button';
import CardWithLeftIcon from '../../components/cardWithLeftIcon';
import DropWrapper from '../../components/dropWrapper';
import Header from '../../components/header';
import LeftPanel from '../../components/leftPanel';
import { getLeftPanelPathwayComponentRequest } from '../../components/leftPanel/state/actions';
import Message from '../../components/message';
import Modal from '../../components/modal';

import MultiCard from '../../components/multiCards';
import RightPanel from '../../components/rightPanel';
import { updateMappedDataRequest } from '../../states/actions';
import AddConditionalComponent from '../addComponent';
import EditComponent from '../editComponent';

import Styles from './index.module.scss';

interface Props {
  isViewMode: boolean;
  isLeftPanelVisible: boolean;
  setIsEditPathwayFormVisible: (a: boolean) => void;
  isDestinationColumnStatus: boolean;
  onClickPreselectComponent?: any;
  isStartFromInitialColumnSelected: boolean;
  setIsStartFromInitialColumnSelected: (a: boolean) => void;
  setIsDestinationColumnSelected: (a: boolean) => void;
  skipPreSelect?: boolean;
  destinationColumnSelect?: boolean;
  isEditPathwayFormVisible?: boolean;
  setIsDropCardAfterEditingForm: (a: boolean) => void;
  isDropCardAfterEditingForm: boolean;
  isEdit: boolean;
  setIsEdit: (val: any) => void;
}
const HomePage: React.FC<Props> = ({
  isViewMode,
  isLeftPanelVisible,
  setIsEditPathwayFormVisible,
  isDestinationColumnStatus,
  onClickPreselectComponent,
  isStartFromInitialColumnSelected,
  setIsStartFromInitialColumnSelected,
  setIsDestinationColumnSelected,
  skipPreSelect,
  destinationColumnSelect,
  setIsDropCardAfterEditingForm,
  isDropCardAfterEditingForm,
  isEdit,
  setIsEdit,
}) => {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [pathwayComponentCards, setPathwayComponentCards] = useState<any>([]);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [showRightPanelEdit, setShowRightPanelEdit] = useState(false);
  const [isZoomDisabled, setIsZoomDisabled] = useState(false);
  //const [arrowTransform, setArrowTransform] = useState(1);
  const [isDraggableCardVisible, setDraggableCardVisible] = useState(false);
  const [columnsData, setColumnsData] = useState<any>([]);

  const pathwayWrapper = useSelector((state: any) => state.initalReducer);
  const [rightPanelData, setRightPanelData] = useState({});
  // const [parentCard, setParentCard] = useState<any>();
  const [connectedChildCards, setConnectedChildCards] = useState<any>([]);
  const [dragElem, setDragElem] = useState<any>();
  const [leftpanelSelectedElem, setLeftpanelSelectedElem] =
    useState<HTMLElement>();
  const [sticky, setsticky] = useState<any>();

  const [numberOfDropWrapper, setNumberOfDropWrapper] = useState<number>(4);
  const [point, setPoint] = useState({
    start: '',
    end: '',
  });
  const [newConn, setNewConn] = useState<any>([]);
  const [connection, setConnection] = useState<any>([]);
  const [constraintIcon, setConstraintIcon] = useState<boolean>(false);
  const { mappedData: pathwayComponent } = pathwayWrapper;
  const [pathwayComponentConditionCards, setPathwayComponentConditionCards] =
    useState<any>([]);
  const [isConditionalModalStatus, setIsConditionalModalStatus] =
    useState<boolean>(false);

  const [isViewConnectionsModalStatus, setIsViewConnectionsModalStatus] =
    useState<boolean>(false);
  const [
    updatedPathwayComponentConditionCards,
    setUpdatedPathwayComponentConditionCards,
  ] = useState<any>([]);
  const [generatedUuid] = useState<any>({
    destinationCTID: uuidv4(),
    firstStageCTID: uuidv4(),
  });
  const [connectionsCTID, setConnectionsCTID] = useState<any>();
  const [allComponentCardsData, setAllComponentCardData] = useState<any>({});
  const [allConditionalCardsData, setAllConditionalCardData] = useState<any>(
    {}
  );
  //const [allcards,setallcards]=useState<any>({});
  const [isConditionalEditing, setIsConditionalEditing] = useState(false);
  const [componentConditionData, setComponentConditionData] = useState(false);
  const [extraCSS, setExtraCSS] = useState(false);
  //const [highRow, setHighRow] = useState(false);
  const [currentCardData, setCurrentCardData] = useState<any>();
  const [selectedConnections, setSelectedConnections] = useState<any>();
  const [errorComponents, setErrorComponents] = useState<any>();
  const [progressionLevelForAddComponent, setProgressionLevelForAddComponent] =
    useState<string>('');
  useEffect(() => {
    dispatch(getLeftPanelPathwayComponentRequest());
  }, []);
  useEffect(() => {
    if (isViewMode) {
      setCollapsed(true);
      if (collapsed == true) {
        setCollapsed(true);
      }
    }
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      setsticky(window.pageYOffset);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  // function addExtraCSSClick() {
  //   if(extraCSS !== true){
  //     setExtraCSS(true);
  //   }else{
  //     setExtraCSS(false);
  //   }
  // }

  useEffect(() => {
    const updatedConditionalComponents: any = [];
    setNewConn([]);
    //console.log(pathwayComponentConditionCards)
    pathwayComponentConditionCards.map((conditionalCard: any) => {
      if (_.isUndefined(conditionalCard?.HasProgressionLevel)) {
        [...pathwayComponentCards, ...pathwayComponentConditionCards].forEach(
          (pathway_card: any) => {
            if (
              pathway_card.CTID === conditionalCard?.TargetComponent?.[0] ||
              pathway_card.RowId === conditionalCard?.TargetComponent?.[0]
            ) {
              updatedConditionalComponents.push({
                ...conditionalCard,
                HasProgressionLevel: pathway_card.HasProgressionLevel,
              });
            }
          }
        );
      } else {
        updatedConditionalComponents.push({
          ...conditionalCard,
        });
      }
    });
    const obj: any = {};

    pathwayComponentConditionCards.map((conditional_comp: any) => {
      obj[conditional_comp.RowId] = {
        ...conditional_comp,
      };
      return conditional_comp;
    });
    setAllConditionalCardData({ ...allConditionalCardsData, ...obj });
    setUpdatedPathwayComponentConditionCards(pathwayComponentConditionCards);
    //console.log(updatedPathwayComponentConditionCards)
    setIsStartFromInitialColumnSelected(false);
    if (newConn.length == 0) {
      setNewConn([]);
      createConnection();
    } else {
      createConnection();
    }
  }, [pathwayComponentConditionCards, updatedPathwayComponentConditionCards]);

  const getComponentConditionData = (data: any) => {
    setComponentConditionData(data);
  };

  const [overlayData, setOverlayData] = useState<any>({
    columnNumber: 0,
    rowNumber: 0,
    CTID: '',
  });

  const wrapperRef = useRef<Array<HTMLDivElement | null>>([]);
  // useEffect(() => {
  //   debugger;
  //   console.log(generatedUuid);
  //   setGeneratedUuid({
  //     ...generatedUuid,
  //     destinationCTID: uuidv4(),
  //     firstStageCTID: uuidv4(),
  //   });
  //   console.log(generatedUuid);
  // }, []);

  let count = 0;
  useEffect(() => {
    const obj: any = {};

    pathwayComponentCards.map((component_card: any) => {
      obj[component_card.CTID] = {
        ...component_card,
      };
      return component_card;
    });
    setAllComponentCardData({ ...allComponentCardsData, ...obj });

    pathwayComponentCards?.length > 0 &&
      setIsStartFromInitialColumnSelected(false),
      setIsDestinationColumnSelected(false);

    const islastDropWrapperUsed = pathwayComponentCards?.some(
      (card: any) => card?.RowNumber === numberOfDropWrapper
    );
    if (islastDropWrapperUsed) {
      /* here we are increasing number of DropWrapper */
      setNumberOfDropWrapper((prevState) => prevState + 5);
    }
    const errorcards = pathwayComponentCards
      .filter((item: any) => item.Name === null || item.Name === '')
      .map((item: any) => item.CTID);
    setErrorComponents(errorcards);
    // console.log(errorcards);
  }, [pathwayComponentCards]);

  const onPlusClickHandler = (event: any, connections: any) => {
    event.stopPropagation();
    setIsViewConnectionsModalStatus(false);
    setIsConditionalModalStatus(true);
    setConnectionsCTID(connections);
    getComponentConditionData;
    const filteredEndComponent = [
      ...pathwayComponentCards,
      ...updatedPathwayComponentConditionCards,
    ].filter(
      (card: any) =>
        _.toString(card?.CTID) === _.toString(connections?.start) ||
        _.toString(card?.RowId) === _.toString(connections?.start)
    );
    //debugger;
    setProgressionLevelForAddComponent(
      _.get(filteredEndComponent, '0')?.HasProgressionLevel
    );
  };
  useEffect(() => {
    const updatedCards = pathwayComponent?.PathwayComponents.map(
      (card: any) => {
        if (
          card?.HasProgressionLevel == '' ||
          (card?.HasProgressionLevel == undefined &&
            card?.CTID !== pathwayComponent?.Pathway?.HasDestinationComponent)
        ) {
          return {
            ...card,
            HasProgressionLevel: generatedUuid.firstStageCTID,
          };
        } else {
          return card;
        }
      }
    );

    setPathwayComponentCards(updatedCards);
  }, [pathwayWrapper.mappedData.PathwayComponents]);
  const getSemester = (level: any) => {
    if (level?.Narrower?.length > 0) {
      const updatedPathwayLevel = pathwayComponent?.ProgressionLevels.map(
        (level: any) => ({ ...level, columnNumber: 1 })
      );
      const semesters = [] as any;
      level?.Narrower?.forEach((narrow: any) => {
        count = Math.floor(Math.random() * (99 - 10) + 10);
        updatedPathwayLevel.forEach((level1: any) => {
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

  const [hasProgressionLevelList, setHasProgressionLevelList] = useState<any>(
    []
  );

  useEffect(() => {
    setHasProgressionLevelList(
      columnsData.reduce((acc: any, curr: any) => {
        if (acc.length > 0) {
          if (!_.isUndefined(curr?.CTID)) {
            if (curr?.semesters?.length > 0) {
              const semestersCTID = curr.semesters.map((sem: any) => sem.CTID);
              semestersCTID.unshift(curr?.CTID);
              return [...acc, ...semestersCTID];
            } else {
              return [...acc, curr?.CTID];
            }
          } else {
            return acc;
          }
        } else {
          if (curr?.semesters?.length > 0) {
            const semestersCTID = curr.semesters.map((sem: any) => sem.CTID);
            semestersCTID.unshift(curr?.CTID);
            return semestersCTID;
          } else {
            return [curr?.CTID];
          }
        }
      }, [])
    );
  }, [columnsData]);

  useEffect(() => {
    if (pathwayComponent) {
      const pathwayModel =
        pathwayComponent?.Pathway?.HasProgressionModel?.length > 0;
      let count = 0;
      if (pathwayModel) {
        if (pathwayComponent?.ComponentConditions?.length > -1) {
          setPathwayComponentConditionCards(
            pathwayComponent.ComponentConditions.map((card: any) => ({
              ...card,
              Type: 'conditional',
            }))
          );
          setUpdatedPathwayComponentConditionCards(
            pathwayComponent.ComponentConditions.map((card: any) => ({
              ...card,
              Type: 'conditional',
            }))
          );
        }
        setPathwayComponentCards(pathwayComponent?.PathwayComponents);
        const updatedPathwayLevel = [] as any;
        const updatedPathwayLevel2 = [] as any;

        const level2ProgressionModel = [];

        const updatedProgressionLevel =
          pathwayComponent?.ProgressionLevels?.map((prog_level: any) => ({
            ...prog_level,
            columnNumber: 1,
          }));

        pathwayComponent?.ProgressionModels?.map((model: any) =>
          model?.HasTopConcept?.forEach((CTID: any) => {
            updatedProgressionLevel?.forEach((level: any) => {
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
            } else if (index === updatedPathwayLevel.length - 1) {
              updatedPathwayLevel2.push({
                ...upd_level,
                semesters,
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
            isDestinationColumnSelected: isDestinationColumnStatus,
            id: 'destinationColumn',
            Name: 'Destination Component',
            Narrower: null,
          },
        ]);
      } else {
        setColumnsData([
          { Id: 0, Name: 'Pathway', CTID: generatedUuid.firstStageCTID },
          {
            isDestinationColumnSelected: isDestinationColumnStatus,
            Id: 1,
            id: 'destinationColumn',
            Name: 'Destination Component',
            Narrower: null,
          },
        ]);
        // console.log(columnsData);
        //console.log(generatedUuid.firstStageCTID);
        const updatedCards = pathwayComponent?.PathwayComponents.map(
          (card: any) => {
            if (
              card?.HasProgressionLevel == '' ||
              (card?.HasProgressionLevel == undefined &&
                card?.CTID !==
                  pathwayComponent?.Pathway?.HasDestinationComponent)
            ) {
              return {
                ...card,
                HasProgressionLevel: generatedUuid.firstStageCTID,
              };
            } else {
              return card;
            }
          }
        );

        setPathwayComponentCards(updatedCards);
        // console.log(pathwayComponentConditionCards);
        if (pathwayComponent?.ComponentConditions?.length > -1) {
          const updatedConditionCards =
            pathwayComponent?.ComponentConditions.map((card: any) => {
              if (card?.HasProgressionLevel == undefined) {
                return {
                  ...card,
                  Type: 'conditional',
                };
              } else {
                return {
                  ...card,
                  HasProgressionLevel: generatedUuid.firstStageCTID,
                  Type: 'conditional',
                };
              }
            });
          // console.log(updatedPathwayComponentConditionCards);
          setUpdatedPathwayComponentConditionCards(updatedConditionCards);
          setPathwayComponentConditionCards(updatedConditionCards);
          // console.log(updatedPathwayComponentConditionCards);
        }
      }
    }
  }, [
    pathwayComponent.ComponentConditions,
    pathwayComponent.PathwayComponents,
    isDestinationColumnStatus,
  ]);

  const onSelectDragElemenet = (elem: HTMLElement) => {
    setDragElem(elem);
    if (newConn.length > 50) {
      Message({
        description: 'Reconnecting...',
        type: 'loading',
      });
    }
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
  const DropLeft = (data: any) => {
    let cardsintheprogressionlevel: any = [];
    if (
      data?.Type !== 'conditional' ||
      data?.Type !== 'ceterms:ComponentCondition'
    ) {
      if (data?.HasProgressionLevel === undefined) {
        cardsintheprogressionlevel = pathwayComponent.PathwayComponents.filter(
          (item: any) =>
            //item.HasProgressionLevel === data.HasProgressionLevel &&
            // item.CTID !== data.CTID &&
            item.CTID === pathwayComponent.Pathway.HasDestinationComponent
          //&&
          // item.ColumnNumber >= data.ColumnNumber
        );
      } else {
        if (
          pathwayComponent?.Pathway?.HasProgressionModel &&
          pathwayComponent?.Pathway?.HasProgressionModel.length > 0
        ) {
          cardsintheprogressionlevel =
            pathwayComponent?.PathwayComponents.filter(
              (item: any) =>
                item.HasProgressionLevel === data.HasProgressionLevel &&
                item.CTID !== data.CTID &&
                item.CTID !==
                  pathwayComponent.Pathway.HasDestinationComponent &&
                item.ColumnNumber >= data.ColumnNumber
            );
        } else {
          cardsintheprogressionlevel =
            pathwayComponent.PathwayComponents.filter(
              (item: any) =>
                //item.HasProgressionLevel === data.HasProgressionLevel &&
                item.CTID !== data.CTID &&
                item.CTID !==
                  pathwayComponent.Pathway.HasDestinationComponent &&
                item.ColumnNumber >= data.ColumnNumber
            );
        }
      }
    } else {
      cardsintheprogressionlevel = pathwayComponent.PathwayComponents.filter(
        (item: any) =>
          item.HasProgressionLevel === data.HasProgressionLevel &&
          item.CTID !== data.CTID &&
          item.CTID !== pathwayComponent.Pathway.HasDestinationComponent &&
          item.ColumnNumber >= data.ColumnNumber &&
          item.ColumnNumber >= data.ColumnNumber
      );
    }
    const conditionsintheprogressionlevel =
      updatedPathwayComponentConditionCards.filter(
        (item: any) =>
          item.HasProgressionLevel === data.HasProgressionLevel &&
          item.ColumnNumber >= data.ColumnNumber &&
          item.RowId !== data.RowId
      );
    const updatedProgressionlevelColumnNumber = cardsintheprogressionlevel.map(
      (item: any) => ({
        ...item,
        ColumnNumber: item.ColumnNumber + 1,
      })
    );
    const updatedProgressionlevelColumnNumberCond =
      conditionsintheprogressionlevel.map((item: any) => ({
        ...item,
        ColumnNumber: item.ColumnNumber + 1,
      }));
    const updatedList1 = pathwayComponent.PathwayComponents.map(
      (item1: any) => {
        const matchingItem2 = updatedProgressionlevelColumnNumber.find(
          (item2: any) => item2.CTID === item1.CTID
        );
        if (matchingItem2) {
          return { ...item1, ...matchingItem2 };
        }
        return item1;
      }
    );
    pathwayComponent.PathwayComponents = updatedList1;
    const updatedListConditions = pathwayComponent.ComponentConditions.map(
      (item1: any) => {
        const matchingItem2 = updatedProgressionlevelColumnNumberCond.find(
          (item2: any) => item2.RowId === item1.RowId
        );
        if (matchingItem2) {
          return { ...item1, ...matchingItem2 };
        }
        return item1;
      }
    );
    pathwayComponent.ComponentConditions = updatedListConditions;
    setUpdatedPathwayComponentConditionCards(updatedListConditions);
    dispatch(updateMappedDataRequest(pathwayComponent));
  };
  const onDropHandler = (
    card: any,
    destinationColumn: boolean,
    HasProgressionLevel: string,
    isDestinationColumnSelected: boolean,
    RowNumber: number,
    ColumnNumber: number,
    columnNumberEsixt: boolean,
    isFirstColumneSelected: boolean,
    firstColumn: boolean
  ) => {
    const updatedPathwayWrapper = { ...pathwayComponent };
    dispatch(updateMappedDataRequest(updatedPathwayWrapper));
    if (!destinationColumn) {
      card.destinationColumn = false;
    }
    if (card?.Type == 'ceterms:ComponentCondition' && card?.CTID !== null) {
      card.CTID = null;
    }
    setDraggableCardVisible(false);
    const { isPendingCards, isComponentTab, ...restCardProps } = card;

    setNewConn([]);
    const isDestinationCardExist =
      !_.isEmpty(pathwayComponent.Pathway.HasDestinationComponent) &&
      updatedPathwayWrapper?.Pathway?.HasDestinationComponent !== '';
    const movecard = {
      ...restCardProps,
      HasProgressionLevel,
      RowNumber,
      ColumnNumber,
    };
    if (isComponentTab) {
      card = {
        HasProgressionLevel,
        RowNumber,
        ColumnNumber: ColumnNumber - 1,
      };
    }
    if (
      isDestinationCardExist &&
      HasProgressionLevel == undefined &&
      restCardProps?.Type !== 'conditional' &&
      restCardProps?.Type !== 'ceterms:ComponentCondition' &&
      restCardProps?.CTID !==
        updatedPathwayWrapper?.Pathway?.HasDestinationComponent
    ) {
      //drop not allowed if a component exists in the destination
      createConnection();
      return;
    }

    if (columnNumberEsixt && !isPendingCards) {
      const pathwayComponentColumnNumber = pathwayComponentCards
        ?.filter(
          (card: any) => card.HasProgressionLevel === HasProgressionLevel
        )
        .reduce((acc: any, curr: any) => {
          if (acc >= curr.ColumnNumber) {
            return acc;
          } else {
            return curr.ColumnNumber;
          }
        }, 1);

      const conditinalComponentColumnNumber =
        updatedPathwayComponentConditionCards
          .filter(
            (card: any) => card.HasProgressionLevel === HasProgressionLevel
          )
          .reduce((acc: any, curr: any) => {
            if (acc >= curr.ColumnNumber) {
              return acc;
            } else {
              return curr.ColumnNumber;
            }
          }, 1);

      const maxColumnNumber = Math.max(
        pathwayComponentColumnNumber,
        conditinalComponentColumnNumber
      );
      // if (maxColumnNumber === card?.ColumnNumber && maxColumnNumber !== 1) {
      //   return;
      // }
      if (
        restCardProps?.Type === 'conditional' ||
        restCardProps?.Type === 'ceterms:ComponentCondition'
      ) {
        if (ColumnNumber == maxColumnNumber) {
          const updatedCards = updatedPathwayComponentConditionCards
            .filter((item: any) => item?.RowId !== restCardProps?.RowId)
            .concat({
              ...restCardProps,
              RowNumber,
              HasProgressionLevel,
              ColumnNumber: maxColumnNumber + 1,
            });
          setUpdatedPathwayComponentConditionCards(updatedCards);
          updatedPathwayWrapper.ComponentConditions = updatedCards;
          dispatch(updateMappedDataRequest(updatedPathwayWrapper));
        } else {
          pathwayComponent.ComponentConditions =
            updatedPathwayComponentConditionCards
              .filter((item: any) => item?.RowId !== restCardProps?.RowId)
              .concat({
                ...restCardProps,
                RowNumber,
                HasProgressionLevel,
                ColumnNumber,
              });
          setUpdatedPathwayComponentConditionCards(
            pathwayComponent.ComponentConditions
          );
          //updatedPathwayWrapper.ComponentConditions = updatedCards;
          dispatch(updateMappedDataRequest(updatedPathwayWrapper));
          const check = checkIfCardExistsInthatPosition(movecard);
          if (check == true) {
            DropLeft(movecard);
          }
        }
        // resizeProgressionLevel(movecard);
      } else {
        if (ColumnNumber == maxColumnNumber) {
          updatedPathwayWrapper.PathwayComponents = pathwayComponentCards
            .filter(
              (component_card: any) =>
                component_card?.CTID !== restCardProps?.CTID
            )
            .concat({
              ...restCardProps,
              destinationColumn: false,
              HasProgressionLevel,
              RowNumber,
              ColumnNumber: maxColumnNumber + 1,
              firstColumn,
            });
          dispatch(updateMappedDataRequest(updatedPathwayWrapper));
        } else {
          pathwayComponent.PathwayComponents = pathwayComponentCards
            .filter(
              (component_card: any) =>
                component_card?.CTID !== restCardProps?.CTID
            )
            .concat({
              ...restCardProps,
              destinationColumn: false,
              HasProgressionLevel,
              RowNumber,
              ColumnNumber,
              firstColumn,
            });
          dispatch(updateMappedDataRequest(updatedPathwayWrapper));
          const check = checkIfCardExistsInthatPosition(movecard);
          if (check == true) {
            DropLeft(movecard);
          }
        }
        // resizeProgressionLevel(movecard);
      }
      // }
      /*
        this block is to prevent to create a new column when we overlap pathwayComponent inside same progressionLevel
      */
      //createConnection();
      return;
    }

    // if (columnNumberEsixt && !isPendingCards) {
    //   if (card?.HasProgressionLevel === HasProgressionLevel) {
    //     createConnection();
    //   } else if (!destinationColumn) {
    //     const pathwayComponentColumnNumber = pathwayComponentCards
    //       ?.filter(
    //         (card: any) => card.HasProgressionLevel === HasProgressionLevel
    //       )
    //       .reduce((acc: any, curr: any) => {
    //         if (acc >= curr.ColumnNumber) {
    //           return acc;
    //         } else {
    //           return curr.ColumnNumber;
    //         }
    //       }, 1);

    //     const conditinalComponentColumnNumber =
    //       updatedPathwayComponentConditionCards
    //         .filter(
    //           (card: any) => card.HasProgressionLevel === HasProgressionLevel
    //         )
    //         .reduce((acc: any, curr: any) => {
    //           if (acc >= curr.ColumnNumber) {
    //             return acc;
    //           } else {
    //             return curr.ColumnNumber;
    //           }
    //         }, 1);

    //     const maxColumnNumber = Math.max(
    //       pathwayComponentColumnNumber,
    //       conditinalComponentColumnNumber
    //     );
    //     if (card?.Type === 'conditional') {
    //       const updatedCards = updatedPathwayComponentConditionCards
    //         .filter((item: any) => item?.RowId !== card?.RowId)
    //         .concat({
    //           ...card,
    //           RowNumber,
    //           HasProgressionLevel,
    //           ColumnNumber: maxColumnNumber + 1,
    //         });
    //       setUpdatedPathwayComponentConditionCards(updatedCards);
    //       updatedPathwayWrapper.ComponentConditions = updatedCards;
    //       dispatch(updateMappedDataRequest(updatedPathwayWrapper));
    //     } else {
    //       setPathwayComponentCards(
    //         pathwayComponentCards
    //           .filter(
    //             (component_card: any) => component_card?.CTID !== card?.CTID
    //           )
    //           .concat({
    //             ...restCardProps,
    //             destinationColumn: false,
    //             HasProgressionLevel,
    //             RowNumber,
    //             ColumnNumber: maxColumnNumber + 1,
    //             firstColumn,
    //           })
    //       );
    //     }
    //   }
    //   /*
    //     this block is to prevent to create a new column when we overlap pathwayComponent inside same progressionLevel
    //   */
    //   createConnection();
    //   return;
    // }
    if (
      restCardProps?.Type === 'conditional' ||
      restCardProps?.Type === 'ceterms:ComponentCondition'
    ) {
      /* This Function add only conditional cards*/
      //const updatedPathwayWrapper = { ...pathwayComponent };
      const updatedConditions = updatedPathwayComponentConditionCards
        .filter((item: any) => item?.RowId !== restCardProps.RowId)
        .concat({
          ...restCardProps,
          RowNumber,
          HasProgressionLevel,
          ColumnNumber,
        });
      setUpdatedPathwayComponentConditionCards(updatedConditions);

      pathwayComponent.ComponentConditions = updatedConditions;
      dispatch(updateMappedDataRequest(pathwayComponent));
      // debugger;
      // console.log(updatedConditions);
      const check = checkIfCardExistsInthatPosition(movecard);
      //  debugger;
      if (check == true) {
        DropLeft(movecard);
      }
      resizeProgressionLevel(movecard);
      return;
    }

    if (
      card.HasProgressionLevel === HasProgressionLevel &&
      card.ColumnNumber === ColumnNumber &&
      card.RowNumber === RowNumber
    ) {
      // createConnection();
      /* To prevent overlapping, If we overlap the existing card over each other in Gameboard*/
      return;
    }

    if (
      !destinationColumn &&
      isDestinationCardExist &&
      card?.CTID === updatedPathwayWrapper?.Pathway?.HasDestinationComponent
    ) {
      const updatedPathwayWrapper = { ...pathwayComponent };

      const updatedPathway = { ...updatedPathwayWrapper.Pathway };
      updatedPathway.HasDestinationComponent = '';
      updatedPathwayWrapper.Pathway.HasDestinationComponent = '';
      dispatch(updateMappedDataRequest(updatedPathwayWrapper));
    }

    if (!!destinationColumn && !isDestinationCardExist) {
      if (
        restCardProps?.Type !== 'conditional' &&
        restCardProps?.Type !== 'ceterms:ComponentCondition'
      ) {
        const updatedPathwayWrapper = { ...pathwayComponent };

        const updatedPathwayComponent =
          updatedPathwayWrapper?.PathwayComponents?.filter(
            (pathway_component: any) => pathway_component?.CTID !== card?.CTID
          ).concat({
            ...restCardProps,
            destinationColumn,
            HasProgressionLevel,
            RowNumber,
            ColumnNumber: 1,
            firstColumn,
          });
        //const updatedPathway = {...updatedPathwayWrapper?.Pathway };
        updatedPathwayWrapper.Pathway.HasDestinationComponent =
          restCardProps?.CTID;
        //updatedPathwayWrapper.Pathway = updatedPathway;
        updatedPathwayWrapper.PathwayComponents = updatedPathwayComponent;
        if (updatedPathwayWrapper.PendingComponents != undefined) {
          const filteredpending =
            updatedPathwayWrapper.PendingComponents.filter(
              (item: any) => item.CTID !== card.CTID
            );
          updatedPathwayWrapper.PendingComponents = filteredpending;
        }
        dispatch(updateMappedDataRequest(updatedPathwayWrapper));
        setPathwayComponentCards(updatedPathwayWrapper.PathwayComponents);
        const check = checkIfCardExistsInthatPosition(movecard);
        if (check == true) {
          DropLeft(movecard);
        }
        resizeProgressionLevel(movecard);
        return;
      }
    }
    if (!!destinationColumn && isDestinationCardExist) {
      const isCardAlreadyInDestinationColumn = pathwayComponentCards?.filter(
        (component_card: any) =>
          component_card.CTID == card.CTID &&
          component_card.destinationColumn === true
      );

      if (isCardAlreadyInDestinationColumn?.length > 0) {
        const updatedPathwayComponent =
          updatedPathwayWrapper?.PathwayComponents?.filter(
            (pathway_component: any) => pathway_component?.CTID !== card?.CTID
          ).concat({
            ...restCardProps,
            RowNumber,
            ColumnNumber,
            firstColumn,
          });
        updatedPathwayWrapper.PathwayComponents = updatedPathwayComponent;
        dispatch(updateMappedDataRequest(updatedPathwayWrapper));
      } else {
        const updatedPathwayComponent =
          updatedPathwayWrapper?.PathwayComponents?.filter(
            (pathway_component: any) => pathway_component?.CTID !== card?.CTID
          ).concat({
            ...restCardProps,
            RowNumber,
            ColumnNumber,
            firstColumn,
          });
        updatedPathwayWrapper.PathwayComponents = updatedPathwayComponent;
        dispatch(updateMappedDataRequest(updatedPathwayWrapper));
      }

      // createConnection();
      return;
    }

    if (isDropCardAfterEditingForm) {
      updatedPathwayWrapper.PathwayComponents = [
        ...pathwayComponentCards,
        {
          ...restCardProps,
          destinationColumn,
          HasProgressionLevel,
          RowNumber,
          ColumnNumber: 1,

          firstColumn,
        },
      ];
      dispatch(updateMappedDataRequest(updatedPathwayWrapper));
      setIsDropCardAfterEditingForm(false);
      return;
    }

    if (
      pathwayComponentCards.length === 0 &&
      isStartFromInitialColumnSelected &&
      isFirstColumneSelected
    ) {
      updatedPathwayWrapper.PathwayComponents = [
        ...pathwayComponentCards,
        {
          ...restCardProps,
          destinationColumn: false,
          HasProgressionLevel,
          RowNumber,
          ColumnNumber: 1,

          firstColumn,
        },
      ];
      dispatch(updateMappedDataRequest(updatedPathwayWrapper));
    } else if (
      pathwayComponentCards.length === 0 &&
      isDestinationColumnSelected &&
      isDestinationColumnStatus
    ) {
      updatedPathwayWrapper.PathwayComponents = [
        ...pathwayComponentCards,
        {
          ...restCardProps,
          destinationColumn,
          HasProgressionLevel,
          RowNumber,
          ColumnNumber: 1,
          firstColumn,
        },
      ];
      dispatch(updateMappedDataRequest(updatedPathwayWrapper));
    } else if (card?.pathwayGameboardCard) {
      updatedPathwayWrapper.PathwayComponents = pathwayComponentCards
        .filter((item: any) => item.CTID !== card.CTID)
        .concat({
          ...restCardProps,
          HasProgressionLevel,
          RowNumber,
          ColumnNumber: ColumnNumber > 0 ? ColumnNumber : 1,
          firstColumn,
        });

      dispatch(updateMappedDataRequest(updatedPathwayWrapper));
      setPathwayComponentCards(updatedPathwayWrapper.PathwayComponents);
      const check = checkIfCardExistsInthatPosition(movecard);
      if (check == true) {
        DropLeft(movecard);
      }
      resizeProgressionLevel(movecard);
    } else if (pathwayComponentCards.length !== 0) {
      if (
        restCardProps?.Type === 'conditional' ||
        restCardProps?.Type === 'ceterms:ComponentCondition'
      ) {
        updatedPathwayWrapper.ComponentConditions =
          updatedPathwayComponentConditionCards
            .filter((item: any) => item.RowId !== restCardProps.RowId)
            .concat({
              ...restCardProps,
              HasProgressionLevel,
              RowNumber,
              ColumnNumber,
              firstColumn,
              CTID: '',
            });
        dispatch(updateMappedDataRequest(updatedPathwayWrapper));
      } else {
        pathwayComponent.PathwayComponents = pathwayComponentCards
          .filter((item: any) => item.CTID !== card.CTID)
          .concat({
            ...restCardProps,
            HasProgressionLevel,
            RowNumber,
            ColumnNumber,
            firstColumn,
          });
        if (pathwayComponent?.PendingComponents != undefined) {
          const filteredpending = pathwayComponent.PendingComponents.filter(
            (item: any) => item.CTID !== card.CTID
          );
          pathwayComponent.PendingComponents = filteredpending;
        }
        dispatch(updateMappedDataRequest(pathwayComponent));
        const check = checkIfCardExistsInthatPosition(movecard);
        if (check == true) {
          DropLeft(movecard);
        }
        resizeProgressionLevel(movecard);
      }
    } else {
      return;
    }

    if (isDestinationColumnSelected) {
      const updatedPathwayWrapper = { ...pathwayComponent };
      const updatedPathwayComponent = { ...updatedPathwayWrapper.Pathway };
      updatedPathwayComponent.HasDestinationComponent = card.CTID;
      updatedPathwayWrapper.Pathway = updatedPathwayComponent;
      dispatch(updateMappedDataRequest(updatedPathwayWrapper));
    }
  };

  let conditionalComponent: any = [];

  const checkHasCondition = (card: any) => {
    if (card?.HasCondition.length > 0) {
      const nextConditionalComponent =
        updatedPathwayComponentConditionCards.filter((condition_card: any) =>
          card?.HasCondition.includes(condition_card?.RowId)
        );

      conditionalComponent = [
        ...conditionalComponent,
        ...nextConditionalComponent,
      ];
      checkHasCondition(nextConditionalComponent[0]);
    } else {
      return conditionalComponent;
    }
    return conditionalComponent;
  };

  const onDeleteHandler = (data: any) => {
    const updatedPathwayWrapper = { ...pathwayComponent };
    const updatedPathway = { ...updatedPathwayWrapper.Pathway };
    const isDestinationCardExist =
      updatedPathway?.HasDestinationComponent === data?.CTID;
    if (isDestinationCardExist) {
      updatedPathway.HasDestinationComponent = '';
      updatedPathwayWrapper.Pathway = updatedPathway;
    }

    const result = checkHasCondition(data);
    let updatedPathwayComponent: [] = [];
    let updatedPathwayConditionalComponent: [] = [];

    const targetComponent = [...result, data]?.find(
      (result: any) => result?.TargetComponent?.length > 0
    );

    if (
      data?.Type === 'conditional' ||
      data?.Type === 'ceterms:ComponentCondition'
    ) {
      const filteredConditionalComponent =
        updatedPathwayComponentConditionCards.filter(
          (conditional_card: any) =>
            ![...result, data].find(
              (element: any) => element.RowId === conditional_card.RowId
            )
        );
      const filteredconstraint = updatedPathwayWrapper?.Constraints?.filter(
        (constraint: any) => !data?.HasConstraint.includes(constraint?.RowId)
      );
      updatedPathwayComponent = pathwayComponentCards.map((item: any) =>
        item?.HasCondition.includes(data?.RowId)
          ? {
              ...item,
              HasCondition: item?.HasCondition.filter(
                (condition: any) => condition !== data?.RowId
              ),
              PrecededBy: data?.TargetComponent,
            }
          : item
      );

      updatedPathwayConditionalComponent = filteredConditionalComponent.map(
        (item: any) =>
          data?.ParentIdentifier === item?.RowId
            ? {
                ...item,
                HasCondition: item?.HasCondition.filter(
                  (condition: any) => condition !== data?.RowId
                ),
                TargetComponent:
                  targetComponent?.TargetComponent?.length > 0
                    ? targetComponent?.TargetComponent
                    : item?.TargetComponent,
              }
            : item
      );

      updatedPathwayWrapper.DeletedComponentConditions = [
        ...updatedPathwayWrapper.DeletedComponentConditions,
        ...result,
        data,
      ];
      updatedPathwayWrapper.ComponentConditions =
        updatedPathwayConditionalComponent;
      updatedPathwayWrapper.Constraints = filteredconstraint;

      updatedPathwayWrapper.PathwayComponents = updatedPathwayComponent;
    } else {
      const filteredConditionalComponent = updatedPathwayComponentConditionCards
        .filter(
          (conditional_card: any) =>
            !result.find(
              (element: any) => element.RowId === conditional_card.RowId
            )
        )
        .map((card: any) =>
          card?.TargetComponent.includes(data?.CTID)
            ? { ...card, TargetComponent: data.PrecededBy }
            : { ...card }
        );

      updatedPathwayComponent = pathwayComponentCards
        .filter((item: any) => item.CTID !== data.CTID)
        .map((component_card: any) => {
          if (component_card?.PrecededBy.includes(data?.CTID)) {
            return {
              ...component_card,
              PrecededBy: component_card?.PrecededBy.filter(
                (preceded: any) => preceded !== data?.CTID
              ),
            };
          } else if (component_card?.Precedes.includes(data?.CTID)) {
            return {
              ...component_card,
              Precedes: component_card?.Precedes.filter(
                (preceded: any) => preceded !== data?.CTID
              ),
            };
          } else if (component_card?.HasChild.includes(data?.CTID)) {
            return {
              ...component_card,
              HasChild: component_card?.HasChild.filter(
                (preceded: any) => preceded !== data?.CTID
              ),
            };
          } else {
            return { ...component_card };
          }
        });

      updatedPathwayWrapper.ComponentConditions = filteredConditionalComponent;
      updatedPathwayWrapper.PathwayComponents = updatedPathwayComponent;
      updatedPathwayWrapper.DeletedComponentConditions = [
        ...updatedPathwayWrapper.DeletedComponentConditions,
        ...result,
      ];

      updatedPathwayWrapper.DeletedComponents = [
        ...updatedPathwayWrapper.DeletedComponents,
        data,
      ];
    }
    dispatch(updateMappedDataRequest(updatedPathwayWrapper));
  };

  const checkIfCardExistsInthatPosition = (data: any) => {
    const components = pathwayComponentCards.filter(
      (item: any) =>
        item.ColumnNumber === data.ColumnNumber &&
        item.RowNumber === data.RowNumber &&
        item.HasProgressionLevel === data.HasProgressionLevel
    );
    const conditions = updatedPathwayComponentConditionCards.filter(
      (item: any) =>
        item.ColumnNumber === data.ColumnNumber &&
        item.RowNumber === data.RowNumber &&
        item.HasProgressionLevel === data.HasProgressionLevel
    );
    if (components.length > 0 || conditions.length > 0) {
      return true;
    } else {
      false;
    }
  };
  const IsSelected = (data: any) => {
    if (selectedConnections !== undefined) {
      return selectedConnections.some((selected: any) => selected === data);
    } else {
      return false;
    }
  };
  const IsErrorCard = (data: any) => {
    if (errorComponents !== undefined) {
      return errorComponents.some((selected: any) => selected === data);
    } else {
      return false;
    }
  };

  const resizeProgressionLevel = (data: any) => {
    const pathwayComponentColumnNumber = pathwayComponentCards
      ?.filter(
        (card: any) => card.HasProgressionLevel === data?.HasProgressionLevel
      )
      .reduce((acc: any, curr: any) => {
        if (acc >= curr.ColumnNumber) {
          return acc;
        } else {
          return curr.ColumnNumber;
        }
      }, 1);

    const conditinalComponentColumnNumber =
      updatedPathwayComponentConditionCards
        .filter(
          (card: any) => card.HasProgressionLevel === data?.HasProgressionLevel
        )
        .reduce((acc: any, curr: any) => {
          if (acc >= curr.ColumnNumber) {
            return acc;
          } else {
            return curr.ColumnNumber;
          }
        }, 1);

    const maxColumnNumber = Math.max(
      pathwayComponentColumnNumber,
      conditinalComponentColumnNumber
    );
    for (let i = 1; i <= maxColumnNumber; i++) {
      let conditions: any[];
      let components: any[];
      if (pathwayComponent.Pathway.HasProgressionModel.length > 0) {
        components = pathwayComponent.PathwayComponents.filter(
          (item: any) =>
            item.ColumnNumber === i &&
            item.HasProgressionLevel === data.HasProgressionLevel
        );
      } else {
        components = pathwayComponent.PathwayComponents.filter(
          (item: any) =>
            item.ColumnNumber === i &&
            item.CTID !== pathwayComponent.Pathway.HasDestinationComponent
        );
      }
      if (pathwayComponent.Pathway.HasProgressionModel.length > 0) {
        conditions = pathwayComponent.ComponentConditions.filter(
          (item: any) =>
            item.ColumnNumber === i &&
            item.HasProgressionLevel === data.HasProgressionLevel
        );
      } else {
        conditions = pathwayComponent.ComponentConditions.filter(
          (item: any) =>
            item.ColumnNumber === i && item.HasProgressionLevel !== undefined
        );
      }
      if (components.length == 0 && conditions.length == 0) {
        let cardsintheprogressionlevel: any[];
        if (pathwayComponent.Pathway.HasProgressionModel.length > 0) {
          cardsintheprogressionlevel =
            pathwayComponent.PathwayComponents.filter(
              (item: any) =>
                item.HasProgressionLevel === data.HasProgressionLevel &&
                item.CTID !==
                  pathwayComponent.Pathway.HasDestinationComponent &&
                item.ColumnNumber > i
            );
        } else {
          cardsintheprogressionlevel =
            pathwayComponent.PathwayComponents.filter(
              (item: any) =>
                // item.HasProgressionLevel === data.HasProgressionLevel &&
                item.CTID !==
                  pathwayComponent.Pathway.HasDestinationComponent &&
                item.ColumnNumber > i
            );
        }
        const updatedProgressionlevelCards = cardsintheprogressionlevel.map(
          (item: any) => ({
            ...item,
            ColumnNumber: item.ColumnNumber - 1,
          })
        );
        const updatedList1 = pathwayComponent.PathwayComponents.map(
          (item1: any) => {
            const matchingItem2 = updatedProgressionlevelCards.find(
              (item2: any) => item2.CTID === item1.CTID
            );
            if (matchingItem2) {
              return { ...item1, ...matchingItem2 };
            }
            return item1;
          }
        );
        pathwayComponent.PathwayComponents = updatedList1;
        const conditionsintheprogressionlevel =
          pathwayComponent.ComponentConditions.filter(
            (item: any) =>
              item.HasProgressionLevel === data.HasProgressionLevel &&
              item.ColumnNumber > i
          );
        const updatedProgressionlevelConditions =
          conditionsintheprogressionlevel.map((item: any) => ({
            ...item,
            ColumnNumber: item.ColumnNumber - 1,
          }));
        const updatedListConditions = pathwayComponent.ComponentConditions.map(
          (item1: any) => {
            const matchingItem2 = updatedProgressionlevelConditions.find(
              (item2: any) => item2.RowId === item1.RowId
            );
            if (matchingItem2) {
              return { ...item1, ...matchingItem2 };
            }
            return item1;
          }
        );
        pathwayComponent.ComponentConditions = updatedListConditions;
      }
    }
  };
  const onCloseHandler = () => {
    const element = document.getElementById('left-frame');
    if (element != null) {
      element.style.display = 'none';
    }
  };

  const setEndpoints = (e: any, id: any) => {
    if (!isViewMode) {
      e.stopPropagation();
      if (point.start && point.start !== id) {
        setPoint({
          ...point,
          end: id,
        });
        e?.target?.classList?.add('active');

        const startCard: any = _.get(
          [
            ...pathwayComponentCards,
            ...updatedPathwayComponentConditionCards,
          ].filter(
            (card: any) =>
              card?.RowId === point?.start || card?.CTID === point?.start
          ),
          '0'
        );
        const endCard: any = _.get(
          [
            ...pathwayComponentCards,
            ...updatedPathwayComponentConditionCards,
          ].filter((card: any) => card?.RowId === id || card?.CTID === id),
          '0'
        );

        let startCardIndex = hasProgressionLevelList.findIndex(
          (level: any) => level === startCard?.HasProgressionLevel
        );
        let lastCardIndex = hasProgressionLevelList.findIndex(
          (level: any) => level === endCard?.HasProgressionLevel
        );

        if (startCardIndex == -1) {
          startCardIndex = 99;
        }

        if (lastCardIndex == -1) {
          lastCardIndex = 99;
        }
        if (
          startCardIndex < lastCardIndex ||
          (endCard?.HasProgressionLevel === startCard?.HasProgressionLevel &&
            startCard?.ColumnNumber <= endCard?.ColumnNumber)
        ) {
          setNewConn([
            ...newConn,
            {
              start: point.start,
              end: id,
            },
          ]);
          pathwayComponentCards?.map((card: any) => {
            const hasCondComp = updatedPathwayComponentConditionCards?.find(
              (cond: any) =>
                point?.start === (card?.CTID || card?.RowId) &&
                id === (cond?.RowId || cond?.CTID)
            );
            if (hasCondComp) {
              if (!hasCondComp?.TargetComponent?.includes(point.start)) {
                hasCondComp?.TargetComponent?.push(point.start);
              }
            }
            if (point?.start === card?.CTID && !hasCondComp) {
              setCurrentCardData(card);
              if (!endCard?.PrecededBy?.includes(point.start)) {
                endCard?.PrecededBy?.push(point.start);
              }
              if (!card?.Precedes?.includes(id)) {
                card?.Precedes?.push(id);
              }
            }
          });
          const updatedPathwayWrapper = { ...pathwayComponent };
          updatedPathwayWrapper.PathwayComponents = pathwayComponentCards;
          dispatch(updateMappedDataRequest(updatedPathwayWrapper));
          // for connecting conditional to basic
          updatedPathwayComponentConditionCards?.map((_cond: any) => {
            if (point?.start === _cond?.RowId || point?.start === _cond?.CTID) {
              const cardToUpdate = pathwayComponentCards?.find(
                (_card: any) => id === _card?.CTID || id === _card?.RowId
              );
              if (cardToUpdate) {
                if (!_cond?.TargetComponent?.includes(id)) {
                  const previousParent = pathwayComponentCards?.find(
                    (_card: any) => _cond.RowId === _card?.HasCondition[0]
                  );
                  if (previousParent !== undefined) {
                    previousParent.HasCondition = [];
                    pathwayComponentCards.map((item: any) => {
                      if (item.CTID === previousParent.CTID) {
                        return previousParent;
                      }
                      return item;
                    });
                  }
                  if (!endCard?.HasCondition?.includes(startCard?.RowId)) {
                    endCard?.HasCondition?.push(startCard?.RowId);
                    _cond.ParentIdentifier = endCard?.RowId;
                  }

                  const updatedPathwayWrapper = { ...pathwayComponent };
                  updatedPathwayWrapper.PathwayComponents =
                    pathwayComponentCards;
                  updatedPathwayWrapper.ComponentConditions =
                    updatedPathwayComponentConditionCards;
                  dispatch(updateMappedDataRequest(updatedPathwayWrapper));
                }
              } else {
                if (!_cond?.HasCondition?.includes(id)) {
                  if (endCard?.Type !== 'conditional') {
                    endCard?.TargetComponent?.push(point.start);
                  } else {
                    if (!endCard?.HasCondition?.includes(point.start)) {
                      endCard?.HasCondition?.push(point.start);
                      _cond.ParentIdentifier = endCard?.RowId;
                    }
                    const updatedPathwayWrapper = { ...pathwayComponent };
                    updatedPathwayWrapper.ComponentConditions =
                      updatedPathwayComponentConditionCards;
                    dispatch(updateMappedDataRequest(updatedPathwayWrapper));
                  }
                }
              }
            }
          });
        }
        setConstraintIcon(true);
      } else {
        setPoint({
          ...point,
          start: id,
          end: point?.end,
        });
        e?.target?.classList?.add('active');
      }
      setPoint;
    }
  };

  const createConnection = useCallback(() => {
    const tempCon = [] as any;
    if (pathwayComponentCards) {
      pathwayComponentCards?.map((card: any) => {
        if (card?.HasCondition.length === 0) {
          if (card?.PrecededBy?.length > 0) {
            card?.PrecededBy?.map((child: string) => {
              tempCon.push({ start: card?.CTID || card?.RowId, end: child });
            });
          }
          if (card?.HasChild?.length > 0) {
            card?.HasChild?.map((child: string) => {
              tempCon.push({ start: card?.CTID || card?.RowId, end: child });
            });
          }
        }

        if (card?.HasCondition?.length > 0) {
          card?.HasCondition?.map((condition: string) => {
            tempCon?.push({ start: card?.CTID || card?.RowId, end: condition });
          });
        }

        if (pathwayComponent) {
          pathwayComponent?.ComponentConditions?.map(
            (componentCondition: any) => {
              if (componentCondition?.HasCondition?.length > 0) {
                componentCondition?.HasCondition?.map((_cond: any) => {
                  tempCon?.push({
                    start:
                      componentCondition?.CTID || componentCondition?.RowId,
                    end: _cond,
                  });
                });
              }
              if (componentCondition?.TargetComponent?.length > 0) {
                componentCondition?.TargetComponent?.map((target: string) => {
                  if (card?.PrecededBy?.length > 0) {
                    card?.PrecededBy?.map((_preceded: any) => {
                      if (_preceded !== target) {
                        tempCon?.push({
                          start: card?.CTID || card?.RowId,
                          end: _preceded,
                        });
                      }
                    });
                  }
                  if (card?.HasChild?.length > 0) {
                    card?.HasChild?.map((_preceded: any) => {
                      if (_preceded !== target) {
                        tempCon?.push({
                          start: card?.CTID || card?.RowId,
                          end: _preceded,
                        });
                      }
                    });
                  }
                  if (
                    tempCon?.includes({
                      start: componentCondition?.ParentIdentifier,
                      end: target,
                    })
                  ) {
                    const itemToRemove = tempCon?.findIndex(
                      (item: any) =>
                        item?.start === componentCondition?.ParentIdentifier &&
                        item?.end === target
                    );
                    tempCon?.splice(itemToRemove, 1);
                  }
                  tempCon?.push({
                    start:
                      componentCondition?.CTID || componentCondition?.RowId,
                    end: target,
                  });
                });
              }
            }
          );
        }

        if (
          card?.HasCondition?.length > 0 &&
          pathwayComponent?.ComponentConditions?.length > 0
        ) {
          card?.HasCondition?.map((condition: string) => {
            pathwayComponent?.ComponentConditions?.map((compCond: any) => {
              if (
                compCond?.RowId === condition &&
                card?.PrecededBy?.length > 0 &&
                compCond?.TargetComponent?.length > 0
              ) {
                card?.PrecededBy?.map((preced: string) => {
                  compCond?.TargetComponent?.map((target: string) => {
                    if (preced === target) {
                      const itemToRemove = tempCon?.findIndex(
                        (item: any) =>
                          item?.start === card?.CTID ||
                          (card?.RowId && item?.end === preced)
                      );
                      tempCon?.splice(itemToRemove, 1);
                    }
                  });
                });
              }
              if (
                compCond?.RowId === condition &&
                card?.HasChild?.length > 0 &&
                compCond?.TargetComponent?.length > 0
              ) {
                card?.HasChild?.map((preced: string) => {
                  compCond?.TargetComponent?.map((target: string) => {
                    if (preced === target) {
                      const itemToRemove = tempCon?.findIndex(
                        (item: any) =>
                          item?.start === card?.CTID ||
                          (card?.RowId && item?.end === preced)
                      );
                      tempCon?.splice(itemToRemove, 1);
                    }
                  });
                });
              }
            });
          });
        }
      });
    }

    const uniqArrConn = tempCon?.filter(
      (value: any, idx: number, self: any) =>
        idx ===
        self.findIndex(
          (t: any) => t.start === value?.start && t?.end === value?.end
        )
    );
    setNewConn(uniqArrConn);
  }, [
    pathwayComponentCards,
    pathwayComponent,
    updatedPathwayComponentConditionCards,
  ]);

  useEffect(() => {
    if (point && point?.start?.length > 0 && point?.end?.length > 0) {
      setNewConn([]);
      setPoint({
        start: '',
        end: '',
      });
      createConnection();
    }
  }, [point]);

  const setSelected = (e: any, id: any) => {
    if (selectedConnections != undefined && selectedConnections[0] === id) {
      setSelectedConnections(undefined);
    } else {
      const tempCon = [] as any;
      tempCon.push(id);
      const selectedCard = pathwayComponentCards.filter(
        (card: any) => card?.CTID === id
      );
      if (selectedCard.length > 0) {
        if (selectedCard[0]?.HasCondition.length > 0) {
          selectedCard[0]?.HasCondition.map((card: any) => {
            tempCon.push(card);
          });
        }
        if (selectedCard[0]?.PrecededBy.length > 0) {
          selectedCard[0]?.PrecededBy.map((card: any) => {
            tempCon.push(card);
          });
        }
        if (selectedCard[0]?.Precedes.length > 0) {
          selectedCard[0]?.Precedes.map((card: any) => {
            tempCon.push(card);
          });
        }
        if (selectedCard[0]?.HasChild.length > 0) {
          selectedCard[0]?.HasChild.map((card: any) => {
            tempCon.push(card);
          });
        }
        pathwayComponentConditionCards.map((condition: any) => {
          if (condition?.TargetComponent.length > 0) {
            if (condition?.TargetComponent.includes(id)) {
              tempCon.push(condition.RowId);
            }
          }
        });
      }
      const selectedcondition = pathwayComponentConditionCards.filter(
        (card: any) => card?.RowId === id
      );
      //  console.log(selectedcondition);
      if (selectedcondition.length > 0) {
        if (selectedcondition[0]?.HasCondition.length > 0) {
          selectedcondition[0]?.HasCondition.map((card: any) => {
            tempCon.push(card);
          });
        }
        if (selectedcondition[0]?.ParentIdentifier.length > 0) {
          const comp = pathwayComponentCards.filter(
            (card: any) =>
              card?.RowId === selectedcondition[0]?.ParentIdentifier
          );
          tempCon.push(comp[0]?.CTID);
          if (comp.length == 0) {
            tempCon.push(selectedcondition[0]?.ParentIdentifier);
          }
        }
        if (selectedcondition[0]?.TargetComponent.length > 0) {
          selectedcondition[0]?.TargetComponent.map((card: any) => {
            tempCon.push(card);
          });
        }
      }
      setSelectedConnections(tempCon);
    }
  };

  useEffect(() => {
    const tempCon = [] as any;
    if (point?.start?.length > 0) {
      tempCon.push(point.start);
    }
    if (point?.end?.length > 0) {
      tempCon.push(point.end);
    }
  }, [
    point?.start,
    point?.end,
    [pathwayComponentCards],
    [updatedPathwayComponentConditionCards],
  ]);

  const confirmTheChange = (items: any, label: any) => {
    if (label == 'IsChildOf') {
      Modal.confirm({
        cancelText: 'No',
        okText: 'Yes',
        title:
          'Do you want to change the relationship from IsChildOf to Precedes?',
        onOk: () => updateToPrecededBy(items),
      });
    } else if (label == 'Precedes') {
      Modal.confirm({
        cancelText: 'No',
        okText: 'Yes',
        title:
          'Do you want to Change the relationship from Precedes to IsChildOf?',
        onOk: () => updateToHasChild(items),
      });
    }
  };

  const getColor = (item: any) => {
    if (selectedConnections != undefined) {
      if (
        selectedConnections[0].includes(item?.start) ||
        selectedConnections[0].includes(item?.end)
      ) {
        return '#00a0ff';
      }
    } else if (getLabelName(item) == undefined) {
      return '#996c48';
    } else {
      return '#0a2942';
    }
  };

  const getLabelName = (item: any) => {
    const startCard: any = _.get(
      [...pathwayComponentCards].filter(
        (card: any) => card?.CTID === item?.start
      ),
      '0'
    );
    if (startCard?.PrecededBy?.includes(item?.end)) {
      return 'Precedes';
    }
    if (startCard?.HasChild?.includes(item?.end)) {
      return 'IsChildOf';
    }
  };

  const checkIfSameColumn = (item: any) => {
    const filteredEndComponent = [
      ...pathwayComponentCards,
      ...updatedPathwayComponentConditionCards,
    ].filter(
      (card: any) =>
        _.toString(card?.CTID) === _.toString(item?.start) ||
        _.toString(card?.RowId) === _.toString(item?.start)
    );
    const filteredStartComponent = [
      ...pathwayComponentCards,
      ...updatedPathwayComponentConditionCards,
    ].filter(
      (card: any) =>
        _.toString(card?.CTID) === _.toString(item?.end) ||
        _.toString(card?.RowId) === _.toString(item?.end)
    );
    if (
      filteredEndComponent[0]?.ColumnNumber ==
        filteredStartComponent[0]?.ColumnNumber &&
      filteredEndComponent[0]?.HasProgressionLevel ==
        filteredStartComponent[0]?.HasProgressionLevel
    ) {
      return true;
    }
  };
  const checkIfSameRow = (item: any) => {
    const filteredEndComponent = [
      ...pathwayComponentCards,
      ...updatedPathwayComponentConditionCards,
    ].filter(
      (card: any) =>
        _.toString(card?.CTID) === _.toString(item?.start) ||
        _.toString(card?.RowId) === _.toString(item?.start)
    );
    const filteredStartComponent = [
      ...pathwayComponentCards,
      ...updatedPathwayComponentConditionCards,
    ].filter(
      (card: any) =>
        _.toString(card?.CTID) === _.toString(item?.end) ||
        _.toString(card?.RowId) === _.toString(item?.end)
    );
    const component = [
      ...pathwayComponentCards,
      ...updatedPathwayComponentConditionCards,
    ].filter(
      (card: any) =>
        card?.ColumnNumber < filteredEndComponent[0]?.ColumnNumber &&
        card?.ColumnNumber > filteredStartComponent[0]?.ColumnNumber &&
        card?.RowNumber == filteredEndComponent[0]?.RowNumber
    );
    const pathwayComponentColumnNumber = pathwayComponentCards
      ?.filter(
        (card: any) =>
          card.HasProgressionLevel ===
          filteredStartComponent[0]?.HasProgressionLevel
      )
      .reduce((acc: any, curr: any) => {
        if (acc >= curr.ColumnNumber) {
          return acc;
        } else {
          return curr.ColumnNumber;
        }
      }, 1);

    const conditinalComponentColumnNumber =
      updatedPathwayComponentConditionCards
        .filter(
          (card: any) =>
            card.HasProgressionLevel ===
            filteredStartComponent[0]?.HasProgressionLevel
        )
        .reduce((acc: any, curr: any) => {
          if (acc >= curr.ColumnNumber) {
            return acc;
          } else {
            return curr.ColumnNumber;
          }
        }, 1);

    const maxColumnNumberStart = Math.max(
      pathwayComponentColumnNumber,
      conditinalComponentColumnNumber
    );
    // console.log(maxColumnNumberStart);
    if (
      filteredEndComponent[0]?.RowNumber ==
        filteredStartComponent[0]?.RowNumber &&
      (filteredEndComponent[0]?.CTID ==
        pathwayComponent?.Pathway?.HasDestinationComponent ||
        filteredEndComponent[0]?.HasProgressionLevel == undefined)
    ) {
      if (filteredStartComponent[0]?.HasProgressionLevel == undefined) {
        return false;
      }
      const idList = pathwayComponent.ProgressionLevels.map(
        (item: any) => item.CTID
      );
      const indexA = idList.indexOf(
        filteredStartComponent[0]?.HasProgressionLevel
      );
      if (indexA + 1 != idList.length) {
        return true;
      } else if (
        filteredStartComponent[0].ColumnNumber != maxColumnNumberStart
      ) {
        const component2 = [
          ...pathwayComponentCards,
          ...updatedPathwayComponentConditionCards,
        ].filter(
          (card: any) =>
            filteredStartComponent[0]?.ColumnNumber > card?.ColumnNumber &&
            card?.ColumnNumber < maxColumnNumberStart &&
            card?.RowNumber == filteredEndComponent[0]?.RowNumber &&
            card?.HasProgressionLevel ==
              filteredEndComponent[0]?.HasProgressionLevel
        );
        if (component2.length > 0) {
          return true;
        }
      }
    } else if (
      filteredEndComponent[0]?.RowNumber ==
        filteredStartComponent[0]?.RowNumber &&
      filteredEndComponent[0]?.HasProgressionLevel !=
        filteredStartComponent[0]?.HasProgressionLevel
    ) {
      const idList = pathwayComponent.ProgressionLevels.map(
        (item: any) => item.CTID
      );
      const indexA = idList.indexOf(
        filteredStartComponent[0]?.HasProgressionLevel
      );
      if (
        indexA + 1 != idList.length &&
        filteredEndComponent[0].ColumnNumber != 1
      ) {
        return true;
      }
      const component2 = [
        ...pathwayComponentCards,
        ...updatedPathwayComponentConditionCards,
      ].filter(
        (card: any) =>
          filteredEndComponent[0]?.ColumnNumber > card?.ColumnNumber &&
          //(card?.ColumnNumber<= maxColumnNumberStart) &&
          card?.HasProgressionLevel ==
            filteredEndComponent[0]?.HasProgressionLevel &&
          card?.RowNumber == filteredEndComponent[0]?.RowNumber
      );
      if (component2.length > 0) {
        return true;
      }
    } else if (
      filteredEndComponent[0]?.RowNumber ==
        filteredStartComponent[0]?.RowNumber &&
      filteredEndComponent[0]?.HasProgressionLevel ==
        filteredStartComponent[0]?.HasProgressionLevel &&
      component.length > 0
    ) {
      return true;
    }
  };
  const checkiftheEndNextPlaceIsEmpty = (item: any) => {
    const filteredEndComponent = [
      ...pathwayComponentCards,
      ...updatedPathwayComponentConditionCards,
    ].filter(
      (card: any) =>
        _.toString(card?.CTID) === _.toString(item?.start) ||
        _.toString(card?.RowId) === _.toString(item?.start)
    );
    const filteredStartComponent = [
      ...pathwayComponentCards,
      ...updatedPathwayComponentConditionCards,
    ].filter(
      (card: any) =>
        _.toString(card?.CTID) === _.toString(item?.end) ||
        _.toString(card?.RowId) === _.toString(item?.end)
    );
    //console.log(filteredStartComponent);
    if (
      filteredStartComponent[0]?.HasProgressionLevel ==
        filteredEndComponent[0]?.HasProgressionLevel &&
      filteredEndComponent[0]?.CTID !==
        pathwayWrapper?.Pathway?.HasDestinationComponent
    ) {
      const component = [
        ...pathwayComponentCards,
        ...updatedPathwayComponentConditionCards,
      ].filter(
        (card: any) =>
          card?.RowNumber == filteredEndComponent[0]?.RowNumber &&
          card?.ColumnNumber > filteredStartComponent[0]?.ColumnNumber &&
          card?.ColumnNumber < filteredEndComponent[0]?.ColumnNumber
      );
      if (component.length > 0) {
        return true;
      }
    }
  };
  const checkiftheNextPlaceIsEmpty = (item: any) => {
    const filteredEndComponent = [
      ...pathwayComponentCards,
      ...updatedPathwayComponentConditionCards,
    ].filter(
      (card: any) =>
        _.toString(card?.CTID) === _.toString(item?.start) ||
        _.toString(card?.RowId) === _.toString(item?.start)
    );
    // console.log(filteredEndComponent);
    const filteredStartComponent = [
      ...pathwayComponentCards,
      ...updatedPathwayComponentConditionCards,
    ].filter(
      (card: any) =>
        _.toString(card?.CTID) === _.toString(item?.end) ||
        _.toString(card?.RowId) === _.toString(item?.end)
    );
    //console.log(filteredStartComponent);
    if (
      filteredStartComponent[0]?.HasProgressionLevel ==
        filteredEndComponent[0]?.HasProgressionLevel &&
      filteredEndComponent[0]?.CTID !==
        pathwayWrapper?.Pathway?.HasDestinationComponent
    ) {
      const component = [
        ...pathwayComponentCards,
        ...updatedPathwayComponentConditionCards,
      ].filter(
        (card: any) =>
          card?.RowNumber !== filteredStartComponent[0]?.RowNumber &&
          card?.ColumnNumber > filteredStartComponent[0]?.ColumnNumber &&
          card?.ColumnNumber < filteredEndComponent[0]?.ColumnNumber
      );
      if (component.length > 0) {
        return true;
      }
    }
  };
  const CheckIfItsGoingtoDestination = (item: any) => {
    const filteredEndComponent = [
      ...pathwayComponentCards,
      ...updatedPathwayComponentConditionCards,
    ].filter(
      (card: any) =>
        _.toString(card?.CTID) === _.toString(item?.start) ||
        _.toString(card?.RowId) === _.toString(item?.start)
    );
    const filteredStartComponent = [
      ...pathwayComponentCards,
      ...updatedPathwayComponentConditionCards,
    ].filter(
      (card: any) =>
        _.toString(card?.CTID) === _.toString(item?.end) ||
        _.toString(card?.RowId) === _.toString(item?.end)
    );
    if (
      filteredEndComponent[0]?.CTID ==
        pathwayComponent?.Pathway?.HasDestinationComponent ||
      filteredEndComponent[0]?.HasProgressionLevel == undefined
    ) {
      if (
        filteredStartComponent[0]?.HasProgressionLevel !=
          filteredEndComponent[0]?.HasProgressionLevel &&
        filteredEndComponent[0]?.ColumnNumber <= 1
      ) {
        return true;
      } else {
        return false;
      }
      //return true;
    }
  };
  const checkIfAnyCardsInTheMiddle = (item: any) => {
    const filteredStartComponent = [
      ...pathwayComponentCards,
      ...updatedPathwayComponentConditionCards,
    ].filter(
      (card: any) =>
        _.toString(card?.CTID) === _.toString(item?.end) ||
        _.toString(card?.RowId) === _.toString(item?.end)
    );
    const filteredEndComponent = [
      ...pathwayComponentCards,
      ...updatedPathwayComponentConditionCards,
    ].filter(
      (card: any) =>
        _.toString(card?.CTID) === _.toString(item?.start) ||
        _.toString(card?.RowId) === _.toString(item?.start)
    );
    if (
      filteredEndComponent[0]?.RowNumber == filteredStartComponent[0]?.RowNumber
    ) {
      if (
        filteredEndComponent[0]?.CTID ==
        pathwayComponent?.Pathway?.HasDestinationComponent
      ) {
        return true;
      } else {
        const component = [
          ...pathwayComponentCards,
          ...updatedPathwayComponentConditionCards,
        ].filter(
          (card: any) =>
            card?.ColumnNumber < filteredEndComponent[0]?.ColumnNumber &&
            card?.ColumnNumber > filteredStartComponent[0]?.ColumnNumber &&
            card?.RowNumber == filteredEndComponent[0]?.RowNumber
        );
        if (component.length > 0) {
          return false;
        } else {
          return true;
        }
      }
    }
  };
  const checkIfItsNextColumn = (item: any) => {
    const filteredStartComponent = [
      ...pathwayComponentCards,
      ...updatedPathwayComponentConditionCards,
    ].filter(
      (card: any) =>
        _.toString(card?.CTID) === _.toString(item?.end) ||
        _.toString(card?.RowId) === _.toString(item?.end)
    );
    const filteredEndComponent = [
      ...pathwayComponentCards,
      ...updatedPathwayComponentConditionCards,
    ].filter(
      (card: any) =>
        _.toString(card?.CTID) === _.toString(item?.start) ||
        _.toString(card?.RowId) === _.toString(item?.start)
    );
    if (
      filteredStartComponent[0]?.HasProgressionLevel ==
      filteredEndComponent[0]?.HasProgressionLevel
    ) {
      if (
        filteredStartComponent[0]?.ColumnNumber + 1 ===
        filteredEndComponent[0]?.ColumnNumber
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  const checkIfItsNextRow = (item: any) => {
    const filteredStartComponent = [
      ...pathwayComponentCards,
      ...updatedPathwayComponentConditionCards,
    ].filter(
      (card: any) =>
        _.toString(card?.CTID) === _.toString(item?.end) ||
        _.toString(card?.RowId) === _.toString(item?.end)
    );
    const filteredEndComponent = [
      ...pathwayComponentCards,
      ...updatedPathwayComponentConditionCards,
    ].filter(
      (card: any) =>
        _.toString(card?.CTID) === _.toString(item?.start) ||
        _.toString(card?.RowId) === _.toString(item?.start)
    );
    if (
      filteredStartComponent[0]?.HasProgressionLevel ==
        filteredEndComponent[0]?.HasProgressionLevel &&
      (filteredStartComponent[0]?.ColumnNumber + 1 ==
        filteredEndComponent[0]?.ColumnNumber ||
        filteredEndComponent[0]?.ColumnNumber + 1 ==
          filteredStartComponent[0]?.ColumnNumber)
    ) {
      return true;
    } else {
      return false;
    }
  };
  const checkIfItsNextColumnInNextPL = (item: any) => {
    const filteredStartComponent = [
      ...pathwayComponentCards,
      ...updatedPathwayComponentConditionCards,
    ].filter(
      (card: any) =>
        _.toString(card?.CTID) === _.toString(item?.end) ||
        _.toString(card?.RowId) === _.toString(item?.end)
    );
    const filteredEndComponent = [
      ...pathwayComponentCards,
      ...updatedPathwayComponentConditionCards,
    ].filter(
      (card: any) =>
        _.toString(card?.CTID) === _.toString(item?.start) ||
        _.toString(card?.RowId) === _.toString(item?.start)
    );
    if (
      filteredStartComponent[0]?.HasProgressionLevel !=
        filteredEndComponent[0]?.HasProgressionLevel &&
      filteredEndComponent[0]?.ColumnNumber == 1
    ) {
      const idList = pathwayComponent.ProgressionLevels.map(
        (item: any) => item.CTID
      );
      const indexA = idList.indexOf(
        filteredStartComponent[0]?.HasProgressionLevel
      );
      const indexB = idList.indexOf(
        filteredEndComponent[0]?.HasProgressionLevel
      );
      return Math.abs(indexA - indexB) === 1;
    } else {
      return false;
    }
  };

  const updateToHasChild = (items: any) => {
    pathwayComponentCards?.map((card: any) => {
      if (card?.CTID === items?.start) {
        const idx = card?.PrecededBy?.findIndex((i: any) => i === items?.end);
        card?.PrecededBy?.splice(idx, 1);
        if (!card?.card?.includes(items?.end)) {
          card?.HasChild?.push(items?.end);
        }
      }
      if (card?.CTID === items?.end) {
        const idx = card?.Precedes?.findIndex((i: any) => i === items?.start);
        card?.Precedes?.splice(idx, 1);
      }
    });
    setPathwayComponentCards(pathwayComponentCards);
  };

  const updateToPrecededBy = (items: any) => {
    pathwayComponentCards?.map((card: any) => {
      if (card?.CTID === items?.start) {
        const idx = card?.HasChild?.findIndex((i: any) => i === items?.end);
        card?.HasChild?.splice(idx, 1);
        if (!card?.PrecededBy?.includes(items?.end)) {
          card?.PrecededBy?.push(items?.end);
        }
      }
      if (card?.CTID === items?.end) {
        if (!card?.Precedes?.includes(items?.end)) {
          card?.Precedes?.push(items?.end);
        }
      }
    });
    setPathwayComponentCards(pathwayComponentCards);
  };

  const removeConnection = (item: any) => {
    const newarray = connection;
    const index = newarray.findIndex((items: any) => items === item);
    pathwayComponentCards?.map((card: any) => {
      const hasCondComp = updatedPathwayComponentConditionCards?.find(
        (cond: any) =>
          item?.start === (card?.CTID || card?.RowId) &&
          item?.end === (cond?.RowId || cond?.CTID)
      );
      if (hasCondComp) {
        const idx = card?.HasCondition?.findIndex((i: any) => i === item?.end);
        card?.HasCondition?.splice(idx, 1);
      }

      if (card?.CTID === item?.start && !hasCondComp) {
        const idx = card?.PrecededBy?.findIndex((i: any) => i === item?.end);
        card?.PrecededBy?.splice(idx, 1);
      }
      if (card?.CTID === item?.start && !hasCondComp) {
        const idx = card?.HasChild?.findIndex((i: any) => i === item?.end);
        card?.HasChild?.splice(idx, 1);
      }
      if (card?.CTID === item?.end && !hasCondComp) {
        const idx = card?.Precedes?.findIndex((i: any) => i === item?.start);
        card?.Precedes?.splice(idx, 1);
      }
    });

    updatedPathwayComponentConditionCards?.map((conditionCard: any) => {
      if (
        conditionCard?.CTID === item?.start ||
        conditionCard?.RowId === item?.start
      ) {
        pathwayComponentCards?.map((card: any) => {
          if (item?.end === card?.CTID || item?.end === card?.RowId) {
            const idx = conditionCard?.HasCondition.findIndex(
              (i: any) => i === item?.end
            );
            conditionCard?.HasCondition.splice(idx, 1);
            const idx2 = conditionCard?.TargetComponent.findIndex(
              (i: any) => i === item?.end
            );
            conditionCard?.TargetComponent.splice(idx2, 1);
          }
        });
      }
      const parentComponent = pathwayComponentCards?.filter(
        (card: any) => card.CTID == item.start
      );
      if (parentComponent[0]?.RowId === conditionCard?.ParentIdentifier) {
        conditionCard.ParentIdentifier = '';
      }
    });

    updatedPathwayComponentConditionCards?.map((conditionCard: any) => {
      if (
        conditionCard?.CTID === item?.start ||
        conditionCard?.RowId === item?.start
      ) {
        updatedPathwayComponentConditionCards?.map((card: any) => {
          if (item?.end === card?.RowId) {
            const idx = conditionCard?.HasCondition.findIndex(
              (i: any) => i === item?.end
            );
            conditionCard?.HasCondition.splice(idx, 1);
          }
        });
      }
      if (item?.start === conditionCard?.ParentIdentifier) {
        conditionCard.ParentIdentifier = '';
      }
    });

    newarray.splice(index, 1);
    setConnection([...newarray]);
    createConnection();
    document.getElementById(item?.start)?.classList?.remove('active');
    document.getElementById(item?.end)?.classList?.remove('active');
    setConstraintIcon(false);
    setIsViewConnectionsModalStatus(false);
  };

  const ViewConnections = (item: any) => {
    // setParentCard(item);
    const childCards = newConn.filter((card: any) => card?.end === item?.end);
    setConnectedChildCards(childCards);
    setIsViewConnectionsModalStatus(true);
  };

  const getCard = (item: any) => {
    const component = pathwayComponentCards.filter(
      (card: any) => card?.CTID == item
    );
    if (component.length == 0) {
      const condition = updatedPathwayComponentConditionCards.filter(
        (card: any) => card?.RowId == item
      );
      const test = condition.concat({
        ...condition[0],
        Type: 'ceterms:ComponentCondition',
      });
      return test[1];
    } else {
      return component[0];
    }
  };

  const getDropWrapperLayout = (column: any, index: any = 0) => {
    if (!column.semesters || !column.semesters.length) {
      // if (pathwayComponent?.Pathway?.HasProgressionModel !== undefined) {
      // }
      const columnNumber = pathwayComponentCards
        ?.filter((card: any) => card.HasProgressionLevel === column.CTID)
        .reduce((acc: any, curr: any) => {
          if (acc >= curr.ColumnNumber) {
            return acc;
          } else {
            return curr.ColumnNumber;
          }
        }, 1);
      const rowNumber = pathwayComponentCards
        ?.filter((card: any) => card.HasProgressionLevel === column.CTID)
        .reduce((acc: any, curr: any) => {
          if (acc >= curr.RowNumber) {
            return acc;
          } else {
            return curr.RowNumber;
          }
        }, 1);

      const conditinalComponentColumnNumber =
        updatedPathwayComponentConditionCards
          .filter((card: any) => card.HasProgressionLevel === column.CTID)
          .reduce((acc: any, curr: any) => {
            if (acc >= curr.ColumnNumber) {
              return acc;
            } else {
              return curr.ColumnNumber;
            }
          }, 1);
      const conditinalComponentRowNumber = updatedPathwayComponentConditionCards
        .filter((card: any) => card.HasProgressionLevel === column.CTID)
        .reduce((acc: any, curr: any) => {
          if (acc >= curr.RowNumber) {
            return acc;
          } else {
            return curr.RowNumber;
          }
        }, 1);
      const maxRowNumber = Math.max(rowNumber, conditinalComponentRowNumber);
      const destinationComponent =
        pathwayComponent?.Pathway?.HasDestinationComponent;
      {
        return (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            {Array.from(
              Array(
                Math.max(columnNumber, conditinalComponentColumnNumber) || 1
              ).keys()
            ).map((column_num: any) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  height: 'auto',
                  minHeight: '100vh',
                  flexDirection: 'column',
                  backgroundColor: `${index % 2 !== 0 ? '#f3f4f6' : '#e1e5e8'}`,
                }}
              >
                {Array.from(
                  Array(
                    maxRowNumber > 6 ? maxRowNumber + 5 : numberOfDropWrapper
                  ).keys()
                ).map((rowNumber: any, index: any) => (
                  <DropWrapper
                    id={column.id}
                    onDrop={onDropHandler}
                    setDraggableCardVisible={setDraggableCardVisible}
                    key={column.Id}
                    index={index}
                    column={column.Name}
                    number={column.number}
                    forwardRef={wrapperRef}
                    HasProgressionLevel={column.CTID}
                    CTID={column.CTID}
                    isDestinationColumnSelected={
                      column?.isDestinationColumnSelected
                    }
                    setGridMode={extraCSS}
                    destinationColumn={column?.id === 'destinationColumn'}
                    width="450px"
                    rowNumber={rowNumber + 1}
                    columnNumber={columnNumber}
                    colNumber={columnNumber || 1}
                    column_num={column_num}
                    setOverlayData={setOverlayData}
                    overlayData={overlayData}
                    updatedPathwayComponentConditionCards={
                      updatedPathwayComponentConditionCards
                    }
                    isFirstColumneSelected={column?.id === 'firstColumn'}
                    firstColumn={column?.id === 'firstColumn'}
                    isViewMode={isViewMode}
                  >
                    <div
                      style={{
                        height: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        position: 'relative',
                      }}
                    >
                      <Xwrapper>
                        {pathwayComponentCards?.length > 0 &&
                          pathwayComponentCards
                            .filter(
                              (card: any) =>
                                /* here we are mapping the pathwayComponets to respective progression level and rowNumber and columnNumber */
                                (card.CTID ===
                                  _.toString(destinationComponent) &&
                                  column?.id === 'destinationColumn' &&
                                  card.RowNumber === rowNumber + 1 &&
                                  card.ColumnNumber === column_num + 1) ||
                                (!_.isUndefined(card.HasProgressionLevel) &&
                                  !_.isUndefined(column.CTID) &&
                                  card.HasProgressionLevel === column.CTID &&
                                  card.RowNumber === rowNumber + 1 &&
                                  card.ColumnNumber === column_num + 1)
                            )
                            .concat(
                              updatedPathwayComponentConditionCards.filter(
                                (conditional_card: any) =>
                                  conditional_card.HasProgressionLevel ===
                                    column.CTID &&
                                  conditional_card.RowNumber ===
                                    rowNumber + 1 &&
                                  conditional_card.ColumnNumber ===
                                    column_num + 1
                              )
                            )
                            .map((item: any) => (
                              <>
                                {newConn.length > 0
                                  ? newConn.map((items: any, idx: number) =>
                                      checkIfAnyCardsInTheMiddle(items) ? (
                                        <Xarrow
                                          path="grid"
                                          strokeWidth={1}
                                          startAnchor={
                                            checkIfSameRow(items)
                                              ? 'bottom'
                                              : 'right'
                                          }
                                          endAnchor={
                                            checkIfSameRow(items)
                                              ? 'bottom'
                                              : 'left'
                                          }
                                          gridBreak={
                                            checkIfSameRow(items)
                                              ? '65%-35'
                                              : checkIfItsNextColumn(items)
                                              ? '50%'
                                              : CheckIfItsGoingtoDestination(
                                                  items
                                                )
                                              ? '50%'
                                              : checkIfItsNextColumnInNextPL(
                                                  items
                                                )
                                              ? '50%'
                                              : checkiftheNextPlaceIsEmpty(
                                                  items
                                                )
                                              ? checkiftheEndNextPlaceIsEmpty(
                                                  items
                                                )
                                                ? '90%-15'
                                                : '95%-15'
                                              : checkIfSameColumn(items)
                                              ? !checkIfItsNextRow(items)
                                                ? '15%-61'
                                                : '15%-15'
                                              : '15%-15'
                                          }
                                          zIndex={997}
                                          headSize={16}
                                          color="black"
                                          start={items?.end}
                                          end={items?.start}
                                          key={idx}
                                          lineColor={getColor(items)}
                                          labels={{
                                            start: (
                                              <div
                                                className={Styles.tempwrapper}
                                              >
                                                {!isViewMode && (
                                                  <span
                                                    className={
                                                      Styles.addConditionIcon
                                                    }
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={faAngleDoubleRight}
                                                      style={{
                                                        cursor: 'pointer',
                                                      }}
                                                      onClick={() =>
                                                        ViewConnections(items)
                                                      }
                                                    />
                                                  </span>
                                                )}
                                              </div>
                                            ),
                                          }}
                                        />
                                      ) : (
                                        <Xarrow
                                          path="grid"
                                          strokeWidth={1}
                                          startAnchor={
                                            checkIfSameRow(items)
                                              ? 'bottom'
                                              : checkIfSameColumn(items)
                                              ? !checkIfItsNextRow(items)
                                                ? 'right'
                                                : 'top'
                                              : 'right'
                                          }
                                          endAnchor={
                                            checkIfSameRow(items)
                                              ? 'bottom'
                                              : checkIfSameColumn(items)
                                              ? !checkIfItsNextRow(items)
                                                ? 'right'
                                                : 'bottom'
                                              : 'left'
                                          }
                                          zIndex={997}
                                          gridBreak={
                                            checkIfSameRow(items)
                                              ? '65%-35'
                                              : checkIfItsNextColumn(items)
                                              ? '50%'
                                              : CheckIfItsGoingtoDestination(
                                                  items
                                                )
                                              ? '50%'
                                              : checkIfItsNextColumnInNextPL(
                                                  items
                                                )
                                              ? '50%'
                                              : checkiftheNextPlaceIsEmpty(
                                                  items
                                                )
                                              ? checkiftheEndNextPlaceIsEmpty(
                                                  items
                                                )
                                                ? '90%-15'
                                                : '15%-15'
                                              : checkIfSameColumn(items)
                                              ? !checkIfItsNextRow(items)
                                                ? '50%-63'
                                                : '15%-15'
                                              : '15%-15'
                                          }
                                          //gridBreak= '65%-35'
                                          headSize={16}
                                          color="black"
                                          start={items?.end}
                                          end={items?.start}
                                          key={idx}
                                          lineColor={getColor(items)}
                                          labels={{
                                            start: (
                                              <div
                                                className={Styles.tempwrapper}
                                              >
                                                {!isViewMode && (
                                                  <span
                                                    className={
                                                      Styles.addConditionIcon
                                                    }
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={faAngleDoubleRight}
                                                      style={{
                                                        cursor: 'pointer',
                                                      }}
                                                      onClick={() =>
                                                        ViewConnections(items)
                                                      }
                                                    />
                                                  </span>
                                                )}
                                              </div>
                                            ),
                                          }}
                                        />
                                      )
                                    )
                                  : ''}
                                <MultiCard
                                  skipPreSelect={skipPreSelect}
                                  destinationColumnSelect={
                                    destinationColumnSelect
                                  }
                                  setDraggableCardVisible={
                                    setDraggableCardVisible
                                  }
                                  isDraggableCardVisible={
                                    isDraggableCardVisible
                                  }
                                  newConnection={newConn}
                                  constraintIcon={constraintIcon}
                                  number={column.number}
                                  forwardRef={wrapperRef}
                                  onClick={() => {
                                    setRightPanelData(item);
                                    setShowRightPanel(true);
                                  }}
                                  getEndPoints={setEndpoints}
                                  setSelected={setSelected}
                                  key={item.id}
                                  CTID={item.CTID || item.RowId}
                                  isCredentialCard={item?.Type?.toLowerCase().includes(
                                    'credential'.toLowerCase()
                                  )}
                                  isCourseCard={
                                    item?.Type?.toLowerCase().includes(
                                      'basic'.toLowerCase()
                                    ) ||
                                    item?.Type?.toLowerCase().includes(
                                      'AssessmentComponent'.toLowerCase()
                                    ) ||
                                    item?.Type?.toLowerCase().includes(
                                      'CompetencyComponent'.toLowerCase()
                                    ) ||
                                    item?.Type?.toLowerCase().includes(
                                      'CocurricularComponent'.toLowerCase()
                                    ) ||
                                    item?.Type?.toLowerCase().includes(
                                      'CocurricularComponent'.toLowerCase()
                                    ) ||
                                    item?.Type?.toLowerCase().includes(
                                      'CourseComponent'.toLowerCase()
                                    ) ||
                                    item?.Type?.toLowerCase().includes(
                                      'ExtracurricularComponent'.toLowerCase()
                                    ) ||
                                    item?.Type?.toLowerCase().includes(
                                      'JobComponent'.toLowerCase()
                                    ) ||
                                    item?.Type?.toLowerCase().includes(
                                      'WorkExperienceComponent'.toLowerCase()
                                    )
                                  }
                                  isConditionalCard={item?.Type?.toLowerCase().includes(
                                    'condition'.toLowerCase()
                                  )}
                                  isDestination={
                                    column?.id === 'destinationColumn' ||
                                    item?.Type?.toLowerCase().includes(
                                      'destination'.toLowerCase()
                                    )
                                  }
                                  data={item}
                                  setIsZoomDisabled={setIsZoomDisabled}
                                  status={column.Id}
                                  inProgressLevel={column.CTID}
                                  onSelectDragElemenet={onSelectDragElemenet}
                                  onMoveItem={onMoveItem}
                                  rowNumber={rowNumber + 1}
                                  columnNumber={column_num}
                                  HasProgressionLevel={column.CTID}
                                  onDelete={onDeleteHandler}
                                  updatedPathwayComponentConditionCards={
                                    updatedPathwayComponentConditionCards
                                  }
                                  isConditionalModalStatus={
                                    isConditionalModalStatus
                                  }
                                  setIsConditionalModalStatus={
                                    setIsConditionalModalStatus
                                  }
                                  leftpanelSelectedElem={undefined}
                                  ConstraintConditionState={false}
                                  selectedCard={IsSelected(
                                    item.CTID || item.RowId
                                  )}
                                  errorCard={IsErrorCard(item.CTID)}
                                  allComponentCardsData={allComponentCardsData}
                                  allConditionalCardsData={
                                    allConditionalCardsData
                                  }
                                  connectionsCTID={connectionsCTID}
                                  setIsConditionalEditing={
                                    setIsConditionalEditing
                                  }
                                  getComponentConditionData={
                                    getComponentConditionData
                                  }
                                  isViewMode={isViewMode}
                                />
                              </>
                            ))}
                        {!!isDestinationColumnStatus && index === 1 && (
                          <MultiCard
                            skipPreSelect={skipPreSelect}
                            onClick={() => setShowRightPanel(true)}
                            key={uuidv4()}
                            isAddDestination={
                              column?.isDestinationColumnSelected ? true : false
                            }
                            getEndPoints={setEndpoints}
                            setSelected={setSelected}
                            data={{ Type: 'addDestination' }}
                            destinationComponent={
                              column?.isDestinationColumnSelected
                            }
                            setIsZoomDisabled={setIsZoomDisabled}
                            status={column.Id}
                            inProgressLevel={column.CTID}
                            onSelectDragElemenet={onSelectDragElemenet}
                            onMoveItem={onMoveItem}
                            number={column.number}
                            forwardRef={wrapperRef}
                            leftpanelSelectedElem={leftpanelSelectedElem}
                            onDelete={onDeleteHandler}
                            rowNumber={0}
                            columnNumber={0}
                            HasProgressionLevel=""
                            ConstraintConditionState={false}
                            isViewMode={isViewMode}
                          />
                        )}
                        {!!isStartFromInitialColumnSelected &&
                          index === 1 &&
                          column?.CTID === getLastColumn('first') &&
                          pathwayComponentCards?.length <= 1 && (
                            <MultiCard
                              onClick={() => setShowRightPanel(true)}
                              key={index}
                              firstComponent={
                                column?.CTID === getLastColumn('first')
                                  ? true
                                  : false
                              }
                              getEndPoints={setEndpoints}
                              setSelected={setSelected}
                              isAddFirst={
                                column?.CTID === getLastColumn('first')
                                  ? true
                                  : false
                              }
                              data={{ Type: 'addFirst' }}
                              destinationComponent={
                                column?.isDestinationColumnSelected
                              }
                              setIsZoomDisabled={setIsZoomDisabled}
                              status={column.Id}
                              inProgressLevel={column.CTID}
                              onSelectDragElemenet={onSelectDragElemenet}
                              onMoveItem={onMoveItem}
                              number={column.number}
                              forwardRef={wrapperRef}
                              leftpanelSelectedElem={undefined}
                              rowNumber={0}
                              columnNumber={0}
                              HasProgressionLevel=""
                              ConstraintConditionState={false}
                            />
                          )}
                      </Xwrapper>
                    </div>
                  </DropWrapper>
                ))}
              </div>
            ))}
          </div>
        );
      }
    }

    return (
      <div
        style={{
          display: 'flex',
          position: 'sticky',
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

  const getLastColumn = (type: string) => {
    const ids = [] as any;
    columnsData?.map((column: any) => {
      if (!column.semesters || !column.semesters.length) {
        ids?.push(column?.CTID);
      } else {
        ids.push(...renderSemester(column?.semesters));
      }
    });
    if (type === 'last') {
      return ids[ids?.length - 2];
    } else if (type === 'first') {
      return ids[0];
    }
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
    <>
      <Layout className={Styles.centralPannel}>
        <Header
          setIsEditPathwayFormVisible={setIsEditPathwayFormVisible}
          isLeftPanelVisible={isLeftPanelVisible}
          setCollapsed={setCollapsed}
          isViewMode={isViewMode}
          extraCss={setExtraCSS}
        />
        {!!isLeftPanelVisible && (
          <Layout style={{ display: 'flex', flexDirection: 'row' }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
              <LeftPanel
                onCloseHandler={() => onCloseHandler}
                isDraggableCardVisibleMethod={(isDragTure: boolean) =>
                  setDraggableCardVisible(isDragTure)
                }
                setLeftpanelSelectedElem={setLeftpanelSelectedElem}
                onClickPreselectComponent={onClickPreselectComponent}
                pathwayComponentCards={pathwayComponentCards}
                pathwayComponentConditionCards={pathwayComponentConditionCards}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
              />
            </Sider>
            <Layout
              className="site-layout"
              style={{
                marginLeft: !collapsed ? '277px' : '0px',
              }}
            >
              {!isViewMode && (
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
              )}

              <Content className="site-layout-background">
                <TransformWrapper
                  initialScale={1}
                  disabled={isZoomDisabled}
                  centerZoomedOut={false}
                  centerOnInit={false}
                  panning={{ disabled: true }}
                  wheel={{ disabled: true }}
                >
                  {({ setTransform, resetTransform }) => (
                    <React.Fragment>
                      {isViewMode && (
                        <div className="zoom-tools">
                          <button
                            onClick={() =>
                              setTransform(1, 1, 0.5, 400, 'easeOut')
                            }
                          >
                            -
                          </button>
                        </div>
                      )}
                      <div className="zoom-tools">
                        <Button
                          type="primary"
                          text="Reset Zoom"
                          onClick={() => resetTransform()}
                        />
                      </div>

                      <TransformComponent>
                        <div style={{ display: 'flex' }}>
                          {columnsData &&
                            columnsData?.map((column: any, index: any) => (
                              <div
                                id={column.Id}
                                key={index}
                                style={{
                                  textAlign: 'center',
                                  width: 'auto',
                                  height: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    position: 'relative',
                                    top: sticky,
                                    zIndex: 1000,
                                    height: '30px',
                                    backgroundColor: `${
                                      index % 2 === 0 ? '#f0f0f0' : '#4EE5E1'
                                    }`,
                                  }}
                                  className={Styles.sticky}
                                >
                                  <span
                                    style={{
                                      color: '#000000',
                                      fontSize: '15px',
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
                    </React.Fragment>
                  )}
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
        {showRightPanelEdit && (
          <EditComponent
            visible={showRightPanelEdit}
            onCloseHandler={(value: boolean) => setShowRightPanelEdit(value)}
            panelData={rightPanelData}
            isViewMode={isViewMode}
          />
        )}
      </Layout>
      {(isConditionalModalStatus || isConditionalEditing) && (
        <Modal
          width="80vw"
          visible={isConditionalModalStatus || isConditionalEditing}
          title=""
          footer={[]}
          onCancel={() => {
            setIsConditionalModalStatus(false);
            setIsConditionalEditing(false);
          }}
        >
          <AddConditionalComponent
            visibleConstraintConditionProp={setIsConditionalModalStatus}
            setIsConditionalModalStatus={setIsConditionalModalStatus}
            allComponentCardsData={allComponentCardsData}
            allConditionalCardsData={allConditionalCardsData}
            connectionsCTID={connectionsCTID}
            updatedPathwayComponentConditionCards={
              updatedPathwayComponentConditionCards
            }
            isConditionalEditing={isConditionalEditing}
            setIsConditionalEditing={setIsConditionalEditing}
            progressionLevelForAddComponent={progressionLevelForAddComponent}
            data={
              isConditionalEditing ? componentConditionData : currentCardData
            }
            isViewMode={isViewMode}
          />
        </Modal>
      )}
      {isViewConnectionsModalStatus && (
        <Modal
          width="20vw"
          visible={isViewConnectionsModalStatus}
          title=""
          footer={[]}
          onCancel={() => {
            setIsViewConnectionsModalStatus(false);
          }}
        >
          {connectedChildCards.length > 0
            ? connectedChildCards.map((items: any, idx: number) => (
                <div className="container" key={idx}>
                  <Row>
                    <Col xs={24}>
                      <p> Connection {idx + 1}</p>
                      <Row>
                        <Col xs={4}>
                          <svg width="100" height="50">
                            <path
                              d="M 10 25 L 70 25 M 70 25 L 55 10 M 70 25 L 55 40"
                              fill="none"
                              stroke="black"
                              strokeWidth="2"
                            />
                          </svg>
                        </Col>
                        <Col xs={2}>
                          {!isViewMode && (
                            <span className={Styles.addConditionIcon}>
                              <FontAwesomeIcon
                                icon={faCirclePlus}
                                fill="#000000"
                                style={{
                                  height: '22px',
                                  width: '22px',
                                  color: '#ffb90b',
                                  cursor: 'pointer',
                                }}
                                onClick={(e: any) => {
                                  onPlusClickHandler(e, items);
                                }}
                              />
                            </span>
                          )}
                        </Col>
                        <Col xs={2}>
                          {getLabelName(items) != undefined ? (
                            !isViewMode && (
                              <span className={Styles.addConditionIcon}>
                                <FontAwesomeIcon
                                  icon={faLink}
                                  size="sm"
                                  fill="#ffb90b"
                                  style={{
                                    borderRadius: 50,
                                    height: '24px',
                                    width: '24px',
                                    color: '#000000',
                                    cursor: 'pointer',
                                    background: '#ffb90b',
                                  }}
                                  onClick={() =>
                                    confirmTheChange(items, getLabelName(items))
                                  }
                                />
                              </span>
                            )
                          ) : (
                            <svg width="100" height="50">
                              <path
                                d="M 10 25 L 70 25 M 70 25 L 55 10 M 70 25 L 55 40"
                                fill="none"
                                stroke="black"
                                strokeWidth="2"
                              />
                            </svg>
                          )}
                        </Col>
                        <Col xs={2}>
                          <span style={{ fontSize: 10 }}>
                            {' '}
                            {getLabelName(items)}{' '}
                          </span>
                        </Col>
                        <Col xs={12}>
                          {/* {getCard(items?.start)} */}
                          <CardWithLeftIcon
                            isComponentTab={true}
                            draggable={true}
                            data={getCard(items?.start)}
                          />
                        </Col>
                        <Col xs={2}>
                          {!isViewMode && (
                            <span className={Styles.addConditionIcon}>
                              <FontAwesomeIcon
                                icon={faXmarkCircle}
                                style={{ cursor: 'pointer' }}
                                onClick={() => removeConnection(items)}
                              />
                            </span>
                          )}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
              ))
            : ''}
        </Modal>
      )}
    </>
  );
};

export default React.memo(HomePage);
