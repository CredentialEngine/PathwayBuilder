import React from 'react';

import Header from './components/header';
import MainContainer from './components/mainContainer';
import CreatePathway from './screens/createPathway/createPathway';

const App = () => (
  <div>
    <Header />
    <MainContainer>
      <CreatePathway visible={true} />
    </MainContainer>
  </div>
);

export default App;
