import Modal from 'antd/lib/modal/Modal';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AddComponentToPathway from '../../screens/addComponentToPathway';

import { updateMappedDataRequest } from '../../states/actions';

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
  const [selectedTabCards, setSelectedtabCards] = useState<any>([]);
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
  useEffect(() => {
    if (selectedTabCardData) {
      setSelectedtabCards(selectedTabCardData);
    }
  }, [selectedTabCardData]);

  const filteredSelectedCards = (val: any) => {
    const filteredSelectedCards = selectedTabCards?.filter(
      (item: any) => item.CTID !== val
    );
    const updatedPathwayWrapper = { ...pathwayComponent };
    updatedPathwayWrapper.PendingComponents = filteredSelectedCards;
    dispatch(updateMappedDataRequest(updatedPathwayWrapper));
    setSelectedtabCards(filteredSelectedCards);
  };

  useEffect(() => {
    if (allComponentTabCards.valid)
      setComponentTabCards(
        allComponentTabCards.data.map((comp_data: any) => ({
          ...comp_data,
          Type: comp_data.URI,
        }))
      );
  }, [allComponentTabCards]);

  const searchComponent = (value: any) => {
    setSearchValue(value.target.value);
  };

  const onDropHandler = (tab: string, card: any) => {
    if (tab === LeftPanelTabKey.Selected) {
      setSelectedtabCards([...selectedTabCards, card]);
    } else {
      return;
    }
    /*  Commenting the below code because Dragging of a component from the gameboard to the Component Tab is 
    not listed in documents and we are not storing components tab card. 

    if (tab === LeftPanelTabKey.Components) {
      const isSelectedCardAlreadyExist = componentTabCards.some(
        (component_card: any) => component_card.RowId === card.RowId
      );
      if (!isSelectedCardAlreadyExist) {
        setComponentTabCards([...componentTabCards, card]);
      }
    }

 */
    const filteredPathwayComponent = PathwayComponents.filter(
      (component_card: any) => component_card.CTID !== card.CTID
    );

    const updatedPathwayWrapper = { ...pathwayComponent };
    updatedPathwayWrapper.PathwayComponents = filteredPathwayComponent;
    updatedPathwayWrapper.PendingComponents = [...selectedTabCards, card];
    dispatch(updateMappedDataRequest(updatedPathwayWrapper));
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
            placeholder="Search your components"
            className={Styles.customsearch}
            styleType="outline"
            onKeyUp={searchComponent}
          />
          <LeftPanelDropWrapper
            className={Styles.cardwrapper}
            tabName={LeftPanelTabKey.Selected}
            onDrop={onDropHandler}
          >
            {selectedTabCards && selectedTabCards.length <= 0 ? (
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
              selectedTabCards
                .filter((v: any) =>
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
                    getUpdatedCardArr={(value: any) =>
                      filteredSelectedCards(value)
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
                id={card.Id}
                type={card?.URI}
                getUpdatedCardArr={(value: any) => filteredSelectedCards(value)}
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
        <h1>Add Components</h1>
        {/* <Button onClick={noop} text="Edit Selections" type="selection" /> */}
        <u
          style={{ cursor: 'pointer' }}
          onClick={() => setShowAddComponentToPathway(true)}
        >
          Select
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
