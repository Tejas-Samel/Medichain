import React, { Component } from "react";
import { Modal, Alert, Button } from "react-bootstrap";
import { createTheme } from "@material-ui/core/styles";


const theme = createTheme();
const modal = {
  display: "flex",
  backgroundColor: theme.palette.background.paper,
  border: "2px solid #000",
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2, 4, 3),
  position: "absolute",
  top: "5%",
  left: "40%",
  width: "20%",
  height:"40%",
  justifyContent: "center",
  alignContent: "center",
};
const modalHeader = {
  backgroundColor: theme.palette.background.paper,
  border: "1px   #111",
  boxShadow: theme.shadows[1],
  padding: theme.spacing(1, 4, 1),
};
const modalBody = {
  backgroundColor: theme.palette.background.paper,
  border: "2px #111",
  padding: theme.spacing(1, 4, 1),
  textAlign: "center",
};

const modalFooter = {
  border: "2px #111",
  alignItems: "center",
  justifyContent: "center",
};

class PopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertData: this.props.alertData,
      alertShow: this.props.alertShow,
      alertHeading: this.props.alertHeading,
      alertCloseFunc: this.props.alertCloseFunc,
    };
  }

  componentDidUpdate() {
    if (this.state.alertShow !== this.props.alertShow) {
      this.setState({
        alertData: this.props.alertData,
        alertHeading: this.props.alertHeading,
        alertShow: this.props.alertShow,
        alertCloseFunc: this.props.alertCloseFunc,
      });
    }
  }

  render() {
    return (
      <div>
        <Modal
          show={this.state.alertShow}
          onHide={() => this.state.alertCloseFunc()}
        >
          <Modal.Header >
            <Modal.Title >
              {this.state.alertHeading}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body >{this.state.alertData}</Modal.Body>
          <Modal.Footer >
            <Button
              variant="secondary"
              onClick={() => this.state.alertCloseFunc()}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default PopUp;
