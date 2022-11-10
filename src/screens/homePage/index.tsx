import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faCirclePlus,
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
import Modal from '../../components/modal';
import MultiCard from '../../components/multiCards';
import RightPanel from '../../components/rightPanel';
import {
  saveDataForPathwayRequest,
  updateMappedDataRequest,
} from '../../states/actions';
import AddConditionalComponent from '../addComponent';

import Styles from './index.module.scss';

interface Props {
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
}
const HomePage: React.FC<Props> = ({
  isLeftPanelVisible,
  setIsEditPathwayFormVisible,
  isDestinationColumnStatus,
  onClickPreselectComponent,
  isStartFromInitialColumnSelected,
  setIsStartFromInitialColumnSelected,
  setIsDestinationColumnSelected,
  skipPreSelect,
  destinationColumnSelect,
  // isEditPathwayFormVisible,
  setIsDropCardAfterEditingForm,
  isDropCardAfterEditingForm,
}) => {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [pathwayComponentCards, setPathwayComponentCards] = useState<any>([]);
  const [deletedComponentCards, setDeletedComponentCards] = useState<any>([]);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [isZoomDisabled, setIsZoomDisabled] = useState(false);

  const [isDraggableCardVisible, setDraggableCardVisible] = useState(false);
  const [columnsData, setColumnsData] = useState<any>([]);

  const pathwayWrapper = useSelector((state: any) => state.initalReducer);
  const [rightPanelData, setRightPanelData] = useState({});
  const [dragElem, setDragElem] = useState<any>();
  const [leftpanelSelectedElem, setLeftpanelSelectedElem] =
    useState<HTMLElement>();

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
  const [isConditionalEditing, setIsConditionalEditing] = useState(false);
  const [progressionLevelForAddComponent, setProgressionLevelForAddComponent] =
    useState<string>('');
  useEffect(() => {
    const updatedConditionalComponents: any = [];

    pathwayComponentConditionCards.map((conditionalCard: any) => {
      if (_.isUndefined(conditionalCard?.HasProgressionLevel)) {
        conditionalCard?.TargetComponent?.forEach((target: any) => {
          [...pathwayComponentCards, ...pathwayComponentConditionCards].forEach(
            (pathway_card: any) => {
              if (
                pathway_card.CTID === target ||
                pathway_card.RowId === target
              ) {
                updatedConditionalComponents.push({
                  ...conditionalCard,
                  HasProgressionLevel: pathway_card.HasProgressionLevel,
                });
              }
            }
          );
        });
      } else {
        updatedConditionalComponents.push({
          ...conditionalCard,
        });
      }
    });

    pathwayComponentConditionCards.map((conditional_comp: any) => {
      const obj: any = {};
      obj[conditional_comp.RowId] = {
        ...conditional_comp,
      };
      setAllConditionalCardData({ ...allConditionalCardsData, ...obj });
      return conditional_comp;
    });
    setUpdatedPathwayComponentConditionCards(updatedConditionalComponents);
    setIsStartFromInitialColumnSelected(false);
    createConnection();
  }, [pathwayComponentConditionCards]);

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
    createConnection();
  }, []);

  let count = 0;
  useEffect(() => {
    const updatedPathwayWrapper = { ...pathwayComponent };
    updatedPathwayWrapper.PathwayComponents = pathwayComponentCards;
    updatedPathwayWrapper.DeletedComponents = deletedComponentCards;
    dispatch(updateMappedDataRequest(updatedPathwayWrapper));

    setDeletedComponentCards([]);
    pathwayComponentCards?.length > 0 &&
      setIsStartFromInitialColumnSelected(false),
      setIsDestinationColumnSelected(false);
  }, [pathwayComponentCards]);

  const onPlusClickHandler = (event: any, connections: any) => {
    event.stopPropagation();
    setIsConditionalModalStatus(true);
    setConnectionsCTID(connections);

    const filteredEndComponent = [
      ...pathwayComponentCards,
      ...updatedPathwayComponentConditionCards,
    ].filter(
      (card: any) =>
        _.toString(card?.CTID) === _.toString(connections?.end) ||
        _.toString(card?.RowId) === _.toString(connections?.end)
    );
    setProgressionLevelForAddComponent(
      _.get(filteredEndComponent, '0')?.HasProgressionLevel
    );
  };

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

  useEffect(() => {
    if (pathwayComponent) {
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
          { Id: 0, Name: 'Stage 1', CTID: generatedUuid.firstStageCTID },
          {
            isDestinationColumnSelected: isDestinationColumnStatus,
            Id: 1,
            id: 'destinationColumn',
            Name: 'Destination Component',
            Narrower: null,
          },
        ]);
      }
    }
    // createConnection();
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

    // const PendingComponents = updatedPathwayWrapper?.PendingComponents && [...updatedPathwayWrapper?.PendingComponents];
    // updatedPathwayWrapper.PendingComponents =
    //   updatedPathwayWrapper?.PendingComponents?.filter(
    //     (pending_components: any) => pending_components?.CTID !== card?.CTID
    //   );
    // dispatch(updateMappedDataRequest(updatedPathwayWrapper));

    if (!destinationColumn) {
      card.destinationColumn = false;
    }
    setDraggableCardVisible(false);
    const { isPendingCards, isComponentTab, ...restCardProps } = card;
    // removeConnection(card?.CTID || card?.RowId);
    setNewConn([]);
    const isDestinationCardExist =
      !_.isEmpty(pathwayComponent.Pathway.HasDestinationComponent) &&
      updatedPathwayWrapper?.Pathway?.HasDestinationComponent !== '';

    if (isComponentTab) {
      card = {
        // ...createCard(card),
        HasProgressionLevel,
        RowNumber,
        ColumnNumber: ColumnNumber - 1,
      };
    }

    if (columnNumberEsixt && !isPendingCards) {
      // console.log('columnNumberEsixt && !isPendingCards');
      /* 
        this block is to prevent to create a new column when we overlap pathwayComponent inside gameboard
      */
      return;
    }
    if (card?.Type === 'conditional') {
      console.log('card?.Type === conditional');

      /* This Function add only conditional cards*/
      setUpdatedPathwayComponentConditionCards(
        updatedPathwayComponentConditionCards
          .filter((item: any) => item.RowId !== card.RowId)
          .concat({
            ...card,
            RowNumber,
            ColumnNumber,
          })
      );
      return;
    }
    if (
      card.HasProgressionLevel === HasProgressionLevel &&
      card.ColumnNumber === ColumnNumber &&
      card.RowNumber === RowNumber
    ) {
      console.log('card ---5');

      /* To prevent overlapping, If we overlap the existing card over each other in Gameboard*/
      return;
    }

    if (!destinationColumn && isDestinationCardExist) {
      console.log('!destinationColumn && isDestinationCardExist');

      const updatedPathway = { ...updatedPathwayWrapper.Pathway };
      updatedPathway.HasDestinationComponent = '';
      updatedPathwayWrapper.Pathway = updatedPathway;
      dispatch(updateMappedDataRequest(updatedPathwayWrapper));
    }

    if (!!destinationColumn && !isDestinationCardExist) {
      console.log('!!destinationColumn && !isDestinationCardExist');
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

      const obj: any = {};
      obj[card.CTID] = {
        ...card,
        RowNumber,
        ColumnNumber: 1,
        HasProgressionLevel,
        destinationColumn,
      };
      setAllComponentCardData({ ...allComponentCardsData, ...obj });

      setPathwayComponentCards(updatedPathwayComponent);
      const updatedPathway = { ...updatedPathwayWrapper.Pathway };
      updatedPathway.HasDestinationComponent = card?.CTID;
      updatedPathwayWrapper.Pathway = updatedPathway;
      updatedPathwayWrapper.PathwayComponents = updatedPathwayComponent;
      dispatch(updateMappedDataRequest(updatedPathwayWrapper));
      dispatch(saveDataForPathwayRequest(updatedPathwayWrapper));
      return;
    }
    if (!!destinationColumn && isDestinationCardExist) {
      /*  Prevent to drop multiple destination cards inside destination component*/

      console.log('!!destinationColumn && isDestinationCardExist');
      const isCardAlreadyInDestinationColumn = pathwayComponentCards.filter(
        (component_card: any) =>
          component_card.CTID == card.CTID &&
          component_card.destinationColumn === true
      );

      if (isCardAlreadyInDestinationColumn) {
        console.log('isCardAlreadyInDestinationColumn');

        const updatedPathwayComponent =
          updatedPathwayWrapper?.PathwayComponents?.filter(
            (pathway_component: any) => pathway_component?.CTID !== card?.CTID
          ).concat({
            ...restCardProps,
            RowNumber,
            firstColumn,
          });
        const obj: any = {};
        obj[card.CTID] = {
          ...card,
          RowNumber,
          ColumnNumber: 1,
          HasProgressionLevel,
          destinationColumn,
        };
        setAllComponentCardData({ ...allComponentCardsData, ...obj });
        setPathwayComponentCards(updatedPathwayComponent);
      }

      return;
    }
    const islastDropWrapperUsed = pathwayComponentCards.some(
      (card: any) => card.RowNumber === numberOfDropWrapper
    );

    if (islastDropWrapperUsed) {
      /* here we are increasing number of DropWrapper */
      setNumberOfDropWrapper((prevState) => prevState + 1);
    }

    if (isDropCardAfterEditingForm) {
      const obj: any = {};
      obj[card.CTID] = {
        ...card,
        RowNumber,
        ColumnNumber: 1,
        HasProgressionLevel,
        destinationColumn,
      };
      setAllComponentCardData({ ...allComponentCardsData, ...obj });
      setPathwayComponentCards([
        ...pathwayComponentCards,
        {
          ...restCardProps,
          destinationColumn,
          HasProgressionLevel,
          RowNumber,
          ColumnNumber: 1,

          firstColumn,
        },
      ]);
      setIsDropCardAfterEditingForm(false);
      return;
    }

    if (
      pathwayComponentCards.length === 0 &&
      isStartFromInitialColumnSelected &&
      isFirstColumneSelected
    ) {
      const obj: any = {};
      obj[card.CTID] = {
        ...card,
        RowNumber,
        ColumnNumber: 1,
        HasProgressionLevel,
        destinationColumn,
      };
      setAllComponentCardData({ ...allComponentCardsData, ...obj });
      setPathwayComponentCards([
        ...pathwayComponentCards,
        {
          ...restCardProps,
          destinationColumn: false,
          HasProgressionLevel,
          RowNumber,
          ColumnNumber: 1,

          firstColumn,
        },
      ]);
    } else if (
      pathwayComponentCards.length === 0 &&
      isDestinationColumnSelected &&
      isDestinationColumnStatus
    ) {
      const obj: any = {};
      obj[card.CTID] = {
        ...card,
        RowNumber,
        ColumnNumber: 1,
        HasProgressionLevel,
        destinationColumn,
      };
      setAllComponentCardData({ ...allComponentCardsData, ...obj });
      setPathwayComponentCards([
        ...pathwayComponentCards,
        {
          ...restCardProps,
          destinationColumn,
          HasProgressionLevel,
          RowNumber,
          ColumnNumber: 1,
          firstColumn,
        },
      ]);
    } else if (card?.pathwayGameboardCard) {
      // console.log('card ---8');
      const obj: any = {};
      obj[card.CTID] = {
        ...card,
        RowNumber,
        ColumnNumber: 1,
        HasProgressionLevel,
        destinationColumn,
      };
      setAllComponentCardData({ ...allComponentCardsData, ...obj });
      setPathwayComponentCards(
        pathwayComponentCards
          .filter((item: any) => item.CTID !== card.CTID)
          .concat({
            ...restCardProps,
            HasProgressionLevel,
            RowNumber,
            ColumnNumber,
            firstColumn,
          })
      );
    } else if (pathwayComponentCards.length !== 0) {
      const obj: any = {};
      obj[card.CTID] = {
        ...card,
        RowNumber,
        ColumnNumber,
        HasProgressionLevel,
      };
      setAllComponentCardData({ ...allComponentCardsData, ...obj });
      setPathwayComponentCards(
        pathwayComponentCards
          .filter((item: any) => item.CTID !== card.CTID)
          .concat({
            ...restCardProps,
            HasProgressionLevel,
            RowNumber,
            ColumnNumber,
            firstColumn,
          })
      );
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
    // createConnection();
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
    if (data?.HasCondition.length > 0) {
      const existConditionalCard: any = [];
      data?.HasCondition?.forEach((condition: any) =>
        updatedPathwayComponentConditionCards?.forEach((item: any) => {
          if (item?.RowId === condition) {
            return existConditionalCard.push(item);
          }
        })
      );

      const filteredConditionalComponent =
        updatedPathwayComponentConditionCards.filter((card: any) =>
          existConditionalCard.some(
            (exist_card: any) => exist_card?.RowId !== card?.RowId
          )
        );
      let updatedConditionalCard: any = [];
      existConditionalCard.forEach((exist_card: any) => {
        if (exist_card?.HasCondition.length > 0) {
          const updatedFilteredConditionalCard =
            filteredConditionalComponent.map((card: any) => {
              if (exist_card?.HasCondition.includes(card.RowId)) {
                return { ...card, ParentIdentifier: '' };
              } else {
                return card;
              }
            });
          updatedConditionalCard = updatedFilteredConditionalCard;
        }
      });

      let updatedPathwayComponent: [] = [];
      if (data?.Type === 'conditional') {
        updatedPathwayComponent = updatedPathwayWrapper.PathwayComponents =
          pathwayComponentCards.map((item: any) =>
            data?.ParentIdentifier === item?.CTID
              ? { ...item, HasCondition: [], PrecededBy: data?.TargetComponent }
              : item
          );
      } else {
        updatedPathwayComponent = pathwayComponentCards.filter(
          (item: any) => item.CTID !== data.CTID
        );
      }
      updatedPathwayWrapper.ComponentConditions = updatedConditionalCard;
      updatedPathwayWrapper.PathwayComponents = updatedPathwayComponent;
      dispatch(updateMappedDataRequest(updatedPathwayWrapper));
      dispatch(saveDataForPathwayRequest(updatedPathwayWrapper));
    } else {
      let updatedPathwayComponent: [] = [];
      if (data?.Type === 'conditional') {
        updatedPathwayComponent = pathwayComponentCards.map(
          (pathway_card: any) => {
            if (data?.ParentIdentifier === pathway_card?.CTID) {
              return {
                ...pathway_card,
                HasCondition: pathway_card?.HasCondition.filter(
                  (condition: any) => condition !== data?.RowId
                ),
              };
            } else {
              return { ...pathway_card };
            }
          }
        );
      } else {
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
            } else {
              return { ...component_card };
            }
          });
      }

      const updatedConditionalComponent = updatedPathwayComponentConditionCards
        .filter(
          (conditional_card: any) => conditional_card?.RowId !== data?.RowId
        )
        .map((conditional_card: any) => {
          if (conditional_card?.TargetComponent.includes(data?.CTID)) {
            return {
              ...conditional_card,
              TargetComponent: conditional_card?.TargetComponent.filter(
                (target: any) => target !== data?.CTID
              ),
            };
          } else if (data?.ParentIdentifier === conditional_card?.RowId) {
            return {
              ...conditional_card,
              HasCondition: conditional_card?.HasCondition.filter(
                (condition: any) => condition !== data?.RowId
              ),
            };
          } else {
            return { ...conditional_card };
          }
        });

      updatedPathwayWrapper.ComponentConditions = updatedConditionalComponent;
      updatedPathwayWrapper.PathwayComponents = updatedPathwayComponent;
      dispatch(updateMappedDataRequest(updatedPathwayWrapper));
      dispatch(saveDataForPathwayRequest(updatedPathwayWrapper));
    }
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
      setNewConn([
        ...newConn,
        {
          start: point.start,
          end: id,
        },
      ]);
      pathwayComponentCards?.map((card: any) => {
        if (point?.start === card?.CTID) {
          if (!card?.PrecededBy?.includes(id)) {
            card?.PrecededBy.push(id);
          }
        }
      });
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

  const createConnection = () => {
    const tempCon = [] as any;
    if (pathwayComponentCards) {
      pathwayComponentCards?.map((card: any) => {
        if (card?.PrecededBy?.length > 0) {
          card?.PrecededBy?.map((child: string) => {
            tempCon.push({ start: card?.CTID || card?.RowId, end: child });
          });
        }

        if (card?.HasCondition?.length > 0) {
          card?.HasCondition?.map((condition: string) => {
            tempCon?.push({ start: card?.CTID || card?.RowId, end: condition });
          });
        }

        if (pathwayComponent) {
          pathwayComponent?.ComponentConditions?.map(
            (componentCondition: any) => {
              if (componentCondition?.TargetComponent?.length > 0) {
                componentCondition?.TargetComponent?.map((target: string) => {
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
      setPoint({
        start: '',
        end: '',
      });
    }
  }, [point]);

  const removeConnection = (item: any) => {
    const newarray = connection;
    const index = newarray.findIndex((items: any) => items === item);
    pathwayComponentCards?.map((card: any) => {
      if (card?.CTID === item?.start) {
        const idx = card?.PrecededBy?.findIndex((i: any) => i === item?.end);
        card?.PrecededBy?.splice(idx, 1);
      }
    });
    updatedPathwayComponentConditionCards?.map((conditionCard: any) => {
      if (conditionCard?.CTID || conditionCard?.RowId === item?.start) {
        const idx = conditionCard?.TargetComponent.findIndex(
          (i: any) => i === item?.end
        );
        conditionCard?.TargetComponent.splice(idx, 1);
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
        .filter((card: any) => card.HasProgressionLevel === column.CTID)
        .reduce((acc: any, curr: any) => {
          if (acc >= curr.ColumnNumber) {
            return acc;
          } else {
            return curr.ColumnNumber;
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
                  height: '100vh',
                  flexDirection: 'column',
                  backgroundColor: `${index % 2 !== 0 ? '#f3f4f6' : '#e1e5e8'}`,
                }}
              >
                {Array.from(Array(numberOfDropWrapper).keys()).map(
                  (rowNumber: any, index: any) => (
                    <DropWrapper
                      id={column.id}
                      onDrop={onDropHandler}
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
                    >
                      <div
                        style={{
                          height: '100vh',
                          display: 'flex',
                          alignItems: 'center',
                          flexDirection: 'column',
                          position: 'relative',
                        }}
                      >
                        <Xwrapper>
                          {
                            // console.log(
                            //   'homepage --->',
                            //   updatedPathwayComponentConditionCards.filter(
                            //     (conditional_card: any) =>
                            //       conditional_card.HasProgressionLevel ===
                            //         column.CTID &&
                            //       conditional_card.RowNumber ===
                            //         rowNumber + 1 &&
                            //       conditional_card.ColumnNumber ===
                            //         column_num + 1
                            //   )
                            // )
                            // console.log(
                            //   'updatedPathwayComponentConditionCards --->',
                            //   updatedPathwayComponentConditionCards
                            // )
                          }

                          {pathwayComponentCards.length > 0 &&
                            pathwayComponentCards
                              .filter(
                                (card: any) =>
                                  /* here we are mapping the pathwayComponets to respective progression level and rowNumber and columnNumber */
                                  (card.CTID ===
                                    _.toString(destinationComponent) &&
                                    column?.id === 'destinationColumn' &&
                                    card.RowNumber === rowNumber + 1 &&
                                    card.ColumnNumber === column_num + 1) ||
                                  (card.HasProgressionLevel === column.CTID &&
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
                                          zIndex={1000}
                                          headSize={16}
                                          color="black"
                                          start={items?.start}
                                          end={items?.end}
                                          key={idx}
                                          labels={
                                            <div className={Styles.tempwrapper}>
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
                                            </div>
                                          }
                                          startAnchor="auto"
                                          endAnchor="auto"
                                          // gridBreak="20%"
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
                                    allComponentCardsData={
                                      allComponentCardsData
                                    }
                                    allConditionalCardsData={
                                      allConditionalCardsData
                                    }
                                    connectionsCTID={connectionsCTID}
                                    setIsConditionalEditing={
                                      setIsConditionalEditing
                                    }
                                  />
                                </>
                              ))}
                          {!!isDestinationColumnStatus && index === 1 && (
                            <MultiCard
                              skipPreSelect={skipPreSelect}
                              onClick={() => setShowRightPanel(true)}
                              key={uuidv4()}
                              //id={0}
                              isAddDestination={
                                column?.isDestinationColumnSelected
                                  ? true
                                  : false
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
                            />
                          )}
                          {!!isStartFromInitialColumnSelected &&
                            index === 1 &&
                            column?.CTID === getLastColumn('first') &&
                            pathwayComponentCards?.length <= 1 && (
                              <MultiCard
                                onClick={() => setShowRightPanel(true)}
                                key={0}
                                //id={0}
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
                  )
                )}
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
                      <div className="zoom-tools">
                        <button
                          onClick={() =>
                            setTransform(1, 1, 0.8, 400, 'easeOut')
                          }
                        >
                          -
                        </button>
                        <button onClick={() => resetTransform()}>x</button>
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
      </Layout>
      {(isConditionalModalStatus || isConditionalEditing) && (
        <Modal
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
          />
        </Modal>
      )}
    </>
  );
};

export default HomePage;
