import Dialog from "@material-ui/core/Dialog";
import PropTypes from "prop-types";
import React from "react";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function SpinnerDialog(props) {
    const {open} = props;
    return (
        <Dialog scroll={'body'} aria-labelledby="simple-dialog-title" open={open}>
            <DialogContent>
                <CircularProgress/>
            </DialogContent>
        </Dialog>
    );
}

SpinnerDialog.propTypes = {
    open: PropTypes.bool.isRequired,
};