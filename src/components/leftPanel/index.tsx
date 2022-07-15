import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { noop } from 'lodash';
import React from 'react';

import Button from '../button';
import CardWithLeftIcon from '../cardWithLeftIcon';
import SearchBox from '../formFields/searchBox';
import Tab, { TabPane } from '../tab';

import Styles from './index.module.scss';

export enum LeftPanelTabKey {
  Selected = 'Selected',
  Components = 'Components',
}

const LeftPanel: React.FC<any> = () => {
  const array = [1, 1, 1, 1, 1, 1, 1, 1];
  const propsChildrenData = [];

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
            styleType="grey"
          />
          <div className={Styles.cardwrapper}>
            {array.map((v, i) => (
              <CardWithLeftIcon
                key={i}
                title="Course"
                Subtitle="Business of Retail Course"
                IconName={faCubes}
                IconColor="black"
              />
            ))}
          </div>
        </>
      ),
    },
    {
      key: LeftPanelTabKey.Components,
      name: LeftPanelTabKey.Components,
      children: array.map((v, i) => (
        <CardWithLeftIcon
          key={i}
          title="Course"
          Subtitle="Course"
          IconName={faCubes}
        />
      )),
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
    <>
      <div className={Styles.drawerheader}>
        <h1>Add Components</h1>
        <Button onClick={noop} text="Edit Selections" type="selection" />
      </div>
      <Tab {...tabVal} />
    </>
  );
};

export default LeftPanel;
