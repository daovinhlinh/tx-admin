import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import React, { useCallback } from "react";
import { TableComponents, TableVirtuoso } from "react-virtuoso";

export interface VirtualizedTableData {
  date: Date;
  time: Date;
  reward: string;
  status: string;
}

export interface ColumnData {
  dataKey: keyof VirtualizedTableData;
  label: string;
  numeric?: boolean;
  width?: number;
}

const VirtuosoTableComponents: TableComponents<VirtualizedTableData> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
    />
  ),
  TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableRow,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

function fixedHeaderContent(columns: ColumnData[]) {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          sortDirection="desc"
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? "right" : "left"}
          style={{ width: column.width }}
          sx={{ backgroundColor: "background.paper" }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

// function rowContent(_index: number, row: Data) {
//   return (
//     <React.Fragment>
//       {columns.map((column) => (
//         <TableCell
//           key={column.dataKey}
//           align={column.numeric || false ? "right" : "left"}
//         >
//           {row[column.dataKey]}
//         </TableCell>
//       ))}
//     </React.Fragment>
//   );
// }

const VirtualizedTable = ({
  data,
  columns,
}: {
  data: VirtualizedTableData[];
  columns: ColumnData[];
}) => {
  const memoizedColumns = useCallback(
    () => fixedHeaderContent(columns),
    [columns]
  );

  const rowContent = useCallback(
    (_index: number, row: VirtualizedTableData) => {
      return (
        <React.Fragment>
          {columns.map((column) => {
            let value;
            if (column.dataKey === "date") {
              value = moment(row[column.dataKey]).format("DD-MM-YYYY");
            } else if (column.dataKey === "time") {
              value = moment(row[column.dataKey]).format("HH:mm:ss");
            } else {
              value = row[column.dataKey];
            }

            return (
              <TableCell
                sortDirection={"asc"}
                key={column.dataKey}
                align={column.numeric || false ? "right" : "left"}
              >
                {/* {row[column.dataKey]} */}
                {value}
              </TableCell>
            );
          })}
        </React.Fragment>
      );
    },
    [columns]
  );

  return (
    <Paper style={{ height: 400, width: "100%" }}>
      <TableVirtuoso
        data={data}
        components={VirtuosoTableComponents}
        fixedHeaderContent={memoizedColumns}
        itemContent={rowContent}
      />
    </Paper>
  );
};

export default VirtualizedTable;
