import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';
import './CheckoutForm.css'
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast'
import useAxiosSecure from '../../hooks/useAxiosSecure';

const CheckoutForm = ({ closeModal, totalPrice }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState("");
    const [processing, setProcessing] = useState(false)



    useEffect(() => {
        const getClientSecret = async () => {
            if (!totalPrice || totalPrice < 1) {
                return;
            }

            try {
                const res = await axiosSecure.post('/create-payment-intent', { price: totalPrice });
                console.log(res.data)
                setClientSecret(res.data.clientSecret)

            } catch (error) {
                toast.error(error.message || 'Failed to create payment intent');
            }
        };

        getClientSecret();

    }, [axiosSecure, totalPrice])


    console.log(clientSecret)


    const handleSubmit = async (e) => {
        e.preventDefault();

        setProcessing(true);

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
                    disabled={!stripe || !clientSecret || processing}
                    type='submit'
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
    closeModal: PropTypes.func,
    totalPrice: PropTypes.number
}

export default CheckoutForm;