import { Step, StepLabel, Stepper } from '@mui/material';
import React from 'react';

const CheckoutWizard = ({ activeStep = 0 }) => {
  return (
    <Stepper
      activeStep={activeStep}
      alternativeLabel
      sx={{ marginTop: '30px' }}
    >
      {['Login', 'Shipping Address', 'Payment Method', 'Place Order'].map(
        step => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        )
      )}
    </Stepper>
  );
};

export default CheckoutWizard;
