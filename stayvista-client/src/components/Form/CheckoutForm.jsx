import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';
import './CheckoutForm.css'
import { useState } from 'react';

const CheckoutForm = ({ closeModal }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);
        if (card === null) {
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        })

        if (error) {
            console.log('payment Error: ', error);
            setError(error.message)
        } else {
            console.log('paymentMethod: ', paymentMethod)
            setError('')
        }

    }


    return (
        <form onSubmit={handleSubmit}>
            <CardElement
                options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }}
            />

            <div className='flex mt-2 justify-around'>
                <button
                    disabled={!stripe}
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2'
                >
                    Pay
                </button>
                <button
                    onClick={closeModal}
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
                >
                    No
                </button>

                {
                    error && <p>{error}</p>
                }
            </div>
        </form>
    );
};

CheckoutForm.propTypes = {
    closeModal: PropTypes.func
}

export default CheckoutForm;