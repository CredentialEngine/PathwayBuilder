import classNames from 'classnames';
import { get } from 'lodash';
import React from 'react';

import styles from './index.module.scss';
import { Props as TabPaneProps } from './lib/tabPane';

/* global HTMLDivElement */

interface TabInfo {
  key: string;
  name: string;
}

interface Props {
  showTabBar?: boolean;
  tabs?: TabInfo[];
  activeKey?: string;
  className?: string;
  tabBarWrapperClassName?: string;
  tabPaneClassName?: string;
  onTabChange?: (activeKey: string) => void;
  children?:
    | Array<React.ReactElement<TabPaneProps>>
    | React.ReactElement<TabPaneProps>;
}

export const Tab: React.FC<Props> = (props: Props) => {
  const {
    tabBarWrapperClassName,
    tabPaneClassName,
    tabs,
    onTabChange,
    activeKey: defaultActiveKey,
    showTabBar,
    children,
  } = props;

  const [currentActiveKey, setActiveKey] = React.useState(defaultActiveKey);
  const [inkBarLeft, setInkBarLeft] = React.useState(0);
  const [inkBarWidth, setInkBarWidth] = React.useState(0);

  const defaultActiveTabRef = React.useRef(null);

  const syncInkBarWithActiveTab = (target: HTMLDivElement) => {
    const { offsetLeft, clientWidth } = target;
    setInkBarLeft(offsetLeft);
    setInkBarWidth(clientWidth);
  };
  console.log(inkBarWidth);

  React.useEffect(() => {
    if (showTabBar && defaultActiveTabRef && defaultActiveTabRef.current) {
      syncInkBarWithActiveTab(
        defaultActiveTabRef.current as any as HTMLDivElement
      );
    }
  }, [showTabBar]);

  React.useEffect(() => {
    setActiveKey(defaultActiveKey);
  }, [defaultActiveKey]);

  React.useEffect(
    () => () => {
      if (defaultActiveTabRef && defaultActiveTabRef.current) {
        syncInkBarWithActiveTab(
          defaultActiveTabRef.current as any as HTMLDivElement
        );
      }
    },
    [currentActiveKey]
  );

  const handleTabClick = (activeKey: string) => {
    setActiveKey(activeKey);
    return onTabChange && onTabChange(activeKey);
  };

  const buildTabPane = (tabPaneChild: React.ReactElement<TabPaneProps>) => {
    const key = tabPaneChild.key! as string;
    return React.cloneElement(
      tabPaneChild,
      { key },
      tabPaneChild.props.children
    );
  };

  const getTabs = (): TabInfo[] => {
    if (tabs) {
      return tabs;
    }
    return React.Children.toArray(children).map((tabPaneChild, index) => ({
      key: `${get(tabPaneChild, 'key').toString().replace('.$', '') || index}`,
      name: get(tabPaneChild, 'props.name', ''),
    }));
  };

  const tabBar = (): React.ReactElement => (
    <div className={classNames(styles.tabs, tabBarWrapperClassName)}>
      {getTabs().map((tab, index) => (
        <div
          key={index}
          className={classNames(styles.tabBar, 'customTabs', {
            [styles.active]: tab.key === currentActiveKey,
          })}
          onClick={() => handleTabClick(tab.key)}
          ref={tab.key === currentActiveKey ? defaultActiveTabRef : null}
        >
          {tab.name}
        </div>
      ))}
      <div
        className={styles.inkBar}
        style={{ left: inkBarLeft /*  width: inkBarWidth */ }}
      />
    </div>
  );

  const tabPane = (): React.ReactElement[] =>
    React.Children.toArray(children).map((tabPaneChild, index) => (
      <div
        className={classNames(styles.tabPane, tabPaneClassName)}
        key={index}
        style={
          get(tabPaneChild, 'key') !== `.$${currentActiveKey}`
            ? { display: 'none' }
            : undefined
        }
      >
        {buildTabPane(tabPaneChild as React.ReactElement<TabPaneProps>)}
      </div>
    ));

  return (
    <>
      {showTabBar && tabBar()}
      {children && tabPane()}
    </>
  );
};

Tab.defaultProps = {
  showTabBar: true,
};

export { default as TabPane } from './lib/tabPane';
export default Tab;
