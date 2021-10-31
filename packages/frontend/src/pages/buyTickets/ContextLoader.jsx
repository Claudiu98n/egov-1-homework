import React from 'react'
import UserProvider from '../../context/UserProvider';
import BuyTickets from './BuyTickets';

const ContextLoader = () => {
    return (
        <UserProvider>
            <BuyTickets />
        </UserProvider>
    )
}

export default ContextLoader;