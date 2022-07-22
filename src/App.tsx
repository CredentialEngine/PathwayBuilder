import React, { useState } from 'react';

import CustomDrawer from './components/customDrawer';
import MainContainer from './components/mainContainer';
import Modal from './components/modal';
import RightPanel from './components/rightPanel';
import AddPathwayForm from './screens/addPathwayForm';
import CreatePathway from './screens/createPathway/createPathway';
import Columns from './screens/homePage';
import SelectDestination from './screens/selectDestination';

const App = () => {
  const [isrightPanelDrawerVisible, setRightPanelDrawerVisible] =
    useState<boolean>(false);
  const [isCreatePathwayVisible, setIsCreatePathwayVisible] =
    useState<boolean>(true);
  const [isAddPathwayFormVisible, setIsAddPathwayFormVisible] =
    useState<boolean>(false);
  const [isAddPathwayDestinationVisible, setIsAddPathwayDestinationVisible] =
    useState<boolean>(false);
  const oncreatePathwayOkHandler = () => {
    setIsAddPathwayFormVisible(true);
    setIsCreatePathwayVisible(false);
  };

  const onCreatePathwayCancelHandler = () => {
    setIsCreatePathwayVisible(false);
  };

  const onAddPathwayOkHandler = () => {
    setIsAddPathwayFormVisible(false);
    setIsAddPathwayDestinationVisible(true);
  };

  const onAddPathwayCancelHandler = () => {
    setIsAddPathwayFormVisible(false);
  };

  const onCloseHandler = () => {
    const element = document.getElementById('left-frame');
    if (element != null) {
      element.style.display = 'none';
    }
    setRightPanelDrawerVisible(false);
  };

  return (
    <div>
      <MainContainer>
        <Columns />
        <Modal
          visible={isCreatePathwayVisible}
          onOk={oncreatePathwayOkHandler}
          onCancel={onCreatePathwayCancelHandler}
          title="Add a Pathway"
        >
          <CreatePathway />
        </Modal>

        <Modal
          visible={isAddPathwayFormVisible}
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
          visible={isAddPathwayDestinationVisible}
          title="Add a Pathway"
          footer={[]}
        >
          <SelectDestination
            setIsAddPathwayDestinationVisible={
              setIsAddPathwayDestinationVisible
            }
          />
        </Modal>
      </MainContainer>
    </div>
  );
};

export default App;
