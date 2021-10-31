import React, {useState, useEffect, useContext} from "react";
import axios from 'axios';
import cogoToast from 'cogo-toast';

const UserInfoContext = React.createContext();
const OrderInfoContext = React.createContext();
const PaymentInfoContext = React.createContext();
const SeatsContext = React.createContext();
const TotalPriceContext = React.createContext();

export const useUserInfoContext = () => useContext(UserInfoContext);
export const useOrderInfoContext = () => useContext(OrderInfoContext);
export const usePaymentInfoContext = () => useContext(PaymentInfoContext);
export const useSeats = () => useContext(SeatsContext);
export const useTotalPrice = () => useContext(TotalPriceContext);

const UserProvider = ({ children }) => {
    const [totalPrice, setTotalPrice] = useState(0);
    const [seats, setSeats] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [addressState, setAddressState] = useState ({
        firstName: '',
        lastName: '',
        address: '',
        localitate: '',
        judet: '',
        zip: '',
        chosenSeat: '',
        ticketType: 'Normal'
      });
    const [paymentState, setPaymentState] = useState ({
        cardHolder: "",
        cardNumber: "",
        expDate: "",
        cvv: "",
        cardType: ""
    })

    const getSeats = async () => {
        try {
            const seats = await axios.get('http://localhost:1337/seats', {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwt")
                }
            })

            if (seats.status === 200) {
                setSeats(seats.data.seatsJson);
            }
        } catch (e) {
            console.log(e);
            cogoToast.error('Eroare server');
        }
    }

    useEffect(() => {
        const localUser = localStorage.getItem('user');
        const parsedUserInfo = JSON.parse(localUser);
        setUserInfo(parsedUserInfo);
        setAddressState({
            ...addressState,
            firstName: parsedUserInfo.firstName,
            lastName: parsedUserInfo.lastName
        })

        getSeats();
    }, [])

    return (
        <UserInfoContext.Provider value={userInfo}>
            <OrderInfoContext.Provider value={[addressState, setAddressState]}>
                <PaymentInfoContext.Provider value={[paymentState, setPaymentState]}>
                    <SeatsContext.Provider value={seats}>
                        <TotalPriceContext.Provider value={[totalPrice, setTotalPrice]}>
                            {children}
                        </TotalPriceContext.Provider>
                    </SeatsContext.Provider>
                </PaymentInfoContext.Provider>
            </OrderInfoContext.Provider>
        </UserInfoContext.Provider>
    );
};

export default UserProvider;