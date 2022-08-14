import { gql } from '@apollo/client'
import { EVENT_FIELDS } from "./fragments"
export const EVENTS = gql`
  ${EVENT_FIELDS}
  query Events {
    events{
      ...EventFields
      creator {
        _id
        email
      }
    }
  }
` 

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      userId
      username
    }
  }
` 

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!) {
    createUser(userInput: {username:$username, email: $email, password: $password}) {
      token
      userId
      username
    }
  }
` 

export const BOOK_EVENT = gql`
  mutation BookEvent($eventId: ID!) {
    bookEvent(eventId: $eventId) {
      _id
      createdAt
      updatedAt
    }
  }
` 

export const CREATE_EVENT = gql`
  ${EVENT_FIELDS}
  mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!) {
    createEvent(eventInput: {title: $title, description: $description, price: $price, date: $date}) {
      ...EventFields
    }
  }
` 

export const BOOKINGS = gql`
  ${EVENT_FIELDS}
  query Bookings{
    bookings {
      _id
      createdAt
      event {
       ...EventFields
      }
      user{
        username
        email
      }
    }
  }
` 

export const CANCEL_BOOKING = gql`
  mutation CancelBooking($bookingId: ID!){
    cancelBooking(bookingId: $bookingId) {
      _id
      title
    }
  }
` 

export const EVENT_ADDED = gql`
  ${EVENT_FIELDS}
  subscription {
    eventAdded {
      ...EventFields
    }
  }
`