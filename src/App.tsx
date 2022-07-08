import React from 'react';

import Header from './components/header';
import MainContainer from './components/mainContainer';
import RightPanel from './components/rightPanel';

const App = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}
  >
    <Header />
    <MainContainer>
      {/* <CreatePathway visible={true} /> */}
      <RightPanel visible={false} />
    </MainContainer>
  </div>
);

export default App;
