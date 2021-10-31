import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import {
  useOrderInfoContext,
  usePaymentInfoContext,
} from '../../../context/UserProvider';
import cogoToast from 'cogo-toast';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

const PaymentForm = () => {
  const [addressState, setAddressState] = useOrderInfoContext ();
  const [paymentState, setPaymentState] = usePaymentInfoContext ();

  const handleChange = event => {
    setPaymentState ({
      ...paymentState,
      [event.target.name]: event.target.value,
    });
  };

  const handleExpDateChange = (value) => {
    setPaymentState ({
      ...paymentState,
      expDate: value,
    });
  }

  const handleBlur = event => {
    if (event.target.name === 'cardNumber') {
      if (
        event.target.value[0] === '4' &&
        (event.target.value.length > 13 && event.target.value.length < 16)
      ) {
        setPaymentState ({
          ...paymentState,
          cardType: 'Visa',
        });
      } else if (
        event.target.value[0] === '5' &&
        event.target.value.length === 16
      ) {
        setPaymentState ({
          ...paymentState,
          cardType: 'MasterCard',
        });
      } else {
        setPaymentState ({
          ...paymentState,
          cardType: '',
        });
        return cogoToast.error ('Card invalid');
      }
    }
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Metoda de plata
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardName"
            name="cardHolder"
            label="Numele de pe card"
            onChange={handleChange}
            fullWidth
            value={paymentState.cardHolder}
            autoComplete="cc-name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardNumber"
            name="cardNumber"
            type="number"
            label="Numarul cardului"
            fullWidth
            onBlur={handleBlur}
            onChange={handleChange}
            autoComplete="cc-number"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Basic example"
              id="expDate"
              name="expDate"
              label="Data de expirare"
              value={paymentState.expDate}
              onChange={handleExpDateChange}
              renderInput={params => <TextField {...params} />}
              inputFormat="MM/yyyy"
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cvv"
            type="number"
            name="cvv"
            onChange={handleChange}
            label="CVV"
            helperText="Ultimele trei cifre de pe spatele cardului"
            fullWidth
            autoComplete="cc-csc"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardType"
            name="cardType"
            label="Tipul cardului"
            readOnly
            fullWidth
            value={paymentState.cardType ? paymentState.cardType : 'Invalid'}
            autoComplete="cc-csc"
            variant="standard"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default PaymentForm;
