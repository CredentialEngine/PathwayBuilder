import { noop } from 'lodash';
import React, { useState } from 'react';

import Button from './components/button';
import { Type } from './components/button/type';

import ConditionalComponent from './components/conditionalComponentForm';

import CustomDrawer from './components/customDrawer';

import Header from './components/header';
import MainContainer from './components/mainContainer';
import Modal from './components/modal';
import RightPanel from './components/rightPanel';
import AddPathwayForm from './screens/addPathwayForm';
import CreatePathway from './screens/createPathway/createPathway';
import Columns from './screens/homePage';
import TestComponent from './screens/testComponent';

const App = () => {
  const [isrightPanelDrawerVisible, setRightPanelDrawerVisible] =
    useState<boolean>(false);
  const [isCreatePathwayVisible, setIsCreatePathwayVisible] =
    useState<boolean>(false);
  const [isAddPathwayVisible, setIsAddPathwayVisible] =
    useState<boolean>(false);
  const [isConditionComponentVisible, setIsConditionComponentVisible] =
    useState<boolean>(false);

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
    const element = document.getElementById('left-frame');
    if (element != null) {
      element.style.display = 'none';
    }
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
        <TestComponent>
          <RightPanel onCloseHandler={onCloseHandler} />
        </TestComponent>
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
        <Columns />
      </MainContainer>
    </div>
  );
};

export default App;
