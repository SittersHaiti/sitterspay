import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import ErrorMessage from './ErrorMessage';
import FieldForm from './FieldForm';
import SubmitButton from './SubmitButton';

import axios from 'axios';

const CARD_OPTIONS = {
  iconStyle: 'solid',
  style: {
    base: {
      iconColor: '#f4511e',
      color: '#424770',
      fontWeight: 500,
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontSize: '18px',
      letterSpacing: '0.025em',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': {
        color: '#fce883',
      },
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      iconColor: '#FFC7EE',
      color: '#9e2146',
    },
  },
};

export default function PaymentForm (){
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const [name, setName] = useState('');
  const [postal, setPostal] = useState('');
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [billingDetails, setBillingDetails] = useState({
    email: "",
    phone: "",
    name: ""
  });

  React.useEffect(()=>{
    
  }, [])

  const handleSubmit = async (e)=>{
    e.preventDefault();

    if(!stripe || !elements){
      //Stripe.js has not loaded yet.
      return ;
    }

    if (error) {
      elements.getElement("card").focus();
      return;
    }

    if (cardComplete) {
      setProcessing(true);
    }


    const cardElement =  elements.getElement(CardElement);
    // createToken createPaymentMethod
    stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: billingDetails,
    }).then(({error, paymentMethod})=>{
      if(error){
        setError(error);
        setSuccess(false);
        setProcessing(false);
      }

      if(paymentMethod){
        setPaymentMethod(paymentMethod);
        setSuccess(true);
        //id  billing_details { email name phone }
        const { id, billing_details } = paymentMethod;
        axios({
          method: "POST",
          url: "http://192.168.22.3:3500/api/v1/payment",
          headers: {
            'Content-Type': 'application/json',
          },
          data: { 
            id,
            billing_details,
            code: "ABC",
          }
        })

      }

      console.log('paymentMethod=>', paymentMethod)
      console.log('error=>', error)
      
      
    }).catch((error)=>{
      console.log(error);
      setSuccess(false);
      setProcessing(false);
    })
  }

  const save = ()=>{

  }

  return (<>
    {
      success ? 
        <div className="Result">
          <div className="ResultTitle" role="alert">
            Payment successful
          </div>
          <div className="ResultMessage">
            Thanks for trying Stripe Elements. No money was charged, but we
            generated a PaymentMethod: {paymentMethod.id}
          </div>
          {/* <ResetButton onClick={reset} /> */}
        </div>: 
        <form className="Form" onSubmit={handleSubmit}>
          <fieldset className="FormGroup">
            <FieldForm
              label="Name"
              id="name"
              type="text"
              placeholder="Jane Doe"
              required
              autoComplete="name"
              value={billingDetails.name}
              onChange={(e) => {
                setBillingDetails({ ...billingDetails, name: e.target.value });
              }}
            />
            <FieldForm
              label="Email"
              id="email"
              type="email"
              placeholder="janedoe@gmail.com"
              required
              autoComplete="email"
              value={billingDetails.email}
              onChange={(e) => {
                setBillingDetails({ ...billingDetails, email: e.target.value });
              }}
            />
            <FieldForm
              label="Phone"
              id="phone"
              type="tel"
              placeholder="(509) 00000000"
              required
              autoComplete="tel"
              value={billingDetails.phone}
              onChange={(e) => {
                setBillingDetails({ ...billingDetails, phone: e.target.value });
              }}
            />
          </fieldset>
          <fieldset className="FormGroup">
            <div className="FormRow">
              <CardElement 
                options={CARD_OPTIONS}
                onChange={(e) => {
                  setError(e.error);
                  setCardComplete(e.complete);
                }} />
            </div>
          </fieldset>
          {error && <ErrorMessage>{error.message}</ErrorMessage>}
          <SubmitButton processing={processing} error={error} disabled={!stripe}>
            <span id="button-text">
              {processing ? (
                <div className="spinner" id="spinner"></div>
              ) : (
                "Pay $25"
              )}
            </span>
          </SubmitButton>
        </form> 
    }
  </>)
}

/*
REFERENCE URL : https://codesandbox.io/s/react-stripe-js-card-detailed-omfb3?file=/src/styles.css:0-3729
https://stripe.com/docs/stripe-js/react

https://stripe.com/docs/payments/integration-builder
https://stripe.com/docs/payments/handling-payment-events

Payment succeeds 4242 4242 4242 4242
Payment requires authentication 4000 0025 0000 3155
Payment is declined 4000 0000 0000 9995


https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
*/