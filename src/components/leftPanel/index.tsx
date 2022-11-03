import Modal from 'antd/lib/modal/Modal';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { v4 as uuidv4 } from 'uuid';

import AddComponentToPathway from '../../screens/addComponentToPathway';

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
}) => {
  const result = useSelector((state: any) => state?.initalReducer);
  const {
    mappedData: { PendingComponents: selectedTabCardData, PathwayComponents },
  } = result;
  const [searchValue, setSearchValue] = useState('');
  const propsChildrenData = [];

  const [componentTabCards, setComponentTabCards] = useState<any>([]);
  const [isDraggableCardVisible, setDraggableCardVisible] = useState(false);
  const [showAddComponentToPathway, setShowAddComponentToPathway] =
    useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    isDraggableCardVisibleMethod(isDraggableCardVisible);
  }, [isDraggableCardVisible]);

  const allComponentTabCards = useSelector(
    (state: any) => state.leftPanelReducer.allLeftPathwayComponent
  );
  const pathwayWrapper = useSelector((state: any) => state.initalReducer);
  const { mappedData: pathwayComponent } = pathwayWrapper;

  const [selectedTabCards, setSelectedtabCards] =
    useState<any>(selectedTabCardData);
  const [selectedPathwayComponents, setSelectedPathwayComponents] =
    useState<any>([]);
  useEffect(() => {
    if (selectedTabCardData && selectedTabCardData.length > 0) {
      const updatedPathwayWrapper = { ...pathwayComponent };
      if (
        updatedPathwayWrapper.PathwayComponents.length > 0 &&
        selectedPathwayComponents !== updatedPathwayWrapper.PathwayComponents
      ) {
        const filteredPendingCards = selectedTabCards?.filter(
          (selected_card: any) =>
            !updatedPathwayWrapper.PathwayComponents.some(
              (pathway_card: any) =>
                _.toString(pathway_card.CTID) === _.toString(selected_card.CTID)
            )
        );

        updatedPathwayWrapper.PendingComponents =
          filteredPendingCards.length === 0 ? [] : selectedTabCards;

        setSelectedtabCards(filteredPendingCards);
      } else {
        setSelectedtabCards(selectedTabCardData);
      }
      dispatch(updateMappedDataRequest(updatedPathwayWrapper));
      dispatch(saveDataForPathwayRequest(updatedPathwayWrapper));
      setSelectedPathwayComponents(updatedPathwayWrapper.PathwayComponents);
    }
  }, [selectedTabCardData, pathwayComponent.PathwayComponents]);

  const createCard = (card: any) => {
    const CTID = `ce-${uuidv4()}`;
    const newCard = {
      CTID,
      Created: '',
      Description: card?.Description,
      HasChild: [],
      HasCondition: [],
      IndustryType: [],
      IsChildOf: [],
      Name: card?.Name,
      OccupationType: [],
      PrecededBy: [],
      ProxyFor: `https://sandbox.credentialengineregistry.org/resources/${CTID}`,
      ProxyForLabel: card?.Name,
      RowId: uuidv4(),
      Type: card?.URI,
    };
    return newCard;
  };

  useEffect(() => {
    if (allComponentTabCards.valid)
      setComponentTabCards(
        allComponentTabCards.data.map((comp_data: any) => ({
          // ...comp_data,
          ...createCard(comp_data),
          Type: comp_data.URI,
        }))
      );
  }, [allComponentTabCards]);

  const searchComponent = (value: any) => {
    setSearchValue(value.target.value);
  };

  const onDropHandler = (
    tab: string,
    card: any,
    pathwayGameboardCard: boolean
  ) => {
    if (tab === LeftPanelTabKey.Selected) {
      const updatedCard = {
        ...card,
        pathwayGameboardCard,
        destinationColumn: false,
        isDestinationColumnSelected: false,
        isFirstColumneSelected: false,
        firstColumn: false,
      };
      setSelectedtabCards([...selectedTabCards, updatedCard]);
    } else {
      return;
    }

    const filteredPathwayComponent = PathwayComponents.filter(
      (component_card: any) => component_card.CTID !== card.CTID
    );

    const updatedPathwayWrapper = { ...pathwayComponent };

    const updatedPathway = { ...updatedPathwayWrapper.Pathway };
    if (card.destinationColumn || card.isDestinationColumnSelected) {
      updatedPathway.HasDestinationComponent = '';
      updatedPathwayWrapper.Pathway = updatedPathway;
      updatedPathwayWrapper.PathwayComponents = filteredPathwayComponent;
      updatedPathwayWrapper.PendingComponents = [...selectedTabCards, card];
      dispatch(updateMappedDataRequest(updatedPathwayWrapper));
      dispatch(saveDataForPathwayRequest(updatedPathwayWrapper));
    } else {
      updatedPathwayWrapper.PathwayComponents = filteredPathwayComponent;
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
                  v?.Description?.toLocaleLowerCase().includes(
                    searchValue?.toLocaleLowerCase()
                  )
                )
                .map((v: any, i: any) => (
                  <CardWithLeftIcon
                    draggable={true}
                    data={v}
                    key={i}
                    name={v?.Name}
                    type={v?.Type}
                    description={v?.Description.slice(0, 30)}
                    codedNotation={v?.CodedNotation}
                    IconColor="black"
                    id={v?.Id}
                    CTID={v?.CTID}
                    isDraggableCardVisibleMethod={(isDragTure: boolean) =>
                      setDraggableCardVisible(isDragTure)
                    }
                    setLeftpanelSelectedElem={setLeftpanelSelectedElem}
                  />
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
        <u style={{ cursor: 'pointer' }} onClick={onClickPreselectComponent}>
          Search Components
        </u>
      </div>
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
    </div>
  );
};
export default LeftPanel;
