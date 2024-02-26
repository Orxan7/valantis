import { Box } from "@mui/material";
import Search from "./Search";

function Filter({ onFilterChange }) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} >
        <Search label="Фильтр по названию" onChange={(value) => onFilterChange('name', value)} />
        <Search label="Фильтр по цене" onChange={(value) => onFilterChange('price', value)} />
        <Search label="Фильтр по бренду" onChange={(value) => onFilterChange('brand', value)} />
      </Box>
    );
  }
  

export default Filter;