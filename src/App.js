import { Box } from '@mui/material';
import './App.css';
import Filter from './components/Filter';
import CustomizedTables from './components/Table';
import { useState } from 'react';

function App() {
  const [filters, setFilters] = useState({ name: '', price: '', brand: '' });

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  return (
    <div className="App">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Filter onFilterChange={handleFilterChange} />
        <CustomizedTables filters={filters} />
      </Box>
    </div>
  );
}

export default App;
