import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';
import './CheckoutForm.css'
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast'
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router';
import { ImSpinner9 } from 'react-icons/im';

const CheckoutForm = ({ closeModal, totalPrice, bookingInfo, refetch }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [errorShow, setError] = useState('');
    const [clientSecret, setClientSecret] = useState("");
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();



    useEffect(() => {
        const getClientSecret = async () => {
            if (!totalPrice || totalPrice < 1) {
                return;
            }

            try {
                const res = await axiosSecure.post('/create-payment-intent', { price: totalPrice });
                setClientSecret(res.data.clientSecret)

            } catch (error) {
                toast.error(error.message || 'Failed to create payment intent');
            }
        };

        getClientSecret();

    }, [axiosSecure, totalPrice])


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
            return;
        } else {
            console.log('paymentMethod: ', paymentMethod)
            setError('')
        }

        // Confirm payment
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    name: user?.displayName,
                    email: user?.email
                }
            }
        })


        if (confirmError) {
            setError(confirmError.message)
            return
        }
 
        if (paymentIntent.status === "succeeded") {
            console.log("From payment intent: ", paymentIntent);

            /* 
                1. Create booking info as an object
                2. Create an API endpoint for handling bookings
                3. Fetch data on the client side and send it to the API
                4. Update room status upon booking (create an endpoint and fetch data)
            */


            // Create booking info object
            const newBooking = {
                roomID: bookingInfo?._id,
                title: bookingInfo?.title,
                host: bookingInfo?.host,
                price: bookingInfo?.price,
                from: bookingInfo?.from,
                to: bookingInfo?.to,
                transactionId: paymentIntent.id,
                date: new Date(),
            };

            console.log(newBooking);

            // Send booking data to server
            const res = await axiosSecure.post("/bookings", newBooking);

            if (res.data.insertedId) {
                // Update room status
                const statusRes = await axiosSecure.patch(`/room/status/${bookingInfo?._id}`, {
                    status: true,
                });

                if (statusRes.data.modifiedCount > 0) {
                    refetch(); // Update client-side data
                    closeModal(); // Close modal
                    toast.success("Room Booked Successfully");
                    navigate("/dashboard/my-bookings"); // Redirect user
                }
            }

        }

        setProcessing(false);

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
                    {
                        processing ? <ImSpinner9 className="m-auto animate-spin" /> : 'Pay'
                    }
                </button>
                <button
                    onClick={closeModal}
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
                >
                    No
                </button>

                {
                    errorShow && <p>{errorShow}</p>
                }
            </div>
        </form>
    );
};

CheckoutForm.propTypes = {
    closeModal: PropTypes.func,
    totalPrice: PropTypes.number,
    bookingInfo: PropTypes.object,
    refetch: PropTypes.func
}

export default CheckoutForm;