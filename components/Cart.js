import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';
import User from './User';
import CartItem from './CartItem';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import CalcTotalPrice from '../lib/calcTotalPrice';
import FormatMoney from '../lib/formatMoney';

const LOCAL_STATE_QUERY = gql`
    query {
        cartOpen @client
    }
`;

const TOGGLE_CART_MUTAION = gql`
    mutation {
        toggleCart @client
    }
`;

const Composed = adopt({
    User:({render}) => <User>{render}</User>,
    toggleCart: ({render}) => <Mutation mutation={TOGGLE_CART_MUTAION}>{render}</Mutation>,
    localState: ({render}) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>,
});

const Cart = () => (
    <Composed>
        {({ User, toggleCart, localState }) => {
            const me = User.data.me;
            if (!me) return null;
            return (
                <CartStyles open={localState.data.cartOpen}>
                    <header>
                        <CloseButton onClick={toggleCart} title='close'>&times;</CloseButton>
                        <Supreme>{me.name}'s Cart</Supreme>
                        <p>You have {me.cart.length} Item{me.cart.length === 1 ? '' : 's'} in your cart.</p>
                    </header>
                    <ul>
                        {me.cart.map(cartItem => <CartItem cartItem={cartItem} key={cartItem.id} />)}
                    </ul>
                    <footer>
                        <p>{FormatMoney(CalcTotalPrice(me.cart))}</p>
                        <SickButton>CheckOut</SickButton>
                    </footer>
                </CartStyles>
            )
        }}
    </Composed>
)

export default Cart
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTAION };