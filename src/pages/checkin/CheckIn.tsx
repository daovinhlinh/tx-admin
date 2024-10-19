import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
} from "@material-ui/core";
import React, { useEffect, useState, useMemo } from "react";
import { gameApi, IErrorResponse, IResponseMessage } from "../../api";
import PageTitle from "../../components/PageTitle/PageTitle";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";
import { ISpecialDay } from "../../models/CheckIn";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  useGridApiRef,
} from "@mui/x-data-grid";
import { Skeleton } from "@mui/lab";
import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { ConfirmDialogMode } from "../tables/Tables";
import moment from "moment";
import { Stack } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { AxiosResponse } from "axios";
import { Typography } from "../../components/Wrappers/Wrappers";

type ISpecialDayWithStringDate = Omit<ISpecialDay, "date" | "_id"> & {
  id: string;
  date: string;
};

const defaultNewDayData = {
  date: new Date(),
  coins: 1000,
};

const CheckIn = () => {
  const apiRef = useGridApiRef();

  const [defaultCoins, setDefaultCoins] = useState(0);
  const [specialDays, setSpecialDays] = useState<
    ISpecialDayWithStringDate[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [confirmDialog, setConfirmDialog] = useState<
    | {
        mode: ConfirmDialogMode;
        row: ISpecialDayWithStringDate;
      }
    | undefined
  >(undefined);

  const [showNewDayDialog, setShowNewDayDialog] = useState(false);

  const [newDayData, setNewDayData] = useState(defaultNewDayData);

  const handleUpdateRow = (data: ISpecialDay) => {
    apiRef.current.updateRows([{ id: data._id, data }]);
  };

  const getCheckinConfig = async () => {
    const { data, message } = await gameApi.getCheckInConfig();
    if (message === IResponseMessage.OK) {
      setDefaultCoins(data.defaultCoins);

      const dayList = data.specialDays.map((day) => ({
        id: day._id,
        date: moment(day.date).format("DD-MM-YYYY"),
        coins: day.coins,
      }));

      setSpecialDays(dayList);
    }
    setLoading(false);
  };

  const addSpecialDay = async () => {
    try {
      // apiRef.current.updateRows([{ id: "123", date: new Date(), coins: 1200 }]);
      const { data, message } = await gameApi.addSpecialDay(
        newDayData.coins,
        moment(newDayData.date).format("YYYY-MM-DD")
      );

      if (message === IResponseMessage.OK) {
        toast.success("Add success");
        // handleUpdateRow(data);
        apiRef.current.updateRows([
          {
            id: data._id,
            date: moment(data.date).format("DD-MM-YYYY"),
            coins: data.coins,
          },
        ]);
      } else {
        toast.error(message);
      }
    } catch (error: AxiosResponse<IErrorResponse> | unknown) {
      toast.error(
        (error as AxiosResponse<IErrorResponse>).response.data.message
      );
    }

    setShowNewDayDialog(false);
  };

  const updateRewardCoin = async () => {
    setLoading(true);
    const { data, message } = await gameApi.updateRewardCoin(defaultCoins);
    if (message === IResponseMessage.OK) {
      setDefaultCoins(data.defaultCoins);
      toast.success("Update success");
    } else {
      toast.error("Update failed");
    }
    setLoading(false);
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: string) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: string) => () => {
    const row = apiRef.current.getRow(id);

    if (row) {
      setConfirmDialog({
        mode: ConfirmDialogMode.Delete,
        row: {
          id: row.id,
          coins: row.coin,
          date: `${moment(row.date, "DD-MM-YYYY").toDate()}`,
        },
      });
    } else {
      toast.error("Delete error");
    }
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
    const { message } = await gameApi.updateSpecialDayCoin(
      newRow["id"],
      newRow["coins"]
    );

    if (message === IResponseMessage.OK) {
      toast.success("Update success");
      const updatedRow = { ...newRow, isNew: false };
      return updatedRow;
      // setSpecialDays(data.specialDays)
    } else {
      toast.error("Update failed");
      return oldRow;
    }
  };

  const columns: GridColDef[] = [
    // { field: "_id", headerName: "ID", width: 150, disableExport: true },
    { field: "date", headerName: "Date", width: 230 },
    {
      field: "coins",
      headerName: "Coins",
      type: "number",
      editable: true,
      width: 230,
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
        ];
      },
    },
  ];

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const onDelete = async (id: string) => {
    try {
      await gameApi.deleteSpecialDay(id);
      apiRef.current.updateRows([{ id, _action: "delete" }]);
      // setRows(rows.filter((row) => row.id !== id));
      toast.success("Delete success");
      setConfirmDialog(undefined);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    getCheckinConfig();
  }, []);

  return (
    <>
      <PageTitle title="Check in" />
      <Container>
        <Grid item xs={12}>
          <TextField
            label="Default reward coins"
            placeholder="Enter daily reward coins"
            value={defaultCoins}
            onChange={(e) => setDefaultCoins(Number(e.target.value))}
          />
          <LoadingButton
            onClick={updateRewardCoin}
            loading={loading}
            variant="outlined"
          >
            Submit
          </LoadingButton>
          <Divider />
          <Stack alignItems={"flex-start"} marginY={2}>
            <Typography color="black" variant="h3">
              Special day
            </Typography>
            <Typography color="black" variant="h5">
              Add special day for special check-in reward
            </Typography>
            <Button
              size="small"
              variant="contained"
              onClick={() => setShowNewDayDialog(true)}
            >
              Add
            </Button>
          </Stack>
          {specialDays != null ? (
            <DataGrid
              apiRef={apiRef}
              // getRowId={(row) => row._id}
              rows={specialDays}
              columns={columns}
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
            />
          ) : (
            <>
              <Skeleton animation="wave" height={50} />
              <Skeleton animation="wave" height={50} />
              <Skeleton animation="wave" height={50} />
            </>
          )}
        </Grid>
        <Dialog maxWidth="xs" open={confirmDialog != null}>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogContent dividers>{`Pressing 'Yes' will delete day ${moment(
            confirmDialog?.row?.date
          ).format("DD-MM-YYYY")}`}</DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialog(undefined)}>No</Button>
            <Button onClick={() => onDelete(confirmDialog?.row.id)}>Yes</Button>
          </DialogActions>
        </Dialog>
        <Dialog maxWidth="xs" open={showNewDayDialog}>
          <DialogTitle>New Special Day</DialogTitle>
          <DialogContent dividers>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                value={moment(newDayData.date)}
                label="Date"
                format="DD/MM/YYYY"
                onChange={(e) => {
                  if (e) {
                    setNewDayData({
                      ...newDayData,
                      date: e.toDate(),
                    });
                  }
                }}
              />
            </LocalizationProvider>
            <TextField
              value={newDayData.coins}
              variant="standard"
              type="number"
              label="Reward Coins"
              onChange={(e) => {
                setNewDayData({
                  ...newDayData,
                  coins: Number(e.target.value),
                });
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowNewDayDialog(false)}>No</Button>
            <Button onClick={addSpecialDay}>Yes</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default CheckIn;
