import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

export default function Title(props) {
    return (
        <Typography component="p" variant="h4" color="primary" gutterBottom align='center'>
            {props.children}
        </Typography>
    );
}

Title.propTypes = {
    children: PropTypes.node,
};