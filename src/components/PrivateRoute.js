import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../context/auth-context'
 
export default function PrivateRoute({children }){
    const value = useContext(AuthContext)
    return (!value.token) ? <Navigate replace to="/login" /> :  children 
}
