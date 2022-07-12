import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { noop } from 'lodash';
import React, { useState } from 'react';

import Button from './components/button';
import { Type } from './components/button/type';
import ConditionalComponent from './components/conditionalComponentForm';
import CustomDrawer from './components/customDrawer';
import Header from './components/header';
import InfoTooltip from './components/infoTooltip';
import LeftPanel from './components/leftPanel';
import MainContainer from './components/mainContainer';
import Modal from './components/modal';
import RightPanel from './components/rightPanel';
import Styles from './index.module.scss';
import AddPathwayForm from './screens/addPathwayForm';
import CreatePathway from './screens/createPathway/createPathway';

const App = () => {
  const [isrightPanelDrawerVisible, setRightPanelDrawerVisible] =
    useState<boolean>(false);

  const [isCreatePathwayVisible, setIsCreatePathwayVisible] =
    useState<boolean>(false);
  const [isAddPathwayVisible, setIsAddPathwayVisible] =
    useState<boolean>(false);
  const [isConditionComponentVisible, setIsConditionComponentVisible] =
    useState<boolean>(false);
  const [isLeftDrawerVisible, setLeftDrawerVisible] = useState<boolean>(false);
  const leftDrawerVisible = () => {
    setLeftDrawerVisible(!isLeftDrawerVisible);
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
          className={
            Styles.leftdrawerWrapper +
            ' ' +
            (isLeftDrawerVisible ? '' : Styles.drawerOpen)
          }
        >
          <CustomDrawer
            width="28%"
            visible={isLeftDrawerVisible}
            onClose={() => setLeftDrawerVisible(false)}
            footer={[]}
            placement="left"
          >
            <LeftPanel onCloseHandler={() => setLeftDrawerVisible(false)} />
          </CustomDrawer>
          <FontAwesomeIcon
            icon={faAngleDoubleLeft}
            onClick={leftDrawerVisible}
            className={Styles.drawerIcon}
          />
        </div>
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
        <InfoTooltip
          title="Add your destination component"
          content="Drag your pre-selected destination component into the space provided, or search for a component to add"
          onClose={noop}
        />
      </MainContainer>
    </div>
  );
};

export default App;
