import React, { useState, useContext } from 'react'
import { useQuery, useMutation, useApolloClient, useSubscription } from '@apollo/client'
import { EVENTS, BOOK_EVENT, CREATE_EVENT, EVENT_ADDED } from '../queries'
import EventItem from '../components/EventItem'
import SimpleModal from '../components/SimpleModal'
import AuthContext from '../context/auth-context'
import { NavLink } from 'react-router-dom'
import Error from '../components/Error'
import Spinner from '../components/Spinner'

export default function EventsPage() {
    const [selectedEvent, setSelectedEvent] = useState(null)
    const value = useContext(AuthContext)
    const [alert, setAlert] = useState('')
    const [modelAlert, setModelAlert] = useState('')
    const [creating, setCreating] = useState(false)
    const [title, setTitle] = useState("")
    const [price, setPrice] = useState("")
    const [date, setDate] = useState("")
    const [description, setDescription] = useState("")
    const client = useApolloClient()
    useSubscription(EVENT_ADDED, {
        onSubscriptionData: async ({ subscriptionData }) => {
            if (subscriptionData.data) {
                const addedEvent = subscriptionData.data.eventAdded
                setAlert(`New event titled: ${addedEvent.title}، Just added`)
                window.scrollTo(0, 0)
            }
            if (subscriptionData.errors) setAlert("Error fetching new events")
        }
    })

    function EventList() {
        const { loading, error, data } = useQuery(EVENTS) 
        
        if (loading) { return <Spinner /> }
        if (error) {
            setAlert(error.message)
            return
        }

        client.refetchQueries({
            include: ["Events"],
        })

        const showDetailHandler = eventId => {
            const clickedEvent = data.events.find(event => event._id === eventId)
            setSelectedEvent(clickedEvent)
        }

        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    {data.events.map(event => (
                        <EventItem
                            key={event._id}
                            {...event}
                            onDetail={showDetailHandler}
                        />
                    ))}
                </div>
            </div>
        )
    }

    const [bookEventHandler] = useMutation(BOOK_EVENT, {
        onError: (error) => {
            setSelectedEvent(null)
            setAlert(error.message)
            window.scrollTo(0, 0)
        },
        onCompleted: () => {
            setSelectedEvent(null)
            setAlert("Event booked successfully.")
        }
    })

    const [eventConfirmHandler, { createEventLoading, createEventError }] = useMutation(CREATE_EVENT, {
        onError: (error) => {
            setCreating(false)
            setAlert(error.message)
        },
        onCompleted: () => {
            setCreating(false)
            setAlert("Event added successfully")
            setModelAlert("")
            client.refetchQueries({
                include: ["Events"],
            })
        },
    })

    if (createEventLoading) { return <Spinner /> }
    if (createEventError) { 
        setAlert(createEventError.message) 
        return
    }
   

    return (
        <div>
            {value.token && <Error error={alert} />}
            {value.token && (
                <div className='events-control pt-2 text-center pb-3'>
                    <h2>Share your events here</h2>
                    <button className='btn' onClick={() => setCreating(true)}>
                    Create an event
                    </button>
                </div>
            )}
            <div>
            <h2 className="mb-3"> Events in Saudi Arabia</h2>
                <EventList />
            </div>
            {creating && (
                <SimpleModal
                title='Add event'
                onCancel={() => {
                        setCreating(false)
                        setAlert("")
                        setModelAlert("")
                    }}
                    onConfirm={() => {
                        if (
                            title.trim().length === 0 ||
                            price <= 0 ||
                            date.trim().length === 0 ||
                            description.trim().length === 0
                        ) {
                            setModelAlert("All fields must be filled in correctly!!")
                            return
                        }
                        eventConfirmHandler(
                            { variables: { title: title, price: +price, date: date, description: description } }
                        )
                        setTitle("")
                        setPrice("")
                        setDate("")
                        setDescription("")
                    }}
                    confirmText='submit'
                >
                    <form>
                        <Error error={modelAlert} />
                        <div className="mb-1">
                        <label className="form-label" htmlFor='title'>title</label>
                            <input
                                className="form-control"
                                required
                                type='text'
                                id='title'
                                value={title}
                                onChange={({ target }) => setTitle(target.value)}
                            />
                        </div>
                        <div className="mb-1 mt-1">
                        <label className="form-label" htmlFor='price'>price</label>
                            <input
                                className="form-control"
                                required
                                type='number'
                                id='price'
                                value={price}
                                onChange={({ target }) => setPrice(target.value)}
                            />
                        </div>
                        <div className="mb-1 mt-1">
                        <label className="form-label" htmlFor='date'>data</label>
                            <input
                                className="form-control"
                                required
                                type='datetime-local'
                                id='date'
                                value={date}
                                onChange={({ target }) => setDate(target.value)}
                            />
                        </div>
                        <div className="mb-1 mt-1">
                        <label className="form-label" htmlFor='description'>description</label>
                            <textarea
                                className="form-control"
                                required id='description'
                                rows='3'
                                value={description}
                                onChange={({ target }) => setDescription(target.value)}
                            />
                        </div>
                    </form>
                </SimpleModal>
            )}
            {selectedEvent && (
                <SimpleModal
                title='Event booking'
                onCancel={() => {
                        setCreating(false)
                        setSelectedEvent(null)
                        setAlert("")
                    }}
                    onConfirm={() => {
                        bookEventHandler({ variables: { eventId: selectedEvent._id } })
                    }}
                    confirmText={value.token ? 'book?' : <NavLink to='/login'>Login to book</NavLink>}
                    isDisabled={selectedEvent.creator._id === value.userId ? true : false}
                >
                    <h4 className='mb-4'>{selectedEvent.title}</h4>
                    <h4 className='mb-4'>
                        ${selectedEvent.price} {'-'} {selectedEvent.date.split('.')[0].replace(/-/g, "/")}
                    </h4>
                    <p>{selectedEvent.description}</p>
                </SimpleModal>
            )}
        </div>
    )
}