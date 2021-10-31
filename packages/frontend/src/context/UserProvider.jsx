import React, {useState, useEffect, useContext} from "react";

const UserInfoContext = React.createContext();
const OrderInfoContext = React.createContext();
const PaymentInfoContext = React.createContext();

export const useUserInfoContext = () => useContext(UserInfoContext);
export const useOrderInfoContext = () => useContext(OrderInfoContext);
export const usePaymentInfoContext = () => useContext(PaymentInfoContext);

const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({});
    const [addressState, setAddressState] = useState ({
        firstName: '',
        lastName: '',
        address: '',
        localitate: '',
        judet: '',
        zip: ''
      });
    const [paymentState, setPaymentState] = useState ({
        cardHolder: "",
        cardNumber: "",
        expDate: "",
        cvv: "",
        cardType: ""
    })

    useEffect(() => {
        const localUser = localStorage.getItem('user');
        const parsedUserInfo = JSON.parse(localUser);
        setUserInfo(parsedUserInfo);
        setAddressState({
            ...addressState,
            firstName: parsedUserInfo.firstName,
            lastName: parsedUserInfo.lastName
        })
    }, [])

    return (
        <UserInfoContext.Provider value={userInfo}>
            <OrderInfoContext.Provider value={[addressState, setAddressState]}>
                <PaymentInfoContext.Provider value={[paymentState, setPaymentState]}>
                    {children}
                </PaymentInfoContext.Provider>
            </OrderInfoContext.Provider>
        </UserInfoContext.Provider>
    );
};

export default UserProvider;