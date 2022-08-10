import { faCubes } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';

import { ComponentsCards } from '../../assets/modal/constant';
import CardWithLeftIcon from '../cardWithLeftIcon';
import SearchBox from '../formFields/searchBox';
import Tab, { TabPane } from '../tab';

import Styles from './index.module.scss';

export enum LeftPanelTabKey {
  Selected = 'Selected',
  Components = 'Components',
}

const LeftPanel: React.FC<any> = () => {
  const [searchValue, setSearchValue] = useState('');
  const propsChildrenData = [];
  const array = [1, 1, 1, 1, 1];
  const [updatedCardArr, setUpdatedCardArr] = useState<any>();
  const [componentCardsData, setComponentCardsData] = useState<any>([
    ...ComponentsCards,
  ]);

  useEffect(() => {
    if (updatedCardArr?.length > 0) {
      const temp = componentCardsData?.filter(
        (item: any) => item?.id !== updatedCardArr
      );
      setComponentCardsData(temp);
    }
  }, [updatedCardArr]);

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
            {componentCardsData
              .filter((v: any) =>
                v.description
                  .toLocaleLowerCase()
                  .includes(searchValue.toLocaleLowerCase())
              )
              .map((v: any, i: any) => (
                <CardWithLeftIcon
                  draggable={true}
                  key={i}
                  name={v.name}
                  type={v.type}
                  description={v.description}
                  IconName={faCubes}
                  IconColor="black"
                  id={v.id}
                  getUpdatedCardArr={(value: any) => setUpdatedCardArr(value)}
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
            {array.map((v, i) => (
              <CardWithLeftIcon
                draggable={true}
                key={i}
                name="Course"
                description="Course"
                IconName={faCubes}
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
