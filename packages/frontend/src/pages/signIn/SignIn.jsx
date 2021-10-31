import React, { useState } from 'react';
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
import {emailRegex, passwordRegex} from '../../utils/regex';
import { login } from '../../utils/isLogin';

const SignIn = () => {
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
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

  const handleSubmit = async (event) => {
    event.preventDefault ();
    const data = new FormData (event.currentTarget);

    const isEmailValidated = validateEmail(data.get('email'));
    const isPasswordValidated = validatePassword(data.get('password'));
    
    if (isEmailValidated && isPasswordValidated) {
      try {
        const signIn = await axios.post('http://localhost:1337/auth/local', {
          identifier: data.get('email'),
          password: data.get('password')
        });
  
        if (signIn.status === 200) {
          cogoToast.success('Autentificare cu succes');
          login(signIn.data.jwt);
          localStorage.setItem('user', JSON.stringify(signIn.data.user));
          history.push('/buy-tickets');
        };
      } catch(e) {
        console.log(e);
        if (e.response.status) {
          switch (e.response.status) {
            case 400:
              return cogoToast.error('Email sau Parola gresite');
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
          backgroundImage: 'url(https://source.unsplash.com/r-xKieMqL34)',
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
            Autentificare
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 1}}>
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
              error={passwordError ? true : false}
              helperText={passwordError}
              type="password"
              id="password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{mt: 3, mb: 2}}
            >
              Autentificare
            </Button>
            <Grid container>
              <Grid item>
                <Link
                  onClick={() => history.push ('/sign-up')}
                  sx={{cursor: 'pointer'}}
                  variant="body2"
                >
                  {"Nu aveti cont? Creati unul"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignIn;
