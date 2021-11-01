import React, {useState, useRef} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import AddressForm from './steps/AddressForm';
import PaymentForm from './steps/PaymentForm';
import axios from 'axios';
import {
  useOrderInfoContext,
  useTotalPrice,
  usePaymentInfoContext,
} from '../../context/UserProvider';
import cogoToast from 'cogo-toast';
import Pdf from 'react-to-pdf';
import './BuyTickets.css';

const steps = ['Alege biletul', 'Detalii de plata'];

const getStepContent = step => {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <PaymentForm />;
    default:
      throw new Error ('Unknown step');
  }
};

const theme = createTheme ();

const BuyTickets = () => {
  const [activeStep, setActiveStep] = useState (0);
  const [addressState, setAddressState] = useOrderInfoContext ();
  const [paymentState, setPaymentState] = usePaymentInfoContext ();
  const [totalPrice, setTotalPrice] = useTotalPrice ();

  const ref = useRef ();

  const handleNext = async () => {
    if (activeStep === 0) {
      if (
        addressState.fullName === '' ||
        addressState.lastName === '' ||
        addressState.address === '' ||
        addressState.judet === '' ||
        addressState.localitate === '' ||
        addressState.zip === '' ||
        addressState.chosenSeat === '' ||
        addressState.ticketType === ''
      ) {
        return cogoToast.error ('Toate campurile sunt obligatorii');
      } else {
        setPaymentState ({
          ...paymentState,
          cardHolder: addressState.lastName + ' ' + addressState.firstName,
        });

        setActiveStep (activeStep + 1);
      }
    } else if (activeStep === 1) {
      if (
        paymentState.cardHolder === '' ||
        paymentState.cardNumber === '' ||
        paymentState.expDate === '' ||
        paymentState.cvv === '' ||
        paymentState.cardType === ''
      ) {
        return cogoToast.error ('Toate campurile sunt obligatorii');
      } else if (paymentState.cvv.length !== 3) {
        return cogoToast.error ('CVV trebuie sa aiba 3 cifre');
      } else {
        try {
          const confirmPayment = await axios.post (
            'http://localhost:1337/confirmPayment',
            {
              addressState,
              paymentState,
              totalPrice,
            },
            {
              headers: {
                Authorization: 'Bearer ' + localStorage.getItem ('jwt'),
              },
            }
          );

          if (confirmPayment.status === 200) {
            setActiveStep (activeStep + 1);
          }
        } catch (e) {
          console.log (e);
        }
      }
    }
  };

  const handleBack = () => {
    setActiveStep (activeStep - 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="primary"
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: t => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Bilete FCSB-Dinamo
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="sm" sx={{mb: 4}}>
        <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
          <Typography component="h1" variant="h4" align="center">
            Rezerva bilet
          </Typography>
          <Stepper activeStep={activeStep} sx={{pt: 3, pb: 5}}>
            {steps.map (label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length
              ? <React.Fragment>
                  <Typography variant="h5" gutterBottom>
                    Biletul tau a fost rezervat cu succes.
                  </Typography>
                  <Typography variant="subtitle1">
                    Comanda a fost confirmata, PDF-ul generat iar XML generat si salvate in baza de date.
                  </Typography>
                  <Paper sx={{mb: 3, p: 4}} id="pdf-show" ref={ref}>
                    <div className="row">
                      <Typography fontWeight="bold">
                        Detinatorul cardului:
                      </Typography>
                      <Typography mb={1}>{paymentState.cardHolder}</Typography>
                    </div>
                    <div className="row">
                      <Typography fontWeight="bold">
                        Numarul cardului:
                      </Typography>
                      <Typography mb={1}>{paymentState.cardNumber}</Typography>
                    </div>
                    <div className="row">
                      <Typography fontWeight="bold">
                        Data de expirare a cardului:
                      </Typography>
                      <Typography mb={1}>
                        {
                          new Date (paymentState.expDate)
                            .toISOString ()
                            .split ('T')[0]
                        }
                      </Typography>
                    </div>
                    <div className="row">
                      <Typography fontWeight="bold">Tipul cardului:</Typography>
                      <Typography mb={1}>{paymentState.cardType}</Typography>
                    </div>
                    <div className="row">
                      <Typography fontWeight="bold">Localitate:</Typography>
                      <Typography mb={1}>{addressState.localitate}</Typography>
                    </div>
                    <div className="row">
                      <Typography fontWeight="bold">Judet:</Typography>
                      <Typography mb={1}>{addressState.judet}</Typography>
                    </div>
                    <div className="row">
                      <Typography fontWeight="bold">
                        Adresa de resedinta:
                      </Typography>
                      <Typography mb={1}>{addressState.address}</Typography>
                    </div>
                    <Divider sx={{borderWidth: '1px'}} />
                    <div className="row">
                      <Typography fontWeight="bold" mt={1}>
                        Total de plata:
                      </Typography>
                      <Typography>{totalPrice} LEI</Typography>
                    </div>
                    <div className="row">
                      <Typography fontWeight="bold" mt={1}>
                        Tip bilet:
                      </Typography>
                      <Typography>{addressState.ticketType}</Typography>
                    </div>
                    <div className="row">
                      <Typography fontWeight="bold" mt={1}>Loc:</Typography>
                      <Typography>
                        Locul
                        {' '}
                        {addressState.chosenSeat.split ('-')[0]}
                        ,
                        {' '}
                        {addressState.chosenSeat.split ('-')[1]}
                      </Typography>
                    </div>
                  </Paper>
                  <Pdf targetRef={ref} filename="Confirmare-bilet-derby.pdf">
                    {({toPdf}) => (
                      <Button variant="contained" onClick={toPdf}>
                        Descarcă PDF
                      </Button>
                    )}
                  </Pdf>
                </React.Fragment>
              : <React.Fragment>
                  {getStepContent (activeStep)}
                  <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                    {activeStep !== 0 &&
                      <Button onClick={handleBack} sx={{mt: 3, ml: 1}}>
                        Inapoi
                      </Button>}
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{mt: 3, ml: 1}}
                    >
                      {activeStep === steps.length - 1
                        ? 'Rezerva biletul'
                        : 'Pasul urmator'}
                    </Button>
                  </Box>
                </React.Fragment>}
          </React.Fragment>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default BuyTickets;
