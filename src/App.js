import React, { useState } from 'react';
import { Container } from '@mui/material';
import ViewBar from './Viewbar';
import AllProjects from './allProjects';
import Development from './Development';
import Data from './Data';
import Marketing from './Marketing';

function App() {
  const [selectedTab, setSelectedTab] = useState(0);

  const renderContent = () => {
    switch (selectedTab) {
      case 0: return <AllProjects />;
      case 1: return <Development />;
      case 2: return <Data />;
      case 3: return <Marketing />;
      default: return <AllProjects />;
    }
  };

  return (
    <Container maxWidth="lg">
      <ViewBar onTabChange={setSelectedTab} />
      {renderContent()}
    </Container>
  );
}

export default App;
