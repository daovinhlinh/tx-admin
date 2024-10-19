import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useSocket } from "../../context/SocketContext";

// styles

const Notifications = () => {
  const socket = useSocket();
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    socket?.emit("pushNotification", inputValue);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start">
      <PageTitle title="Notifications" />

      <Container maxWidth="sm">
        <Typography variant="h6" gutterBottom color="black">
          Enter notification to push to all users
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="myInput"
            label="Message"
            name="myInput"
            autoFocus
            placeholder="Enter Message"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </Container>
    </Box>
  );
};

export default Notifications;
