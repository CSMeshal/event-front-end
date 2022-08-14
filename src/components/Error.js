import React from 'react' 
import { Alert } from 'reactstrap' 
   
const Error = props => {
    return props.error ? <Alert>{props.error}</Alert> : ''
} 

export default Error 