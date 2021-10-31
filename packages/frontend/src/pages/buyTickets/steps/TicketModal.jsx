import React, {useEffect} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {useSeats, useOrderInfoContext, useTotalPrice} from '../../../context/UserProvider';
import {deepOrange, deepPurple} from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import cogoToast from 'cogo-toast';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const TicketModal = ({open, handleClose}) => {
  const seats = useSeats ();
  const [totalPrice, setTotalPrice] = useTotalPrice();
  const [addressState, setAddressState] = useOrderInfoContext();

  const chooseSeat = (seat, row) => {
    const chosenSeat = seat + '-' + row;

    setAddressState({
        ...addressState,
        chosenSeat
    });
  }

  const handleChange = event => {
    setAddressState ({
      ...addressState,
      [event.target.name]: event.target.value
    });
  };

  useEffect(() => {
    let normalTicketPrice;
    if (addressState.chosenSeat.split('-')[1] === "peluza") {
      normalTicketPrice = 50;
    } else if (addressState.chosenSeat.split('-')[1] === "tribuna"){
      normalTicketPrice = 80;
    } else {
      normalTicketPrice = 0;
    }

    let calculatedPrice;

    if (addressState.ticketType === "Normal") {
      calculatedPrice = normalTicketPrice;
    } else if (addressState.ticketType === "Student") {
      calculatedPrice = normalTicketPrice - (0.3 * normalTicketPrice);
    } else if (addressState.ticketType === "Pensionar") {
      calculatedPrice = normalTicketPrice - (0.15 * normalTicketPrice);
    };

    setTotalPrice(calculatedPrice);
  }, [addressState.chosenSeat, addressState.ticketType])

  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  }

  const handleConfirm = () => {
    if (addressState.ticketType === "" || addressState.chosenSeat === "") {
      return cogoToast.error("Nu ati ales locul sau tipul biletului");
    } else {
      handleClose();
      return cogoToast.success("Ati ales cu succes locul si tipul biletului");
    }
  }

  return (
    <Modal
      open={open}
      hideBackdrop
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" mb={3}>
          Alegeti locul si tipul biletului
        </Typography>
        <Grid container spacing={2}>
          <Grid item md={6}>
            <Typography id="modal-modal-title" variant="h6" component="h2" mb={3}>
                Peluza
            </Typography>
            <Grid container spacing={1}>
              {!isEmpty(seats) && seats?.peluza?.length > 0 && seats.peluza.map (st => (
                <Grid key={st} item md={4}>
                  <Avatar 
                    onClick={() => chooseSeat(st, 'peluza')} 
                    sx={{
                        bgcolor: deepPurple[500], 
                        cursor: 'pointer'
                    }}
                  >
                    {st}
                  </Avatar>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item md={6}>
            <Typography id="modal-modal-title" variant="h6" component="h2" mb={3}>
                Tribuna
            </Typography>
            <Grid container spacing={1}>
              {!isEmpty(seats) && seats?.tribuna?.length > 0 && seats.tribuna.map (st => (
                <Grid key={st} item md={4}>
                  <Avatar 
                    onClick={() => chooseSeat(st, 'tribuna')} 
                    sx={{
                        bgcolor: deepOrange[500], 
                        cursor: 'pointer'
                    }}
                  >
                    {st}
                  </Avatar>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Typography sx={{mt: 3, mb: 3}}>Loc ales: {addressState.chosenSeat}</Typography>
        <FormControl variant="standard" sx={{width: '100%'}}>
            <InputLabel id="ticket-type-input-label">Tip bilet *</InputLabel>
            <Select
              labelId="ticket-type"
              id="ticket-type-select"
              label="Tip Bilet"
              name="ticketType"
              onChange={handleChange}
              value={addressState.ticketType}
            >
              <MenuItem value={'Normal'}>
                Normal
              </MenuItem>
              <MenuItem value={'Pensionar'}>
                Pensionar
              </MenuItem>
              <MenuItem value={'Student'}>
                Student
              </MenuItem>
            </Select>
        </FormControl>
        <Typography sx={{mt: 3}}>Pret total: {totalPrice} LEI</Typography>
        <Button onClick={handleConfirm} variant="contained" sx={{mt: 3}}>Confirma locul</Button>
      </Box>
    </Modal>
  );
};

export default TicketModal;
