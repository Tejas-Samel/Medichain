import React, { Component } from 'react';
import { bgBlur } from '../cssStyles';
import { styled } from '@mui/material/styles';
import { AppBar } from '@mui/material';
import { NAV_WIDTH } from '../../genericFiles/constants';




const StyledRoot = styled(AppBar)(({ theme }) => ({
    ...bgBlur({ color: theme.palette.background.default }),
    boxShadow: 'none',
    [theme.breakpoints.up('lg')]: {
      width: `calc(100% - ${NAV_WIDTH + 1}px)`,
    },
  }));



export default StyledRoot;



