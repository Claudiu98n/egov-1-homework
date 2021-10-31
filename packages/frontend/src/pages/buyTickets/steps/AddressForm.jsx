import React, {useState} from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import judete from '../../../utils/judete.json';
import {useOrderInfoContext} from '../../../context/UserProvider';
import TicketModal from './TicketModal';

const AddressForm = () => {
  const [addressState, setAddressState] = useOrderInfoContext ();
  const [open, setOpen] = useState (false);

  const handleOpen = () => setOpen (true);
  const handleClose = () => setOpen (false);

  const handleChange = event => {
    setAddressState ({
      ...addressState,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Detaliile rezervarii
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            name="firstName"
            label="Prenume"
            value={addressState.firstName}
            onChange={handleChange}
            fullWidth
            autoComplete="given-name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lastName"
            name="lastName"
            label="Nume"
            value={addressState.lastName}
            fullWidth
            onChange={handleChange}
            autoComplete="family-name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" onClick={handleOpen} sx={{width: '100%'}}>
            Alegeti locul
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="seat"
            name="seat"
            label="Loc"
            value={addressState.chosenSeat}
            fullWidth
            readOnly
            autoComplete="seat"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="address1"
            name="address"
            label="Adresa"
            value={addressState.address}
            onChange={handleChange}
            fullWidth
            autoComplete="shipping address-line1"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl variant="standard" sx={{width: '100%'}}>
            <InputLabel id="judet-input-label">Judet *</InputLabel>
            <Select
              labelId="judet-select-label"
              id="judet-select"
              label="Judet"
              name="judet"
              onChange={handleChange}
              value={addressState.judet}
            >
              {judete.judete.map (judet => (
                <MenuItem key={judet.auto} value={judet.auto}>
                  {judet.nume}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl variant="standard" sx={{width: '100%'}}>
            <InputLabel id="localitate-input-label">Localitate *</InputLabel>
            <Select
              labelId="localitate-select-label"
              id="localitate-select"
              name="localitate"
              label="Localitate"
              onChange={handleChange}
              value={addressState.localitate}
            >
              {addressState.judet
                ? judete.judete
                    .filter (judet => judet.auto === addressState.judet)[0]
                    .localitati.map ((localitate, index) => (
                      <MenuItem key={index} value={localitate.nume}>
                        {localitate.nume}
                      </MenuItem>
                    ))
                : <MenuItem key={'selectati'} value={''}>
                    {'Selectati judet'}
                  </MenuItem>}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            type="number"
            name="zip"
            label="Zip / Cod postal"
            onChange={handleChange}
            value={addressState.zip}
            fullWidth
            autoComplete="shipping postal-code"
            variant="standard"
          />
        </Grid>
      </Grid>
      <TicketModal open={open} handleClose={handleClose} />
    </React.Fragment>
  );
};

export default AddressForm;
