import React from "react";
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Chip,
  Typography,
} from "@material-ui/core";
import useStyles from "../../styles";
import { StringUtil } from "../../../../utils/string";

const states = {
  normal: "success",
  high: "warning",
  low: "secondary",
};

const TableHeader = ["Username", "Email", "Phone", "Coins"];

export default function TableComponent({ data }) {
  const classes = useStyles();
  // var keys = Object.keys(data[0]).map(i => i.toUpperCase());
  // keys.shift(); // delete "id" key
  return (
    <Table className="mb-0">
      <TableHead>
        <TableRow>
          {TableHeader.map((key) => (
            <TableCell key={key}>{key}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {!data || data.length === 0 ? (
          <Typography size="xl" weight="medium" noWrap>
            No data
          </Typography>
        ) : (
          data.users.map(({ _id, username, email, phone, coins }) => (
            <TableRow key={_id}>
              <TableCell className="pl-3 fw-normal">{username}</TableCell>
              <TableCell>{email}</TableCell>
              <TableCell>{phone}</TableCell>
              <TableCell>{coins}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
