import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faCirclePlus,
  faXmarkCircle,
  faLink,
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
import { getLeftPanelPathwayComponentRequest } from '../../components/leftPanel/state/actions';
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
  const [dragElem, setDragElem] = useState<any>();
  const [leftpanelSelectedElem, setLeftpanelSelectedElem] =
    useState<HTMLElement>();
  // const [sticky, setsticky] = useState<any>();

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
  const [
    updatedPathwayComponentConditionCards,
    setUpdatedPathwayComponentConditionCards,
  ] = useState<any>([]);
  const [generatedUuid, setGeneratedUuid] = useState<any>({
    destinationCTID: '',
    firstStageCTID: '',
  });
  const [connectionsCTID, setConnectionsCTID] = useState<any>();
  const [allComponentCardsData, setAllComponentCardData] = useState<any>({});
  const [allConditionalCardsData, setAllConditionalCardData] = useState<any>(
    {}
  );
  //const [allcards,setallcards]=useState<any>({});
  const [isConditionalEditing, setIsConditionalEditing] = useState(false);
  const [componentConditionData, setComponentConditionData] = useState(false);
  const [currentCardData, setCurrentCardData] = useState<any>();
  const [progressionLevelForAddComponent, setProgressionLevelForAddComponent] =
    useState<string>('');
  useEffect(() => {
    dispatch(getLeftPanelPathwayComponentRequest());
  }, []);
  useEffect(() => {
    if (isViewMode) {
      setCollapsed(true);
    }
  }, []);

  useEffect(() => {
    const updatedConditionalComponents: any = [];
    // setNewConn([]);
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
    setIsStartFromInitialColumnSelected(false);
    if (newConn.length == 0) {
      setNewConn([]);
      createConnection();
    } else {
      createConnection();
    }
  }, [pathwayComponentConditionCards]);

  const getComponentConditionData = (data: any) => {
    setComponentConditionData(data);
  };

  const [overlayData, setOverlayData] = useState<any>({
    columnNumber: 0,
    rowNumber: 0,
    CTID: '',
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
  }, [pathwayComponentCards]);

  const onPlusClickHandler = (event: any, connections: any) => {
    event.stopPropagation();
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
    setProgressionLevelForAddComponent(
      _.get(filteredEndComponent, '0')?.HasProgressionLevel
    );
  };
  useEffect(() => {
    const updatedCards = pathwayWrapper.mappedData.PathwayComponents.map(
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
      setNewConn([]);

      if (pathwayComponent?.ComponentConditions?.length > -1) {
        setPathwayComponentConditionCards(
          pathwayComponent.ComponentConditions.map((card: any) => ({
            ...card,
            Type: 'conditional',
          }))
        );
      }
      setPathwayComponentCards(pathwayComponent?.PathwayComponents);

      const pathwayModel =
        pathwayComponent?.Pathway?.HasProgressionModel?.length > 0;
      let count = 0;
      if (pathwayModel) {
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
          setPathwayComponentConditionCards(updatedConditionCards);
        }
      }
    }
  }, [pathwayComponent, isDestinationColumnStatus]);

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
    if (updatedPathwayWrapper?.PendingComponents !== undefined) {
      const filteredpending = updatedPathwayWrapper.PendingComponents.filter(
        (item: any) => item.CTID !== card.CTID
      );
      updatedPathwayWrapper.PendingComponents = filteredpending;
    }

    dispatch(updateMappedDataRequest(updatedPathwayWrapper));
    if (!destinationColumn) {
      card.destinationColumn = false;
    }
    if (card?.Type == 'ceterms:ComponentCondition' && card?.CTID !== null) {
      card.CTID = null;
    }
    setDraggableCardVisible(false);
    const { isPendingCards, isComponentTab, ...restCardProps } = card;

    //setNewConn([]);
    const isDestinationCardExist =
      !_.isEmpty(pathwayComponent.Pathway.HasDestinationComponent) &&
      updatedPathwayWrapper?.Pathway?.HasDestinationComponent !== '';

    if (isComponentTab) {
      card = {
        HasProgressionLevel,
        RowNumber,
        ColumnNumber: ColumnNumber - 1,
      };
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
        const updatedCards = updatedPathwayComponentConditionCards
          .filter((item: any) => item?.RowId !== card?.RowId)
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
        updatedPathwayWrapper.PathwayComponents = pathwayComponentCards
          .filter((component_card: any) => component_card?.CTID !== card?.CTID)
          .concat({
            ...restCardProps,
            destinationColumn: false,
            HasProgressionLevel,
            RowNumber,
            ColumnNumber: maxColumnNumber + 1,
            firstColumn,
          });
        dispatch(updateMappedDataRequest(updatedPathwayWrapper));
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
      const updatedPathwayWrapper = { ...pathwayComponent };
      const updatedCards = updatedPathwayComponentConditionCards
        .filter((item: any) => item?.RowId !== card.RowId)
        .concat({
          ...restCardProps,
          RowNumber,
          HasProgressionLevel,
          ColumnNumber,
        });
      setUpdatedPathwayComponentConditionCards(updatedCards);
      updatedPathwayWrapper.ComponentConditions = updatedCards;
      dispatch(updateMappedDataRequest(updatedPathwayWrapper));
      if (
        card.HasProgressionLevel !== undefined &&
        card.ColumnNumber > ColumnNumber
      ) {
        const cardsIntheSameColumn =
          updatedPathwayWrapper.PathwayComponents.filter(
            (item: any) =>
              item.HasProgressionLevel === card.HasProgressionLevel &&
              item.ColumnNumber === card.ColumnNumber &&
              item.CTID !== card.CTID &&
              item.CTID !==
                updatedPathwayWrapper.Pathway.HasDestinationComponent
          );
        const conditionsIntheSameColumn =
          updatedPathwayWrapper.ComponentConditions.filter(
            (item: any) =>
              item.HasProgressionLevel === card.HasProgressionLevel &&
              item.ColumnNumber === card.ColumnNumber &&
              item.RowId !== card.RowId
          );
        if (
          (cardsIntheSameColumn.length == 0 ||
            cardsIntheSameColumn === undefined) &&
          (conditionsIntheSameColumn.length == 0 ||
            conditionsIntheSameColumn === undefined)
        ) {
          const cardsintheprogressionlevel =
            updatedPathwayWrapper.PathwayComponents.filter(
              (item: any) =>
                item.HasProgressionLevel === card.HasProgressionLevel &&
                item.CTID !== card.CTID &&
                item.CTID !==
                  updatedPathwayWrapper.Pathway.HasDestinationComponent
            );
          const updatedProgressionlevelCards = cardsintheprogressionlevel.map(
            (item: any) => ({
              ...item,
              ColumnNumber:
                item.ColumnNumber > card.ColumnNumber
                  ? item.ColumnNumber - 1
                  : item.ColumnNumber,
            })
          );
          const updatedList1 = updatedPathwayWrapper.PathwayComponents.map(
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
          updatedPathwayWrapper.PathwayComponents = updatedList1;
          const conditionsintheprogressionlevel =
            updatedPathwayWrapper.ComponentConditions.filter(
              (item: any) =>
                item.HasProgressionLevel === card.HasProgressionLevel &&
                item.RowId !== card.RowId
            );
          const updatedProgressionlevelConditions =
            conditionsintheprogressionlevel.map((item: any) => ({
              ...item,
              ColumnNumber:
                item.ColumnNumber > card.ColumnNumber
                  ? item.ColumnNumber - 1
                  : item.ColumnNumber,
            }));
          const updatedListConditions =
            updatedPathwayWrapper.ComponentConditions.map((item1: any) => {
              const matchingItem2 = updatedProgressionlevelConditions.find(
                (item2: any) => item2.RowId === item1.RowId
              );
              if (matchingItem2) {
                return { ...item1, ...matchingItem2 };
              }
              return item1;
            });
          updatedPathwayWrapper.ComponentConditions = updatedListConditions;
          dispatch(updateMappedDataRequest(updatedPathwayWrapper));
        }
      }
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
      updatedPathwayWrapper.Pathway = updatedPathway;
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
        updatedPathwayWrapper.PathwayComponents = pathwayComponentCards
          .filter((item: any) => item.CTID !== card.CTID)
          .concat({
            ...restCardProps,
            HasProgressionLevel,
            RowNumber,
            ColumnNumber,
            firstColumn,
          });
        if (updatedPathwayWrapper?.PendingComponents != undefined) {
          const filteredpending =
            updatedPathwayWrapper.PendingComponents.filter(
              (item: any) => item.CTID !== card.CTID
            );
          updatedPathwayWrapper.PendingComponents = filteredpending;
        }
        dispatch(updateMappedDataRequest(updatedPathwayWrapper));
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
    if (data.HasProgressionLevel !== '') {
      const cardsIntheSameColumn = updatedPathwayComponent.filter(
        (item: any) =>
          item.HasProgressionLevel === data.HasProgressionLevel &&
          item.ColumnNumber === data.ColumnNumber &&
          item.CTID !== data.CTID &&
          item.CTID !== updatedPathwayWrapper.Pathway.HasDestinationComponent
      );
      const conditionsIntheSameColumn =
        updatedPathwayWrapper.ComponentConditions.filter(
          (item: any) =>
            item.HasProgressionLevel === data.HasProgressionLevel &&
            item.ColumnNumber === data.ColumnNumber &&
            item.RowId !== data.RowId
        );
      if (
        (cardsIntheSameColumn.length == 0 ||
          cardsIntheSameColumn === undefined) &&
        (conditionsIntheSameColumn.length == 0 ||
          conditionsIntheSameColumn === undefined)
      ) {
        const cardsintheprogressionlevel = updatedPathwayComponent.filter(
          (item: any) =>
            item.HasProgressionLevel === data.HasProgressionLevel &&
            item.CTID !== data.CTID &&
            item.CTID !== updatedPathwayWrapper.Pathway.HasDestinationComponent
        );
        const updatedProgressionlevelCards = cardsintheprogressionlevel.map(
          (item: any) => ({
            ...item,
            ColumnNumber:
              item.ColumnNumber > data.ColumnNumber
                ? item.ColumnNumber - 1
                : item.ColumnNumber,
          })
        );
        const updatedList1 = updatedPathwayComponent.map((item1: any) => {
          const matchingItem2 = updatedProgressionlevelCards.find(
            (item2) => item2.CTID === item1.CTID
          );
          if (matchingItem2) {
            return { ...item1, ...matchingItem2 };
          }
          return item1;
        });
        updatedPathwayWrapper.PathwayComponents = updatedList1;
        const conditionsintheprogressionlevel =
          updatedPathwayWrapper.ComponentConditions.filter(
            (item: any) =>
              item.HasProgressionLevel === data.HasProgressionLevel &&
              item.RowId !== data.RowId
          );
        const updatedProgressionlevelConditions =
          conditionsintheprogressionlevel.map((item: any) => ({
            ...item,
            ColumnNumber:
              item.ColumnNumber > data.ColumnNumber
                ? item.ColumnNumber - 1
                : item.ColumnNumber,
          }));
        const updatedListConditions =
          updatedPathwayWrapper.ComponentConditions.map((item1: any) => {
            const matchingItem2 = updatedProgressionlevelConditions.find(
              (item2: any) => item2.RowId === item1.RowId
            );
            if (matchingItem2) {
              return { ...item1, ...matchingItem2 };
            }
            return item1;
          });
        updatedPathwayWrapper.ComponentConditions = updatedListConditions;
      }
    }

    dispatch(updateMappedDataRequest(updatedPathwayWrapper));
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
    }
  };

  const createConnection = () => {
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
  };
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
    if (getLabelName(item) == undefined) {
      return '#ffd263';
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
          } else {
            const idx = conditionCard?.TargetComponent.findIndex(
              (i: any) => i === item?.end
            );
            conditionCard?.TargetComponent.splice(idx, 1);
          }
        });
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
    });

    newarray.splice(index, 1);
    setConnection([...newarray]);
    createConnection();
    document.getElementById(item?.start)?.classList?.remove('active');
    document.getElementById(item?.end)?.classList?.remove('active');
    setConstraintIcon(false);
  };

  const getDropWrapperLayout = (column: any, index: any = 0) => {
    if (!column.semesters || !column.semesters.length) {
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
                                  ? newConn.map((items: any, idx: number) => (
                                      <Xarrow
                                        path="grid"
                                        strokeWidth={1}
                                        startAnchor="right"
                                        endAnchor="left"
                                        zIndex={997}
                                        headSize={16}
                                        color="black"
                                        start={items?.end}
                                        end={items?.start}
                                        key={idx}
                                        lineColor={getColor(items)}
                                        labels={{
                                          start: (
                                            <div className={Styles.tempwrapper}>
                                              {!isViewMode && (
                                                <span
                                                  className={
                                                    Styles.addConditionIcon
                                                  }
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faXmarkCircle}
                                                    style={{
                                                      cursor: 'pointer',
                                                    }}
                                                    onClick={() =>
                                                      removeConnection(items)
                                                    }
                                                  />
                                                </span>
                                              )}
                                              {!isViewMode && (
                                                <span
                                                  className={
                                                    Styles.addConditionIcon
                                                  }
                                                >
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
                                                      onPlusClickHandler(
                                                        e,
                                                        items
                                                      );
                                                    }}
                                                  />
                                                </span>
                                              )}
                                              {getLabelName(items) != undefined
                                                ? !isViewMode && (
                                                    <span
                                                      className={
                                                        Styles.addConditionIcon
                                                      }
                                                    >
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
                                                          confirmTheChange(
                                                            items,
                                                            getLabelName(items)
                                                          )
                                                        }
                                                      />
                                                    </span>
                                                  )
                                                : ''}

                                              <span
                                                style={{
                                                  textAlign: 'right',
                                                  fontSize: 8,
                                                }}
                                              >
                                                {getLabelName(items)}
                                              </span>
                                            </div>
                                          ),
                                        }}
                                      />
                                    ))
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
          isViewMode={isViewMode}
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
                          <button onClick={() => resetTransform()}>x</button>
                        </div>
                      )}
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
                                    zIndex: 10,
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
    </>
  );
};

export default HomePage;
