"use client";
import React, { forwardRef } from "react";
import { Alert, Snackbar, AlertProps } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { commonStore } from "../../store/reducers";

const AppAlert = forwardRef<HTMLDivElement, AlertProps>(function (props, ref) {
    return (
        <Alert
            elevation={6}
            ref={ref}
            variant="filled"
            {...props}
            sx={{ fontWeight: "bold" }}
        />
    );
});

const MessagePopup = () => {
    const dispatch = useDispatch();

    const getSeverity = (status: string) => {
        switch (status) {
            case "error":
            case "warning":
            case "info":
            case "success":
                return status;
            default:
                return "info";
        }
    };

    const messageState = useSelector(commonStore.selectMessageState);

    const handleClose = () => {
        dispatch(commonStore.actions.setDisplaymessage(false));
    };

    const onClick = () => { };

    return (
        <Snackbar
            open={messageState.display}
            message={messageState.message}
            autoHideDuration={2500}
            anchorOrigin={{
                vertical: "top",
                horizontal: messageState.status === "info" ? "center" : "right",
            }}
            onClose={handleClose}
            onClick={onClick}
            sx={{ cursor: "pointer" }}
        >
            <AppAlert
                onClose={handleClose}
                severity={getSeverity(messageState.status)}
            >
                {messageState.message}
            </AppAlert>
        </Snackbar>
    );
};

export default MessagePopup;