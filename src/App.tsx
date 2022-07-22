import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './App.scss';
import { noop } from 'lodash';
import React, { useState } from 'react';

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
import PreSelectResourceCreatePath from './screens/preSelectResourceCreatePath';

const App = () => {
  const [isrightPanelDrawerVisible, setRightPanelDrawerVisible] =
    useState<boolean>(false);
  const [isCreatePathwayVisible, setIsCreatePathwayVisible] =
    useState<boolean>(false);
  const [isAddPathwayVisible, setIsAddPathwayVisible] =
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
  };

  const onAddPathwayCancelHandler = () => {
    setIsAddPathwayVisible(false);
  };

  const onCloseHandler = () => {
    setRightPanelDrawerVisible(false);
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
          width="700"
        >
          {/* <SelectDestination /> */}
          <PreSelectResourceCreatePath />
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
