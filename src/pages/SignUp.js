import React, { useState, useContext, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_USER } from '../queries'
import Error from '../components/Error'
import Spinner from '../components/Spinner'
import AuthContext from '../context/auth-context'

export default function SignUpPage() {
    const [alert, setAlert] = useState("")
    const value = useContext(AuthContext)

    function SignUp() {
        const [username, setUsername] = useState("")
        const [email, setEmail] = useState("")
        const [password, setPassword] = useState("")
        const [signup, { loading, error, data }] = useMutation(CREATE_USER, {
            onError: (error) => setAlert(error.message),
            onCompleted: () => {
                setAlert(" Account successfully created")
            }
        })

        useEffect(() => {
            if (!loading && data) {
                const token = data.createUser.token
                const userId = data.createUser.userId
                const username = data.createUser.username
                value.login(token, userId, username)
            }
        }, [data, loading])

        if (loading) return <Spinner />
        if (error) return error.message

        return (
            <form className='auth-form' onSubmit={(event) => {
                event.preventDefault()
                if (username.trim().length < 3 || password.trim().length < 6) {
                    setAlert("All fields must be filled in correctly!")
                    return
                }
                signup({
                    variables: { username: username.trim(), email: email.trim(), password: password.trim() }
                })
            }}>
                <Error error={alert} />
                <div className="mb-3 mt-2">
                    <label className="form-label" htmlFor='username'> Username</label>
                    <input
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor='email'> Email</label>
                    <input
                        className="form-control"
                        id="email"
                        type="email"
                        value={email}
                        onChange={({ target }) => setEmail(target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor='password'> Password</label>
                    <input
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                        type="password"
                        required
                        minLength="6"
                    />
                </div>
                <div className='form-actions'>
                    <button type='submit' className="btn">Submit</button>
                </div>
            </form>
        )
    }

    return (
        <SignUp />
    )
}