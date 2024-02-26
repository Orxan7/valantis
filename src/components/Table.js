import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TablePagination } from '@mui/material';
import { getProductIds, getProductsByIds } from '../api/productsApi';

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

function CustomizedTables() {
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(50);
    const [offset, setOffset] = useState(0);
    const [allRows, setAllRows] = useState([]);
    const [displayRows, setDisplayRows] = useState([]);


    const handleChangePage = (event, newPage) => {
        const newOffset = newPage * rowsPerPage;
        setOffset(newOffset);
        setPage(newPage);
        setDisplayRows(allRows.slice(newOffset, newOffset + rowsPerPage));
    };


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if (allRows.length <= offset + rowsPerPage) {
                    const ids = await getProductIds({ offset: allRows.length, limit: 100});
                    const uniqueIds = ids.filter(id => !allRows.find(row => row.id === id));
                    const productsData = await getProductsByIds(uniqueIds);
                    const newAllRows = [...allRows, ...productsData].reduce((acc, current) => {
                        const x = acc.find(item => item.id === current.id);
                        if (!x) {
                            return acc.concat([current]);
                        } else {
                            return acc;
                        }
                    }, []);
                    setAllRows(newAllRows);
                }
                setDisplayRows(allRows.slice(offset, offset + rowsPerPage));
            } catch (error) {
                console.error("Fetching error:", error);
            }
        };

        fetchProducts();
    }, [offset, allRows]);


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
                    {displayRows.map((row) => (
                        <StyledTableRow key={row.id}>
                            <StyledTableCell component="th" scope="row">
                                {row.id}
                            </StyledTableCell>
                            <StyledTableCell align="right">{row.product}</StyledTableCell>
                            <StyledTableCell align="right">{row.price}</StyledTableCell>
                            <StyledTableCell align="right">{row.brand}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>

            </Table>
            <TablePagination
                rowsPerPageOptions={[50]}
                component="div"
                count={-1}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
            />
        </TableContainer>
    );
}

export default CustomizedTables;
