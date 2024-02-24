import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import md5 from 'md5';
import { TablePagination } from '@mui/material';

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
    const [page, setPage] = React.useState(0);
  
    const [rows, setRows] = useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };

    useEffect(() => {
        const fetchProducts = async () => {
            const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            const password = 'Valantis';
            const authString = md5(`${password}_${timestamp}`);

            try {
                const response = await fetch('http://api.valantis.store:40000/', {
                    method: 'POST',
                    headers: {
                        'X-Auth': authString,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "action": "get_ids",
                        "params": {"offset": 10, "limit": 50}
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                const resResponse = await fetch('http://api.valantis.store:40000/', {
                    method: 'POST',
                    headers: {
                        'X-Auth': authString,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "action": "get_items",
                        "params": data.result
                    }),
                });
                const resData = await response.json();

                setRows();

            } catch (error) {
                console.error("Fetching error:", error);
            }
        };

        fetchProducts();
    }, []);

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
                    {rows.map((row) => (
                        <StyledTableRow key={row.name}>
                            <StyledTableCell component="th" scope="row">
                                {row.id}
                            </StyledTableCell>
                            <StyledTableCell align="right">{row.name}</StyledTableCell>
                            <StyledTableCell align="right">{row.cost}</StyledTableCell>
                            <StyledTableCell align="right">{row.brand}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[50]}
                component="div"
                count={rows.length}
                rowsPerPage={50}
                page={page}
                onPageChange={handleChangePage}
            />
        </TableContainer>
    );
}

export default CustomizedTables;
