import { useMutation, useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import RoomRowsData from "../../components/TableRows/RoomRowsData";
import toast from 'react-hot-toast';
import LoadingSpinner from "../../components/Shared/LoadingSpinner";


const MyListings = () => {

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: rooms = [], isLoading, isError, error, refetch } = useQuery({
        queryKey: ['myListing', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-listing/${user?.email}`)
            return res.data;
        }
    })


    const { mutateAsync } = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.delete(`/room/${id}`);
            return res.data;
        },
        onSuccess: (data) => {
            console.log(data);
            refetch();
            toast.success('Successfully Deleted!');
        }
    })


    const handleDelete = async (id) => {
        // console.log(id)
        try {
            await mutateAsync(id)
        } catch (error) {
            toast.error(error.message)
        }


    }


    if (isLoading) {
        return <LoadingSpinner />
    }

    if (isError) {
        return toast.error(error.message)
    }



    return (
        <>
            <Helmet>
                <title>My Listings - StayVista</title>
            </Helmet>

            <div className='container mx-auto px-4 sm:px-8'>
                <div className='py-8'>
                    <div className='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto'>
                        <div className='inline-block min-w-full shadow rounded-lg overflow-hidden'>
                            <table className='min-w-full leading-normal'>
                                <thead>
                                    <tr>
                                        <th
                                            scope='col'
                                            className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                                        >
                                            Title
                                        </th>
                                        <th
                                            scope='col'
                                            className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                                        >
                                            Location
                                        </th>
                                        <th
                                            scope='col'
                                            className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                                        >
                                            Price
                                        </th>
                                        <th
                                            scope='col'
                                            className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                                        >
                                            From
                                        </th>
                                        <th
                                            scope='col'
                                            className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                                        >
                                            To
                                        </th>
                                        <th
                                            scope='col'
                                            className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                                        >
                                            Delete
                                        </th>
                                        <th
                                            scope='col'
                                            className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                                        >
                                            Update
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Room row data */}

                                    {
                                        rooms.map(room => <RoomRowsData key={room._id} room={room} handleDelete={handleDelete} id={room?._id} />)
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyListings;