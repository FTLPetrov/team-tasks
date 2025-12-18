/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
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
    columnId: keyof T | "actions" | string;
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
    <Box
      sx={{
        height: 600,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <TableContainer
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
        }}
      >
        <Table stickyHeader sx={{ minWidth: 650, tableLayout: "fixed" }}>
          <TableHead>
            <TableRow sx={{ height: 80 }}>
              {columns.map((column) => (
                <TableCell
                  key={String(column.columnId)}
                  align="center"
                  sx={{
                    bgcolor: "background.paper",
                    ...column.columnTextStyle,
                  }}
                >
                  {column.columnLabel}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleRows.map((row: any, rowIndex) => (
              <TableRow key={rowIndex} sx={{ height: 80 }}>
                {columns.map((column) => {
                  const columnData = row[column.columnId];
                  return (
                    <TableCell
                      key={column.columnLabel}
                      align="center"
                      sx={column.rowCellTextStyle}
                    >
                      {column.renderCell?.(columnData, row) ??
                        column.formatValue?.(columnData, row) ??
                        columnData}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          mt: "auto",
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          gap: 2,
          p: 1,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
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
    </Box>
  );
};
