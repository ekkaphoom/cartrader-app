import {
  AppBar,
  Button,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Link from "next/link";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  link: {
    textDecoration: "none",
    color: "white",
  },
}));

export function Nav() {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typography variant="h6" className={classes.title}>
          <Link href="/">
            <a className={classes.link}>Car Trader</a>
          </Link>
        </Typography>

        <Button color="inherit">
          <Link href="/">
            <a style={{ color: "white" }}>
              <Typography color="inherit">Home</Typography>
            </a>
          </Link>
        </Button>

        <Button color="inherit">
          <Link href="/faq">
            <a style={{ color: "white" }}>
              <Typography color="inherit">FAQ</Typography>
            </a>
          </Link>
        </Button>
      </Toolbar>
    </AppBar>
  );
}
