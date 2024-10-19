import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";

const defaultErrors = {
  firstName: "",
  lastName: "",
  coins: "",
};

interface IFormDialogProps {
  onSubmit?: (value: IFormDialogValue) => void;
}

interface IFormDialogValue {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  coins: number;
}

export const FormDialog = React.forwardRef((props: IFormDialogProps, ref) => {
  const [open, setOpen] = React.useState(false);
  const [formValue, setFormValue] = React.useState<IFormDialogValue>({
    coins: 0,
    email: "",
    firstName: "",
    id: "",
    lastName: "",
    phone: "",
    username: "",
  });
  const [errors, setErrors] = useState(defaultErrors);

  const validateField = (name, value) => {
    let errorMessage = "";
    switch (name) {
      case "firstName":
        errorMessage = value ? "" : "First name is required";
        break;
      case "lastName":
        errorMessage = value ? "" : "Last name is required";
        break;
      case "phone":
        errorMessage =
          value && !/^\d+$/.test(value) ? "Phone number must be numeric" : "";
        break;
      default:
        break;
    }
    setErrors({ ...errors, [name]: errorMessage });
  };

  React.useImperativeHandle(ref, () => ({
    open: handleClickOpen,
    close: handleClose,
  }));

  const handleClickOpen = (value: IFormDialogValue) => {
    setFormValue(value);
    setOpen(true);
  };

  const handleClose = () => {
    setErrors(defaultErrors);
    setOpen(false);
  };

  // const handleSelect = (event) => {
  //   setFormValue({ ...formValue, group: event.target.value });
  // };

  const handleSubmit = () => {
    let hasError = false;
    Object.keys(formValue).forEach((key) => {
      validateField(key, formValue[key]);
      if (errors[key]) {
        hasError = true;
      }
    });

    if (!hasError) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      props.onSubmit && props.onSubmit(formValue);
      handleClose();
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            validateField(event.target.name, event.target.value);
            setFormValue({
              ...formValue,
              [event.target.name]: event.target.value,
            });
          },
        }}
      >
        <DialogTitle>User detail</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText> */}
          <TextField
            disabled
            margin="dense"
            id="username"
            name="username"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={formValue.username}
          />
          <TextField
            required
            disabled
            id="firstName"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={formValue.firstName}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
          <TextField
            required
            disabled
            id="lastName"
            name="lastName"
            label="Last Name"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={formValue.lastName}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
          <TextField
            // required
            disabled
            margin="dense"
            id="phone"
            name="phone"
            label="Phone"
            type="number"
            fullWidth
            variant="standard"
            defaultValue={formValue.phone}
          />
          <TextField
            // required
            disabled
            margin="dense"
            id="email"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            defaultValue={formValue.email}
          />
          <TextField
            required
            margin="dense"
            id="coins"
            name="coins"
            label="Coins"
            type="number"
            fullWidth
            variant="standard"
            defaultValue={formValue.coins}
            error={!!errors.coins}
            helperText={errors.coins}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
});
