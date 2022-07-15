import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { noop } from 'lodash';
import React, { useState } from 'react';

import Button from './components/button';
import { Type } from './components/button/type';
import ConditionalComponent from './components/conditionalComponentForm';
import CustomDrawer from './components/customDrawer';
import Header from './components/header';
import LeftPanel from './components/leftPanel';
import MainContainer from './components/mainContainer';
import Modal from './components/modal';
import RightPanel from './components/rightPanel';
import Styles from './index.module.scss';
import AddPathwayForm from './screens/addPathwayForm';
import CreatePathway from './screens/createPathway/createPathway';
import SelectDestination from './screens/selectDestination';

const App = () => {
  const [isrightPanelDrawerVisible, setRightPanelDrawerVisible] =
    useState<boolean>(false);
  const [isCreatePathwayVisible, setIsCreatePathwayVisible] =
    useState<boolean>(true);
  const [isAddPathwayVisible, setIsAddPathwayVisible] =
    useState<boolean>(false);
  const [isConditionComponentVisible, setIsConditionComponentVisible] =
    useState<boolean>(false);
  const [isLeftDrawerVisible, setLeftDrawerVisible] = useState<boolean>(false);
  const [isDestinationScreenVisible, setDestinationScreenVisible] =
    useState<boolean>(false);

  const leftDrawerVisible = () => {
    setLeftDrawerVisible(!isLeftDrawerVisible);
  };
  const handlerDestinationScreen = () => {
    setDestinationScreenVisible(!isDestinationScreenVisible);
  };
  const oncreatePathwayOkHandler = () => {
    setIsAddPathwayVisible(true);
    setIsCreatePathwayVisible(false);
  };

  const onCreatePathwayCancelHandler = () => {
    setIsCreatePathwayVisible(false);
  };

  const onAddPathwayOkHandler = () => {
    setIsAddPathwayVisible(false);
    setIsConditionComponentVisible(true);
  };

  const onAddPathwayCancelHandler = () => {
    setIsAddPathwayVisible(false);
  };

  const onCloseHandler = () => {
    setRightPanelDrawerVisible(false);
  };

  const onConditionalComponentOkHandler = () => {
    setIsConditionComponentVisible(false);
  };

  const onConditionalComponentCancelHandler = () => {
    setIsConditionComponentVisible(false);
  };

  return (
    <div>
      <Header />
      <MainContainer>
        <div
          style={{
            display: 'block',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          className={Styles.leftdrawerWrapper}
        >
          <CustomDrawer
            width="22%"
            visible={isLeftDrawerVisible}
            onClose={() => setLeftDrawerVisible(false)}
            placement="left"
            mask={false}
            className={Styles.leftPanel}
          >
            <LeftPanel onCloseHandler={() => setLeftDrawerVisible(false)} />
          </CustomDrawer>

          <FontAwesomeIcon
            icon={faAngleDoubleLeft}
            onClick={leftDrawerVisible}
            className={Styles.drawerIcon}
          />
        </div>
        <button onClick={handlerDestinationScreen}>
          isDestinationScreenVisible
        </button>
        <Modal
          visible={isDestinationScreenVisible}
          onCancel={() => setDestinationScreenVisible(false)}
          footer=""
          title=""
        >
          <SelectDestination />
        </Modal>
        <Modal
          visible={isCreatePathwayVisible}
          onOk={oncreatePathwayOkHandler}
          onCancel={onCreatePathwayCancelHandler}
          title="Add a Pathway"
        >
          <CreatePathway />
        </Modal>

        <Modal
          visible={isAddPathwayVisible}
          onOk={onAddPathwayOkHandler}
          onCancel={onAddPathwayCancelHandler}
          title="Add a Pathway"
        >
          <AddPathwayForm />
        </Modal>
        <CustomDrawer
          width="35%"
          visible={isrightPanelDrawerVisible}
          onClose={() => setRightPanelDrawerVisible(false)}
          footer={[]}
        >
          <RightPanel onCloseHandler={onCloseHandler} />
        </CustomDrawer>
        <Modal
          visible={isConditionComponentVisible}
          onOk={onConditionalComponentOkHandler}
          onCancel={onConditionalComponentCancelHandler}
          title="Add Component"
          footer={
            <Button
              text="Save Condition"
              onClick={noop}
              type={Type.APPROVE}
            ></Button>
          }
        >
          <ConditionalComponent />
        </Modal>
      </MainContainer>
    </div>
  );
};

export default App;
