import { faCaretDown, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown, Menu } from 'antd';

//import Modal from 'antd/lib/modal/Modal';
import _ from 'lodash';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { v4 as uuidv4 } from 'uuid';

import Modal from '../../components/modal';

import AddComponentToPathway from '../../screens/addComponentToPathway';

import SelectExistingComponents from '../../screens/selectExistingComponents';
import {
  saveDataForPathwayRequest,
  updateMappedDataRequest,
} from '../../states/actions';

import CardWithLeftIcon from '../cardWithLeftIcon';
import SearchBox from '../formFields/searchBox';
import LeftPanelDropWrapper from '../leftPanelDropWrapper';
import Tab, { TabPane } from '../tab';

import Styles from './index.module.scss';

export enum LeftPanelTabKey {
  Selected = 'Selected',
  Components = 'Components',
}
const LeftPanel: React.FC<any> = ({
  isDraggableCardVisibleMethod,
  setLeftpanelSelectedElem,
  onClickPreselectComponent,
  isEdit,
  setIsEdit,
}) => {
  const result = useSelector((state: any) => state?.initalReducer);
  const {
    mappedData: { PendingComponents: selectedTabCardData, PathwayComponents },
  } = result;
  const [searchValue, setSearchValue] = useState('');
  const propsChildrenData = [];
  const [componentTabCards, setComponentTabCards] = useState<any>([]);
  const [alphabetical, setAlphabetical] = useState<string>('');
  // const [isDraggableCardVisible, setDraggableCardVisible] = useState(false);
  const [showAddComponentToPathway, setShowAddComponentToPathway] =
    useState(false);
  const [isSelectedExistingVisible, setIsSelectedExistingVisible] =
    useState(false);
  const [isExisting, setIsExisting] = useState(false);
  const [droppedCard, setDroppedCard] = useState<any>();

  const dispatch = useDispatch();
  const updatedPathwayWrapper = { ...result.mappedData };

  // useEffect(() => {
  //   isDraggableCardVisibleMethod(isDraggableCardVisible);
  // }, [isDraggableCardVisible]);

  const allComponentTabCards = useSelector(
    (state: any) => state.leftPanelReducer.allLeftPathwayComponent
  );
  const [selectedTabCards, setSelectedtabCards] =
    useState<any>(selectedTabCardData);
  const [selectedPathwayComponents, setSelectedPathwayComponents] =
    useState<any>([]);

  useEffect(() => {
    if (selectedTabCardData && selectedTabCardData.length > 0) {
      const updatedPathwayWrapper = { ...result.mappedData };
      if (
        updatedPathwayWrapper?.PathwayComponents?.length > 0 &&
        selectedPathwayComponents !== updatedPathwayWrapper.PathwayComponents
      ) {
        const filteredPendingCards = selectedTabCardData?.filter(
          (selected_card: any) =>
            !updatedPathwayWrapper?.PathwayComponents?.some(
              (pathway_card: any) =>
                _.toString(pathway_card.CTID) === _.toString(selected_card.CTID)
            )
        );

        if (isEdit && selectedTabCardData?.length > 0) {
          setSelectedtabCards(selectedTabCardData);
          setIsEdit(false);
        } else {
          setSelectedtabCards(filteredPendingCards);
          updatedPathwayWrapper.PendingComponents =
            filteredPendingCards?.length === 0 ? [] : selectedTabCardData;
          setSelectedtabCards(filteredPendingCards);
          if (
            filteredPendingCards.length <
            updatedPathwayWrapper.PendingComponents
          ) {
            const updatedpending = updatedPathwayWrapper.PendingComponents.map(
              (item: any) => {
                const matching = filteredPendingCards.find(
                  (item2: any) => item2.CTID === item.CTID
                );
                return { ...item, ...matching };
              }
            );
            updatedPathwayWrapper.PendingComponents = updatedpending;
          }
        }
      } else {
        setSelectedtabCards(selectedTabCardData);
      }

      if (droppedCard) {
        const conditionalCard = checkHasCondition(droppedCard);

        const filteredConditionalComponent =
          updatedPathwayWrapper?.ComponentConditions?.filter(
            (conditional_card: any) =>
              !conditionalCard?.find(
                (element: any) => element?.RowId === conditional_card?.RowId
              )
          ).map((card: any) =>
            card?.TargetComponent?.includes(droppedCard?.CTID)
              ? {
                  ...card,
                  TargetComponent: card?.TargetComponent?.filter(
                    (card: any) => card?.CTID !== droppedCard?.CTID
                  ),
                }
              : card
          );
        const updatedConditionalCards = filteredConditionalComponent?.map(
          (card: any) => {
            if (card?.TargetComponent?.includes(droppedCard?.CTID)) {
              return {
                ...card,
                TargetComponent: card?.TargetComponent?.filter(
                  (card: any) =>
                    _.toString(card) !== _.toString(droppedCard?.CTID)
                ),
              };
            } else {
              return card;
            }
          }
        );
        updatedPathwayWrapper.ComponentConditions = updatedConditionalCards;
        updatedPathwayWrapper.DeletedComponentConditions = [
          ...updatedPathwayWrapper.DeletedComponentConditions,
          ...conditionalCard,
        ];
        setSelectedPathwayComponents(updatedPathwayWrapper.PathwayComponents);
        setDroppedCard(undefined);
      }
      // updatedPathwayWrapper.PendingComponents = selectedTabCardData;

      dispatch(updateMappedDataRequest(updatedPathwayWrapper));
    } else {
      setSelectedtabCards(selectedTabCardData);
    }
    isDraggableCardVisibleMethod(false);
  }, [
    selectedTabCardData,
    droppedCard,
    result.mappedData.PathwayComponents,
    result.mappedData.PendingComponents,
  ]);

  const createCard = (card: any) => {
    if (card?.URI === 'ceterms:ComponentCondition') {
      const newCard = {
        Created: '',
        Description: null,
        HasCondition: [],
        Name: null,
        RowId: uuidv4(),
        Type: 'conditional',
        ParentIdentifier: '',
        RequiredNumber: null,
        LogicalOperator: '',
        PathwayCTID: result?.mappedData?.Pathway?.CTID,
        HasConstraint: [],
        TargetComponent: [],
      };
      return newCard;
    } else {
      const CTID = `ce-${uuidv4()}`;
      const newCard = {
        CTID,
        Created: '',
        Description: null,
        HasChild: [],
        HasCondition: [],
        IndustryType: [],
        IsChildOf: [],
        Name: null,
        OccupationType: [],
        PrecededBy: [],
        Precedes: [],
        ProxyFor: '',
        ProxyForLabel: '',
        RowId: uuidv4(),
        Type: card?.URI,
      };
      return newCard;
    }
  };

  useEffect(() => {
    if (allComponentTabCards.valid)
      setComponentTabCards(
        allComponentTabCards.data.map((comp_data: any) => ({
          ...createCard(comp_data),
          Type: comp_data.URI,
        }))
      );
  }, [allComponentTabCards]);

  let conditionalComponent: any = [];

  const checkHasCondition = (card: any) => {
    const updatedPathwayWrapper = { ...result.mappedData };

    if (card?.HasCondition.length > 0) {
      const nextConditionalComponent =
        updatedPathwayWrapper?.ComponentConditions?.filter(
          (condition_card: any) =>
            card?.HasCondition.includes(condition_card?.RowId)
        );

      conditionalComponent = [
        ...conditionalComponent,
        ...nextConditionalComponent,
      ];
      checkHasCondition(nextConditionalComponent[0]);
    }
    return conditionalComponent;
  };
  const UnSelectSelectedItem = (itemId: string) => {
    debugger;
    const updatedPathwayWrapper = { ...result.mappedData };
    const filteredpending = updatedPathwayWrapper.PendingComponents.filter(
      (item: any) => item.CTID !== itemId
    );
    updatedPathwayWrapper.PendingComponents = filteredpending;
    const deletedItems = selectedTabCardData.filter(
      (item: any) => item.CTID === itemId
    );
    setSelectedtabCards(filteredpending);
    const deletedResource = updatedPathwayWrapper.DeletedComponents;
    if (!deletedResource?.some((item: any) => item.CTID === itemId)) {
      const updatesDeletedResource = [...deletedResource, ...deletedItems];
      updatedPathwayWrapper.DeletedComponents = updatesDeletedResource;
      //setDeletedResource([...deletedResource, ...filteredpending]);
    }
    dispatch(updateMappedDataRequest(updatedPathwayWrapper));
  };
  const searchComponent = (value: any) => {
    setSearchValue(value.target.value);
  };

  const searchComponentsInvisible = () => {
    setIsSelectedExistingVisible(isExisting);
  };
  const onDropHandler = (
    tab: string,
    card: any,
    pathwayGameboardCard: boolean
  ) => {
    if (card?.Type !== 'conditional' && tab === LeftPanelTabKey.Selected) {
      const updatedCard = {
        ...card,
        pathwayGameboardCard,
        destinationColumn: false,
        isDestinationColumnSelected: false,
        isFirstColumneSelected: false,
        firstColumn: false,
        RowNumber: 0,
        ColumnNumber: 0,
        HasCondition: [],
        PrecededBy: [],
        Precedes: [],
        HasChild: [],
      };
      setDroppedCard(card);
      card = updatedCard;
      setSelectedtabCards([...selectedTabCards, updatedCard]);
    } else {
      return;
    }

    const filteredPathwayComponent = PathwayComponents.filter(
      (component_card: any) => component_card.CTID !== card.CTID
    );

    const updatedPathwayWrapper = { ...result.mappedData };

    const updatedPathway = { ...updatedPathwayWrapper.Pathway };
    const isDestinationCardExist =
      updatedPathway?.HasDestinationComponent === card?.CTID;
    if (isDestinationCardExist) {
      updatedPathway.HasDestinationComponent = '';
      updatedPathwayWrapper.Pathway = updatedPathway;
    }
    if (card.destinationColumn || card.isDestinationColumnSelected) {
      updatedPathway.HasDestinationComponent = '';
      updatedPathwayWrapper.Pathway = updatedPathway;
      updatedPathwayWrapper.PathwayComponents = filteredPathwayComponent.map(
        (item: any) =>
          item?.PrecededBy.includes(card?.CTID)
            ? {
                ...item,
                PrecededBy: item?.PrecededBy.filter(
                  (preceded: any) => preceded !== card?.CTID
                ),
              }
            : item
      );
      updatedPathwayWrapper.PathwayComponents = filteredPathwayComponent
        .filter((item: any) => item.CTID !== card.CTID)
        .map((component_card: any) => {
          if (component_card?.PrecededBy.includes(card?.CTID)) {
            return {
              ...component_card,
              PrecededBy: component_card?.PrecededBy.filter(
                (preceded: any) => preceded !== card?.CTID
              ),
            };
          } else if (component_card?.Precedes.includes(card?.CTID)) {
            return {
              ...component_card,
              Precedes: component_card?.Precedes.filter(
                (preceded: any) => preceded !== card?.CTID
              ),
            };
          } else if (component_card?.HasChild.includes(card?.CTID)) {
            return {
              ...component_card,
              HasChild: component_card?.HasChild.filter(
                (preceded: any) => preceded !== card?.CTID
              ),
            };
          } else {
            return { ...component_card };
          }
        });
      updatedPathwayWrapper.PendingComponents = [...selectedTabCards, card];
      dispatch(updateMappedDataRequest(updatedPathwayWrapper));
      dispatch(saveDataForPathwayRequest(updatedPathwayWrapper));
    } else {
      updatedPathwayWrapper.PathwayComponents = filteredPathwayComponent.map(
        (item: any) =>
          item?.PrecededBy.includes(card?.CTID)
            ? {
                ...item,
                PrecededBy: item?.PrecededBy.filter(
                  (preceded: any) => preceded !== card?.CTID
                ),
              }
            : item
      );
      updatedPathwayWrapper.PathwayComponents = filteredPathwayComponent
        .filter((item: any) => item.CTID !== card.CTID)
        .map((component_card: any) => {
          if (component_card?.PrecededBy.includes(card?.CTID)) {
            return {
              ...component_card,
              PrecededBy: component_card?.PrecededBy.filter(
                (preceded: any) => preceded !== card?.CTID
              ),
            };
          } else if (component_card?.Precedes.includes(card?.CTID)) {
            return {
              ...component_card,
              Precedes: component_card?.Precedes.filter(
                (preceded: any) => preceded !== card?.CTID
              ),
            };
          } else if (component_card?.HasChild.includes(card?.CTID)) {
            return {
              ...component_card,
              HasChild: component_card?.HasChild.filter(
                (preceded: any) => preceded !== card?.CTID
              ),
            };
          } else {
            return { ...component_card };
          }
        });

      updatedPathwayWrapper.PendingComponents = [...selectedTabCards, card];
      dispatch(updateMappedDataRequest(updatedPathwayWrapper));
      dispatch(saveDataForPathwayRequest(updatedPathwayWrapper));
    }
  };

  const tab = [
    {
      key: LeftPanelTabKey.Selected,
      name: LeftPanelTabKey.Selected,
    },
    {
      key: LeftPanelTabKey.Components,
      name: LeftPanelTabKey.Components,
    },
  ];
  const alphabeticalMenu = [
    {
      label: 'Sort',
      key: '0',
    },
    {
      label: 'Alphabetical',
      key: '1',
    },
    {
      label: 'Component Type',
      key: '2',
    },
    {
      label: 'Owning Organization',
      key: '3',
    },
  ];
  useEffect(() => {
    const clonedSelectedResource = _.cloneDeep(selectedTabCardData);
    if (Number(alphabetical) === 1) {
      clonedSelectedResource?.sort((a: any, b: any) =>
        a.Name.localeCompare(b.Name)
      );
      setSelectedtabCards(clonedSelectedResource);
    } else if (Number(alphabetical) === 2) {
      clonedSelectedResource?.sort((a: any, b: any) =>
        a.Type.localeCompare(b.Type)
      );
      setSelectedtabCards(clonedSelectedResource);
    } else if (Number(alphabetical) === 3) {
      clonedSelectedResource?.sort((a: any, b: any) =>
        a.FinderResource?.Provider?.Name.localeCompare(
          b.FinderResource?.Provider?.Name
        )
      );
      setSelectedtabCards(clonedSelectedResource);
    } else {
      setSelectedtabCards(selectedTabCardData);
    }
  }, [alphabetical]);

  const propsChildren = [
    {
      key: LeftPanelTabKey.Selected,
      name: LeftPanelTabKey.Selected,
      children: (
        <>
          <SearchBox
            placeholder="Search your Components"
            className={Styles.customsearch}
            styleType="outline"
            onKeyUp={searchComponent}
          />

          <Dropdown
            overlay={
              <Menu
                items={alphabeticalMenu}
                selectable
                onClick={(e) => {
                  setAlphabetical(e.key);
                }}
              />
            }
            trigger={['click']}
          >
            <p className="dropdown-title d-flex">
              {alphabeticalMenu[Number(alphabetical)]?.label}&nbsp;
              <FontAwesomeIcon icon={faCaretDown} color="black" />
            </p>
          </Dropdown>

          <LeftPanelDropWrapper
            className={Styles.cardwrapper}
            tabName={LeftPanelTabKey.Selected}
            onDrop={onDropHandler}
          >
            {selectedTabCards && selectedTabCards?.length <= 0 ? (
              <div className={Styles.tooltipContent}>
                <p className={Styles.title}>Pre-select components</p>
                <p className={Styles.content}>
                  You can create a collection of components to drag and drop
                  into the pathway
                </p>
                <p
                  className={Styles.contentLink}
                  onClick={onClickPreselectComponent}
                >
                  Pre-select components
                </p>
              </div>
            ) : (
              !!selectedTabCards &&
              selectedTabCards.length > 0 &&
              selectedTabCards
                ?.filter((v: any) =>
                  !_.isEmpty(searchValue)
                    ? v?.Name?.toLocaleLowerCase().includes(
                        searchValue?.toLocaleLowerCase()
                      )
                    : true
                )
                .map((v: any, i: any) => (
                  <div className={Styles.flexGrowCenter} key={i}>
                    <>
                      <CardWithLeftIcon
                        draggable={true}
                        data={v}
                        key={i}
                        name={v?.Name}
                        type={v?.Type}
                        description={v?.Description?.slice(0, 30)}
                        codedNotation={v?.CodedNotation}
                        IconColor="black"
                        id={v?.Id}
                        CTID={v?.CTID}
                        // isDraggableCardVisibleMethod={(isDragTure: boolean) => setDraggableCardVisible(false)}
                        setLeftpanelSelectedElem={setLeftpanelSelectedElem}
                      />
                      <span
                        className={Styles.iconCircle}
                        onClick={() => UnSelectSelectedItem(v.CTID)}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </span>
                    </>
                  </div>
                ))
            )}
          </LeftPanelDropWrapper>
        </>
      ),
    },
    {
      key: LeftPanelTabKey.Components,
      name: LeftPanelTabKey.Components,
      children: (
        <>
          <div className={Styles.cardwrapper}>
            {componentTabCards.map((card: any, index: any) => (
              <CardWithLeftIcon
                isComponentTab={true}
                draggable={true}
                key={index}
                data={card}
                name={card.Name}
                description={card.Description}
                uri={card?.URI}
                CTID={card?.CTID}
                id={card.Id}
                type={card?.URI}
                setLeftpanelSelectedElem={setLeftpanelSelectedElem}
              />
            ))}
          </div>
        </>
      ),
    },
  ];
  for (let i = 0; i < propsChildren.length; i++) {
    propsChildrenData.push(
      <TabPane name={propsChildren[i].name} key={propsChildren[i].key}>
        {propsChildren[i].children}
      </TabPane>
    );
  }
  const tabVal = {
    showTabBar: true,
    activeKey: LeftPanelTabKey.Selected,
    tabs: tab,
    children: propsChildrenData,
    className: Styles.leftPanelDrawer,
  };
  return (
    <div className={Styles.drawercontroller}>
      <div className={Styles.drawerheader}>
        <h2>Add Components</h2>
      </div>
      <button
        style={{
          cursor: 'pointer',
          backgroundColor: '#4ee5e1',
          borderRadius: '5px',
          fontSize: '13px',
        }}
        onClick={onClickPreselectComponent}
      >
        Search Registry Resources
      </button>
      <br />
      {/* <u
        style={{
          cursor: 'pointer',
          backgroundColor: '#4ee5e1',
          borderRadius: '5px',
        }}
        onClick={searchComponentsVisible}
      >
        Search Pathway Components
      </u> */}
      <Tab {...tabVal} />

      <Modal
        visible={showAddComponentToPathway}
        onCancel={() => setShowAddComponentToPathway(false)}
        closable
        footer={null}
      >
        <AddComponentToPathway
          isVisible={(value: any) => setShowAddComponentToPathway(value)}
        />
      </Modal>
      {isSelectedExistingVisible && (
        <Modal
          visible={true}
          //width="650px"
          width="50vw"
          footer={[]}
          onCancel={searchComponentsInvisible}
          title="Link to a component from another pathway "
        >
          <SelectExistingComponents
            setIsSelectedExistingVisible={setIsSelectedExistingVisible}
            setIsDestinationColumnSelected={setIsExisting}
            fromPreSelect={true}
            addPathwayWrapperFields={updatedPathwayWrapper?.Pathway}
            setIsAddPathwayDestinationVisible={setIsSelectedExistingVisible}
            getSkipValueOfPreSelectResources={setIsExisting}
          />
        </Modal>
      )}
    </div>
  );
};
export default LeftPanel;
// function elseif(arg0: boolean) {
//   throw new Error('Function not implemented.');
// }
