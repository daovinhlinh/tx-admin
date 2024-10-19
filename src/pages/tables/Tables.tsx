/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import ClearIcon from "@mui/icons-material/Clear";
import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
// components
// import MUIDataTable from "mui-datatables";
// data
import { Box, IconButton, TextField } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridPaginationModel,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
} from "@mui/x-data-grid";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { gameApi, IResponseMessage } from "../../api";
import PageTitle from "../../components/PageTitle/PageTitle";
import VirtualizedTable, {
  ColumnData,
  VirtualizedTableData,
} from "../../components/VirtualizedTable";
import {
  gameAction,
  useGameDispatch,
  useGameState,
} from "../../context/GameContext";
import { useStyles } from "./styles";
import moment from "moment";
import { ICheckIn, ICheckInConfig } from "../../models/CheckIn";

export enum ConfirmDialogMode {
  Delete = "delete",
  Update = "update",
}

interface RowData {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  coins: number;
}

interface QuickSearchToolbarProps {
  clearSearch: () => void;
  onChange: () => void;
  value: string;
}

const checkInTableColumns: ColumnData[] = [
  {
    width: 100,
    label: "Ngày",
    dataKey: "date",
  },
  {
    width: 100,
    label: "Thời gian đăng nhập",
    dataKey: "time",
  },
  {
    width: 50,
    label: "Phần thưởng",
    dataKey: "reward",
    // numeric: false,
  },
  {
    width: 100,
    label: "Trạng thái",
    dataKey: "status",
  },
];

const now = moment(); // Current date and time
const startOfMonth = now.clone().startOf("month");
const currentDayOfMonth = now.date(); // Today's date in the month

const QuickSearchToolbar = (props: QuickSearchToolbarProps) => {
  const classes = useStyles();

  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
      }}
    >
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search…"
        className={classes.textField}
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? "visible" : "hidden" }}
              onClick={props.clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
      />
    </Box>
  );
};

export default function Tables() {
  const gameState = useGameState();
  const dispatch = useGameDispatch();
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [confirmDialog, setConfirmDialog] = useState<
    | {
        mode: ConfirmDialogMode;
        row: RowData;
      }
    | undefined
  >(undefined);

  const [checkinDialog, setCheckinDialog] = useState(undefined);
  const [checkinData, setCheckinData] = useState<VirtualizedTableData[] | null>(
    null
  );
  const [checkinConfig, setCheckinConfig] = useState<
    ICheckInConfig | undefined
  >();

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });
  const [searchText, setSearchText] = React.useState("");
  const rowCountRef = useRef(gameState.user?.totalDocs || 0);

  const rowCount = useMemo(() => {
    if (gameState.user?.totalDocs !== undefined) {
      rowCountRef.current = gameState.user?.totalDocs;
    }
    return rowCountRef.current;
  }, [gameState.user]);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 70, disableExport: true },
      { field: "username", headerName: "Username", width: 130 },
      { field: "firstName", headerName: "First name" },
      { field: "lastName", headerName: "Last name" },
      { field: "phone", headerName: "Phone" },
      { field: "email", headerName: "Email" },
      {
        field: "coins",
        headerName: "Coins",
        type: "number",
        editable: true,
        width: 200,
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        width: 100,
        cellClassName: "actions",
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: "primary.main",
                }}
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          }

          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<EventAvailableIcon />}
              label="Check In"
              onClick={() => {
                getCheckinHistory(id);
                setCheckinDialog(id);
              }}
              color="inherit"
            />,
          ];
        },
      },
    ],
    [rowModesModel, gameState.user]
  );

  const getUsetList = async (page: number, pageSize: number) => {
    gameAction.getGameUserList(dispatch, page, pageSize);
  };

  const getCheckinConfig = async () => {
    const { data, message } = await gameApi.getCheckInConfig();
    if (message === IResponseMessage.OK) {
      setCheckinConfig(data);
    }
  };

  useEffect(() => {
    if (gameState.user == null) {
      getUsetList(paginationModel.page, paginationModel.pageSize);
    }
    getCheckinConfig();
  }, []);

  const renderConfirmDialog = () => {
    return (
      <Dialog maxWidth="xs" open={confirmDialog != null}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent
          dividers
        >{`Pressing 'Yes' will delete user ${confirmDialog?.row?.username}`}</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(undefined)}>No</Button>
          <Button
            onClick={
              confirmDialog?.mode === ConfirmDialogMode.Delete
                ? onDelete(confirmDialog?.row.id)
                : handleSaveClick(confirmDialog?.row.id)
            }
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const rows: RowData[] = useMemo(() => {
    if (gameState.user == null) return [];
    return gameState.user?.data.map((user) => {
      return {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phoneNumber,
        email: user.email,
        coins: user.coins,
      };
    });
  }, [gameState.user]);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setConfirmDialog({
      mode: ConfirmDialogMode.Delete,
      row: rows.find((row) => row.id === id)!,
    });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdate = async (
    newRow: GridRowModel,
    oldRow: GridRowModel
  ) => {
    const success = await onSubmit(newRow);
    if (success) {
      const updatedRow = { ...newRow, isNew: false };
      return updatedRow;
    }
    return oldRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const onDelete = (id: string) => async () => {
    try {
      await gameAction.deleteUser(id, gameState, dispatch);
      // setRows(rows.filter((row) => row.id !== id));
      toast.success("Delete user success");
      setConfirmDialog(undefined);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
      toast.error("Delete user failed");
    }
  };

  const onSubmit = async (newRow: GridRowModel) => {
    try {
      // await updateUser(value, gameState, dispatch);
      await gameAction.updateCoin(
        newRow["id"],
        newRow["coins"],
        gameState,
        dispatch
      );

      toast.success("Update user success");
      return true;
    } catch (err: unknown) {
      toast.error("Update user failed");
      return false;
    }
  };

  const requestSearch = (searchValue: string) => {
    setSearchText(searchValue);
    searchUser(searchValue);
    // setRows(filteredRows);
  };

  const searchUser = useCallback(
    debounce(async (searchText: string) => {
      try {
        await gameAction.searchUser(searchText, dispatch);
      } catch (error) {
        console.log("result console.error();", error);
      }
    }, 500),
    []
  );

  const generateCheckInStatusList = (checkIns: ICheckIn[]) => {
    const checkInStatusList = [];
    if (checkinConfig != null) {
      for (let day = 1; day <= currentDayOfMonth; day++) {
        const currentDay = startOfMonth.clone().date(day);

        // Find check-in for the day in history list
        const checkInForDay = checkIns.find((checkIn) =>
          moment(checkIn.createdAt).isSame(currentDay, "day")
        );

        // Find if the day is a special day in config
        const specialDayConfig = checkinConfig.specialDays.find((specialDay) =>
          moment(specialDay.date).isSame(currentDay, "day")
        );

        // Determine reward based on check-in history, special day, or default coins
        const reward = checkInForDay
          ? checkInForDay.coins ?? 0
          : specialDayConfig
          ? specialDayConfig.coins
          : checkinConfig.defaultCoins;

        // Set status based on whether the user checked in that day
        const status = checkInForDay ? "Đã nhận" : "Chưa nhận";

        const statusObject = {
          date: currentDay.toDate(),
          time: currentDay.toDate(),
          reward: `${reward} coins`,
          status: status,
        };

        checkInStatusList.push(statusObject);
      }
    } else {
      toast.error("Get check in history error");
    }

    return checkInStatusList;
  };

  const getCheckinHistory = async (id: GridRowId) => {
    const { data, message } = await gameApi.getCheckInHistory(id.toString());

    if (message === IResponseMessage.OK) {
      const list = generateCheckInStatusList(data.docs);
      setCheckinData(list);
    } else {
      toast.error("Get check in data error");
    }
  };

  const onCloseCheckInHistory = () => {
    setCheckinDialog(undefined);
    setCheckinData(null);
  };

  return (
    <>
      <PageTitle title="Tables" color={"black"} />
      <Grid item xs={12}>
        {gameState.user ? (
          <DataGrid
            style={{
              backgroundColor: "white",
            }}
            rows={rows}
            columns={columns}
            rowCount={rowCount}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            // autosizeOnMount
            paginationModel={paginationModel}
            onPaginationModelChange={(models: GridPaginationModel) => {
              if (searchText == "") {
                getUsetList(models.page, models.pageSize);
              }
              setPaginationModel(models);
            }}
            processRowUpdate={processRowUpdate}
            sx={{ border: 0 }}
            slots={{ toolbar: QuickSearchToolbar }}
            slotProps={{
              toolbar: {
                value: searchText,
                onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                  requestSearch(event.target.value),
                clearSearch: () => {
                  setSearchText("");
                  getUsetList(0, paginationModel.pageSize);
                },
              },
            }}
            paginationMode="server"
          />
        ) : (
          <>
            <Skeleton animation="wave" height={50} />
            <Skeleton animation="wave" height={50} />
            <Skeleton animation="wave" height={50} />
          </>
        )}
        {renderConfirmDialog()}
        {/* <FormDialog ref={ref} onSubmit={onSubmit} /> */}
        <Dialog
          fullWidth={true}
          maxWidth={"md"}
          open={checkinDialog != null}
          onClose={onCloseCheckInHistory}
        >
          <DialogTitle>Check in history</DialogTitle>
          <VirtualizedTable
            columns={checkInTableColumns}
            data={checkinData ?? []}
          />
        </Dialog>
      </Grid>
    </>
  );
}
