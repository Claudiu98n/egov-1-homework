import React, {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import Typography from '@mui/material/Typography';
import {useHistory} from 'react-router';
import axios from 'axios';
import cogoToast from 'cogo-toast';
import { emailRegex, passwordRegex } from '../../utils/regex';

const SignUp = () => {
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const history = useHistory ();

  const validateEmail = (email) => {
    let validated;
    if (emailRegex.test(email)) {
      validated = true;
      setEmailError("");
    } else {
      validated = false;
      setEmailError("Emailul nu este valid");
    }
    return validated;
  };

  const validatePassword = (password) => {
    let validated;
    if (passwordRegex.test(password)) {
      validated = true;
      setPasswordError("");
    } else {
      validated = false;
      setPasswordError("Cel putin 8 caractere si un numar");
    }
    return validated;
  }

  const validateConfirmPassword = (password, confirmPassword) => {
    let validated;
    if (password === confirmPassword) {
      validated = true;
      setConfirmPasswordError("");
    } else {
      validated = false;
      setConfirmPasswordError("Nu coincide cu parola aleasa");
    }
    return validated;
  }

  const validateFirstName = (firstName) => {
    console.log(firstName)
    let validated;
    if (firstName.length > 3) {
      validated = true;
      setFirstNameError("");
    } else {
      validated = false;
      setFirstNameError("Mai mult de 3 caractere");
    }
    return validated;
  }

  const validateLastName = (lastName) => {
    let validated;
    if (lastName.length > 3) {
      validated = true;
      setLastNameError("");
    } else {
      validated = false;
      setLastNameError("Mai mult de 3 caractere");
    }
    return validated;
  }

  const handleSubmit = async (event) => {
    event.preventDefault ();
    const data = new FormData (event.currentTarget);

    const isEmailValidated = validateEmail(data.get('email'));
    const isPasswordValidated = validatePassword(data.get('password'));
    const isConfirmPasswordValidated = validateConfirmPassword(data.get('password'), data.get('confirmPassword'));
    const isFirstNameValidated = validateFirstName(data.get('firstName'));
    const isLastNameValidated = validateLastName(data.get('lastName'));

    if (isEmailValidated && isPasswordValidated && isConfirmPasswordValidated && isFirstNameValidated && isLastNameValidated) {
      try {
        const signUp = await axios.post('http://localhost:1337/auth/local/register', {
          firstName: data.get ('firstName'),
          lastName: data.get ('lastName'),
          email: data.get ('email'),
          username: data.get('email').split('@')[0],
          password: data.get ('password'),
        });
  
        if (signUp.status === 200) {
          cogoToast.success('Cont creat cu succes! Va puteti autentifica.');
          history.push('/');
        };
      } catch(e) {
        console.log(e);
        if (e.response.status) {
          switch (e.response.status) {
            default:
              return cogoToast.error("A avut loc o eroare neasteptata");
          }
        }
      }
    } else return;
  };

  return (
    <Grid container component="main" sx={{height: '100vh'}}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/yf77MNs-1MQ)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: t =>
            t.palette.mode === 'light'
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{m: 1, bgcolor: 'primary.main'}}>
            <SportsSoccerIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Creeaza cont
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 1}}>
            <Box display="flex" justifyContent="space-between">
              <TextField
                margin="normal"
                required
                sx={{width: '49%'}}
                id="lastName"
                label="Nume"
                name="lastName"
                error={lastNameError ? true : false}
                helperText={lastNameError}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                sx={{width: '49%'}}
                id="firstName"
                label="Prenume"
                name="firstName"
                error={firstNameError ? true : false}
                helperText={firstNameError}
                autoFocus
              />
            </Box>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresa email"
              name="email"
              error={emailError ? true : false}
              helperText={emailError}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Parola"
              type="password"
              error={passwordError ? true : false}
              helperText={passwordError}
              id="password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirma Parola"
              type="password"
              error={confirmPasswordError ? true : false}
              helperText={confirmPasswordError}
              id="confirm-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{mt: 3, mb: 2}}
            >
              Creeaza cont
            </Button>
            <Grid container>
              <Grid item>
                <Link
                  onClick={() => history.push ('/')}
                  sx={{cursor: 'pointer'}}
                  variant="body2"
                >
                  {'Aveti deja cont? Autentificati-va'}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignUp;
