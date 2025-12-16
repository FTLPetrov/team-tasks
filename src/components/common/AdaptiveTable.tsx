/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  MenuItem,
  Pagination,
  TextField,
  type SxProps,
  type Theme,
} from "@mui/material";
import { useEffect, useState, type ReactNode } from "react";

type TableBodyProps<T extends object> = {
  rows: T[];
  columns: {
    columnId: keyof T | "actions";
    columnLabel: string;
    columnTextStyle?: SxProps<Theme>;
    rowCellTextStyle?: SxProps<Theme>;

    formatValue?: (value: keyof T, row: T) => string | number;
    renderCell?: (value: keyof T, row: T) => ReactNode;
  }[];
};

export const AdaptiveTable = <T extends object>({
  rows = [],
  columns,
}: TableBodyProps<T>) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const pageCount = Math.max(1, Math.ceil(rows.length / rowsPerPage));

  useEffect(() => {
    setPage(1);
  }, [rowsPerPage]);

  const lastPerPage = page * rowsPerPage;
  const visibleRows = rows.slice(lastPerPage - rowsPerPage, lastPerPage);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={String(column.columnId)}
                align="center"
                sx={column?.columnTextStyle}
              >
                {column.columnLabel}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {visibleRows.map((row: any, rowIndex) => {
            if (!row) return null;

            return (
              <TableRow key={rowIndex}>
                {columns.map((column) => {
                  const columnData = row[column.columnId];

                  return (
                    <TableCell
                      key={column.columnLabel}
                      align="center"
                      sx={column?.rowCellTextStyle}
                    >
                      {column?.renderCell?.(columnData, row) ??
                        column?.formatValue?.(columnData, row) ??
                        columnData}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Box display={"flex"} justifyContent={"end"} alignItems={"center"} p={1}>
        <TextField
          label="Rows"
          select
          size="small"
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          sx={{ width: 100 }}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
        </TextField>

        <Pagination count={pageCount} page={page} onChange={handleChange} />
      </Box>
      
    </TableContainer>
  );
};

{
  /* {rows.map((row, rowIndex) => {
  const record = row as Record<string, unknown>;

  return (
    <TableRow key={String(record.id ?? rowIndex)}>
      {keys.map((key) => (
        <TableCell key={key} align="center">
          {resolveValue(key, record[key])}
        </TableCell>
      ))}
    </TableRow>
  );
})} */
}
