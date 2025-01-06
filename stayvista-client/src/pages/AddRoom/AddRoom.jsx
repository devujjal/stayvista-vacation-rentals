import { useState } from "react";
import { useMutation } from '@tanstack/react-query'
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import AddRoomForm from "../../components/Form/AddRoomForm";
import toast from "react-hot-toast";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAuth from "../../hooks/useAuth";
import { Helmet } from 'react-helmet-async'


const AddRoom = () => {

    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const [file, setFile] = useState();
    const [preText, setPreText] = useState();
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();
    const [dates, setDates] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    const { mutateAsync } = useMutation({
        mutationFn: async (roomItem) => {
            const res = await axiosSecure.post('/rooms', roomItem);
            return res.data;
        },
        onSuccess: () => {
            setIsLoading(false)
            toast.success('Room Added Successfully!');
            navigate('/dashboard/my-listings')
        }

    })



    const handleFormSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const form = e.target;
        const title = form.title.value;
        const location = form.location.value;
        const image = form.image.files[0];
        const category = form.category.value;
        const to = dates[0].startDate;
        const from = dates[0].endDate;
        const price = form.price.value;
        const guests = form.total_guest.value;
        const bathrooms = form.bedrooms.value;
        const bedrooms = form.bathrooms.value;
        const description = form.description.value;

        const formData = new FormData();
        formData.append('image', image)


        try {
            const res = await axiosPublic.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API}`, formData);

            const imageURL = res.data.data.display_url

            if (res?.data?.success) {
                const roomItem = {
                    title,
                    location,
                    category,
                    to,
                    from,
                    price,
                    image: imageURL,
                    guests,
                    bathrooms,
                    bedrooms,
                    description,
                    host: {
                        name: user?.displayName,
                        email: user?.email,
                        image: user?.photoURL
                    }
                }

                console.log(roomItem)

                // Post request to server using useMutation
                await mutateAsync(roomItem);


            }

        } catch (error) {
            toast.error(error.message)
            setIsLoading(false)
        }


    }


    const handleImage = (image) => {
        setFile(URL.createObjectURL(image));
        setPreText(image.name)
    }



    return (

        <>
            <Helmet>
                <title>Add Room - StayVista</title>
            </Helmet>

            <AddRoomForm
                dates={dates}
                setDates={setDates}
                handleFormSubmit={handleFormSubmit}
                file={file}
                preText={preText}
                handleImage={handleImage}
                isLoading={isLoading}
            />
        </>
    )
}

export default AddRoom;