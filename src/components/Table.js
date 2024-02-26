import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { LinearProgress, TablePagination } from '@mui/material';
import { getProductIds, getProductsByIds } from '../api/productsApi';
import { getFilteredProductIds } from '../api/filterApi';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function CustomizedTables({ filters }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(50);
    const [allRows, setAllRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [displayRows, setDisplayRows] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let ids;
                if (Object.values(filters).some(filter => filter)) {
                    ids = await getFilteredProductIds(filters);
                } else {
                    ids = await getProductIds({ offset: page * rowsPerPage, limit: 100 });
                }
                if (ids.length > 0) {
                    const productsData = await getProductsByIds(ids);
                    const newData = productsData.reduce((acc, current) => {
                        if (!acc.find(item => item.id === current.id)) {
                            acc.push(current);
                        }
                        return acc;
                    }, []);
                    if (Object.values(filters).some(filter => filter)) {
                        setFilteredRows(newData);
                    } else {
                        setAllRows(prev => [...prev, ...newData]);
                    }
                }
            } catch (error) {
                console.error("Fetching error:", error);
            }
        };
        fetchProducts();
    }, [page, filters]);

    useEffect(() => {
        const rowsToDisplay = Object.values(filters).some(filter => filter) ? filteredRows : allRows;
        setDisplayRows(rowsToDisplay.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
    }, [page, filteredRows, allRows]);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };


    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>ID</StyledTableCell>
                        <StyledTableCell align="right">Название</StyledTableCell>
                        <StyledTableCell align="right">Цена</StyledTableCell>
                        <StyledTableCell align="right">Бренд</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {displayRows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} style={{ padding: 0 }}>
                                <LinearProgress color="inherit" style={{ width: '100%' }} />
                            </TableCell>
                        </TableRow>
                    ) : (
                        displayRows.map((row, index) => (
                            <StyledTableRow key={`${row.id}-${index}`}>
                                <StyledTableCell component="th" scope="row">
                                    {row.id}
                                </StyledTableCell>
                                <StyledTableCell align="right">{row.product}</StyledTableCell>
                                <StyledTableCell align="right">{row.price}</StyledTableCell>
                                <StyledTableCell align="right">{row.brand}</StyledTableCell>
                            </StyledTableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[50]}
                component="div"
                count={Object.values(filters).some(filter => filter) ? filteredRows.length : allRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
            />
        </TableContainer>
    );
}

export default CustomizedTables;

