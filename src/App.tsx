import React, { useState } from 'react';

import CustomDrawer from './components/customDrawer';

import Header from './components/header';
import MainContainer from './components/mainContainer';
import RightPanel from './components/rightPanel';

const App = () => {
  const [isrightPanelDrawerVisible, setRightPanelDrawerVisible] =
    useState<boolean>(true);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <MainContainer>
        <CustomDrawer></CustomDrawer>
        <CustomDrawer
          title="Transaction Review"
          width="60%"
          visible={isrightPanelDrawerVisible}
          onClose={() => setRightPanelDrawerVisible(false)}
          footer={[]}
        >
          <RightPanel />
        </CustomDrawer>
      </MainContainer>
    </div>
  );
};

export default App;
