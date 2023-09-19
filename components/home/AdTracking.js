import React from 'react';
import * as Mui from '../muiImportComponents/HomeMUI';
import * as MuiIcon from '../muiImportComponents/MUIIcons';

const AdTracking = () => {
  return (
    <Mui.Grid
      container
      spacing={2}
      sx={{
        width: '100%',
        boxShadow: '1px 1px 6px 2px rgba(180, 180, 180, 0.1)',
        margin: '0 auto',
        marginTop: '15px',
        padding: '15px',
      }}
    >
      <Mui.Grid
        item
        xs={12}
        sm={6}
        lg={3}
        align="center"
        sx={{ borderRight: '2px solid #d9d9d9' }}
      >
        <MuiIcon.LocalShippingOutlinedIcon
          sx={{ fontSize: '48px', color: '#0088ff' }}
        />
        <Mui.Typography>Shipping Worldwide</Mui.Typography>
      </Mui.Grid>
      <Mui.Grid
        item
        xs={12}
        sm={6}
        lg={3}
        align="center"
        sx={{ borderRight: '2px solid #d9d9d9' }}
      >
        <MuiIcon.DepartureBoardOutlinedIcon
          sx={{ fontSize: '48px', color: '#0088ff' }}
        />
        <Mui.Typography>30 - Days Return</Mui.Typography>
      </Mui.Grid>
      <Mui.Grid
        item
        xs={12}
        sm={6}
        lg={3}
        align="center"
        sx={{ borderRight: '2px solid #d9d9d9' }}
      >
        <MuiIcon.LocalPoliceOutlinedIcon
          sx={{ fontSize: '48px', color: '#0088ff' }}
        />
        <Mui.Typography>Security Payment</Mui.Typography>
      </Mui.Grid>
      <Mui.Grid item xs={12} sm={6} lg={3} align="center">
        <MuiIcon.SpatialTrackingOutlinedIcon
          sx={{ fontSize: '48px', color: '#0088ff' }}
        />
        <Mui.Typography>Order Tracking</Mui.Typography>
      </Mui.Grid>
    </Mui.Grid>
  );
};

export default AdTracking;
