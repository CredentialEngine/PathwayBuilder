import { faCubes } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// import { ComponentsCards } from '../../assets/modal/constant';
import CardWithLeftIcon from '../cardWithLeftIcon';
import SearchBox from '../formFields/searchBox';
import Tab, { TabPane } from '../tab';

import Styles from './index.module.scss';
// import { getLeftPanelPathwayComponentRequest } from './state/actions';

export enum LeftPanelTabKey {
  Selected = 'Selected',
  Components = 'Components',
}

const LeftPanel: React.FC<any> = () => {
  const result = useSelector((state: any) => state?.initalReducer);
  const {
    mappedData: { PendingComponent: selectedTabCardData },
  } = result;
  const [searchValue, setSearchValue] = useState('');
  const propsChildrenData = [];
  // const [updatedCardArr, setUpdatedCardArr] = useState<any>();
  const [selectedTabCards, setSelectedtabCards] = useState<any>([]);
  const [componentTabCards, setComponentTabCards] = useState<any>([]);

  // const dispatch = useDispatch();

  const allComponentTabCards = useSelector(
    (state: any) => state.leftPanelReducer.allLeftPathwayComponent
  );

  useEffect(() => {
    if (selectedTabCardData) {
      setSelectedtabCards(selectedTabCardData);
    }
  }, [selectedTabCardData]);

  // useEffect(() => {
  //   if (updatedCardArr?.length > 0) {
  //     console.log('selected----', selectedTabCards)
  //     const temp = selectedTabCards?.filter(
  //       (item: any) => item?.Id !== updatedCardArr
  //     );
  //     setSelectedtabCards(temp);
  //   }
  // }, [updatedCardArr]);

  const abc = (val: any) => {
    const temp = selectedTabCards?.filter((item: any) => item?.CTID !== val);
    setSelectedtabCards(temp);
  };

  // useEffect(() => {
  //   dispatch(getLeftPanelPathwayComponentRequest());
  // }, []);

  useEffect(() => {
    if (allComponentTabCards.valid)
      setComponentTabCards(allComponentTabCards.data);
  }, [allComponentTabCards]);

  const searchComponent = (value: any) => {
    setSearchValue(value.target.value);
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
          <div className={Styles.cardwrapper}>
            {selectedTabCards
              .filter((v: any) =>
                v?.Description.toLocaleLowerCase().includes(
                  searchValue.toLocaleLowerCase()
                )
              )
              .map((v: any, i: any) => (
                <CardWithLeftIcon
                  draggable={true}
                  key={i}
                  name={v?.Name}
                  type={v?.type}
                  description={v?.Description}
                  codedNotation={v?.CodedNotation}
                  IconName={faCubes}
                  IconColor="black"
                  id={v?.Id}
                  CTID={v?.CTID}
                  getUpdatedCardArr={(value: any) => abc(value)}
                />
              ))}
          </div>
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
                draggable={true}
                key={index}
                name={card.Name}
                description={card.Description}
                IconName={faCubes}
                uri={card.URI}
                id={card.Id}
                getUpdatedCardArr={(value: any) => abc(value)}
              />
            ))}
            ,
          </div>
          ,
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
        <u>Select</u>
      </div>
      <Tab {...tabVal} />
    </div>
  );
};

export default LeftPanel;
