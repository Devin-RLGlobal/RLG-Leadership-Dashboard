import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';

const ViewBar = ({ onTabChange }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (onTabChange) {
      onTabChange(newValue);
    }
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Tabs value={selectedTab} onChange={handleChange} centered indicatorColor="primary">
        <Tab label="All Projects" />
        <Tab label="Development" />
        <Tab label="Data" />
        <Tab label="Marketing" />
      </Tabs>
    </Box>
  );
};

export default ViewBar;
