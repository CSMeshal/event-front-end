import React from 'react'

export default function BookingItem({ _id, event, createdAt, onCancelBooking }) {
  return (
    <li className='bookings-item d-flex'>
      <div>
        {event.title} - {new Date(createdAt).toLocaleDateString()} - {event.price}$
      </div>
      <button className='btn' onClick={() => onCancelBooking(_id)}>
      cancel
      </button>
    </li>
  )
}
