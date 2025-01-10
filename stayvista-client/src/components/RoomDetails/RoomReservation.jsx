import { DateRange } from 'react-date-range';
import PropTypes from 'prop-types'
import Button from '../Shared/Button/Button'
import { useState } from 'react';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { differenceInCalendarDays } from 'date-fns';
import BookingModal from '../Modal/BookingModal';

const RoomReservation = ({ room }) => {

  console.log(room)
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState([
    {
      startDate: new Date(room?.from),
      endDate: new Date(room?.to),
      key: 'selection'
    }
  ]);

  const closeModal = () => {
    setIsOpen(false)
  }

  const totalPrice =
    parseInt(differenceInCalendarDays(new Date(room.to), new Date(room.from))) *
    room?.price

  console.log(totalPrice)




  return (
    <div className='rounded-xl border-[1px] border-neutral-200 overflow-hidden bg-white'>
      <div className='flex items-center gap-1 p-4'>
        <div className='text-2xl font-semibold'>$ {room?.price}</div>
        <div className='font-light text-neutral-600'>night</div>
      </div>
      <hr />
      <div className='flex justify-center'>
        {/* Calender */}

        <DateRange
          showDateDisplay={false}
          rangeColors={['#EE3E5E']}
          editableDateInputs={true}
          // eslint-disable-next-line no-unused-vars
          onChange={item => setState([
            {
              startDate: new Date(room?.from),
              endDate: new Date(room?.to),
              key: 'selection'
            }
          ])}
          moveRangeOnFirstSelection={false}
          ranges={state}
        />
      </div>
      <hr />
      <div className='p-4'>
        <Button label={'Reserve'} onClick={() => setIsOpen(true)} />
      </div>


      {/* Modal */}
      <BookingModal isOpen={isOpen} closeModal={closeModal} bookingInfo={room} totalPrice={totalPrice} />


      <hr />
      <div className='p-4 flex items-center justify-between font-semibold text-lg'>
        <div>Total</div>
        <div>${totalPrice}</div>
      </div>
    </div>
  )
}

RoomReservation.propTypes = {
  room: PropTypes.object,
}

export default RoomReservation
