import { useQuery } from '@tanstack/react-query'
import useAxiosPublic from '../../hooks/useAxiosPublic'
import Card from './Card'
import Container from '../Shared/Container'
import Heading from '../Shared/Heading'
import LoadingSpinner from '../Shared/LoadingSpinner'
import { useSearchParams } from 'react-router'


const Rooms = () => {
  const axiosPublic = useAxiosPublic();
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryName = searchParams.get('category');  // 'category' mean that object property name And category have a initial value: 'null'

  
  const { data: rooms = [], isError, error, isLoading } = useQuery({
    queryKey: ['rooms', categoryName],
    queryFn: async () => {
      const res = await axiosPublic.get(`/rooms?category=${categoryName}`);
      return res.data;
    }
  })



  if (isLoading) return <LoadingSpinner />

  if (isError) {
    return <span>Error: {error.message}</span>
  }



  return (
    <Container>
      {rooms && rooms.length > 0 ? (
        <div className='pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
          {rooms.map(room => (
            <Card key={room._id} room={room} />
          ))}
        </div>
      ) : (
        <div className='flex items-center justify-center min-h-[calc(100vh-300px)]'>
          <Heading
            center={true}
            title='No Rooms Available In This Category!'
            subtitle='Please Select Other Categories.'
          />
        </div>
      )}
    </Container>
  )
}

export default Rooms
