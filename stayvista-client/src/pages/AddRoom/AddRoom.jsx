import { useState } from "react";
import AddRoomForm from "../../components/Form/AddRoomForm";
import toast from "react-hot-toast";
import useAxiosPublic from "../../hooks/useAxiosPublic";


const AddRoom = () => {

    const axiosPublic = useAxiosPublic();
    const [file, setFile] = useState();
    const [preText, setPreText] = useState();
    const [dates, setDates] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);



    const handleFormSubmit = async (e) => {
        e.preventDefault()
        const form = e.target;
        const title = form.title.value;
        const location = form.location.value;
        const image = form.image.files[0];
        const category = form.category.value;
        const startDate = dates[0].startDate;
        const endDate = dates[0].endDate;
        const price = form.price.value;
        const totalGuest = form.total_guest.value;
        const bedRooms = form.bedrooms.value;
        const bathRooms = form.bathrooms.value;
        const description = form.description.value;

        const formData = new FormData();
        formData.append('image', image)


        try {
            const res = await axiosPublic.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API}`, formData);

            const imageURL = res.data.data.display_url

            if (res?.data?.success) {
                const roomDetails = {
                    title,
                    location,
                    category,
                    startDate,
                    endDate,
                    price,
                    imageURL,
                    totalGuest,
                    bedRooms,
                    bathRooms,
                    description
                }

                console.log(roomDetails)

            }

        } catch (error) {
            toast.error(error.message)
        }


    }


    const handleImage = (image) => {
        setFile(URL.createObjectURL(image));
        setPreText(image.name)
    }



    return (

        <>
            <span>{preText}</span>

            <AddRoomForm
                dates={dates}
                setDates={setDates}
                handleFormSubmit={handleFormSubmit}
                file={file}
                preText={preText}
                handleImage={handleImage}
            />
        </>
    )
}

export default AddRoom;