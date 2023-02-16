import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import React from "react";

const copyright = {
  Copyright() {
    return (
      <Typography
        variant="body2"
        // color="textSecondary"
        align="center"
        style={{ color: "#424242" }}
      >
        <b>Copyright ©</b>
        
        <Link color="inherit" href="/mediChain" style={{ color: "#424242" }}>
          MediChain
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  },
};

export { copyright as default };
