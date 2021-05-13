import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';

const PUBLIC_KEY = "pk_test_pISb2Oa5ruD40gLYMXwy5CU7";
const stripePromise = loadStripe(PUBLIC_KEY);



export default function StripeContainer (){

  return (<Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>)
}