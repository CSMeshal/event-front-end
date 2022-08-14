import React, { useState } from 'react'
import Spinner from '../components/Spinner'
import { BOOKINGS, CANCEL_BOOKING } from '../queries'
import BookingItem from '../components/BookingItem'
import { useQuery, useMutation, useApolloClient } from "@apollo/client"
import Error from '../components/Error'

export default function BookingsPage () {
    const [alert, setAlert] = useState("")
    const client = useApolloClient()

    function BookingsList() {
        const { loading, error, data } = useQuery(BOOKINGS)

        if (loading) { return <Spinner /> }
        if (error) {
            setAlert(error.message)
            return
        }

        client.refetchQueries({
            include: ["Bookings"],
        })

        return (
            <div>
                <Error error={alert} />
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        {data.bookings.map(booking => (
                            <BookingItem
                                key={booking._id}
                                {...booking}
                                onCancelBooking={() => {
                                    cancelBooking({ variables: { bookingId: booking._id } })
                                }}
                            />
                        ))}
                    </div>
                </div>
                
            </div>
        )
    }

    const [cancelBooking ] = useMutation(CANCEL_BOOKING, {
        onError: (error) => setAlert(error.message),
        onCompleted: () => {
            setAlert("Your reservation has been cancelled  ")
        }
    })

    return (
        <div className="container-fluid">
            <h2>Booked Events</h2>
            <BookingsList />
        </div>
    )
}