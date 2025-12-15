import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

type TableBodyProps<T extends object> = {
  rows: T[];
  columns: {
    columnId: keyof T;
    columnLabel: string;
    formatValue?: (value: keyof T, row: T) => string;
  }[];
};

export const AdaptiveTable = <T extends object>({
  rows = [],
  columns,
}: TableBodyProps<T>) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={String(column.columnId)} align="center">
                {column.columnLabel}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, rowIndex) => {
            return (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell key={column.columnLabel} align="center">
                    {column?.formatValue
                      ? column?.formatValue(row?.[String(column.columnId)], row)
                      : row?.[String(column.columnId)]}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
          {/* {rows.map((row, rowIndex) => {
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
          })} */}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
