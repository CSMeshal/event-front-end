import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'
import AuthContext from '../context/auth-context'
import Error from '../components/Error'
import Spinner from '../components/Spinner'

export default function LoginPage() {
    const value = useContext(AuthContext)
    const [alert, setAlert] = useState("")

    function Login() {
        const [email, setEmail] = useState("")
        const [password, setPassword] = useState("")
        const navigate = useNavigate()
        const [login, { loading, data }] = useMutation(LOGIN, {
            onError: (error) => setAlert(error.message)
        })
        useEffect(() => {
            if (!loading && data) {
                const token = data.login.token
                const userId = data.login.userId
                const username = data.login.username
                value.login(token, userId, username)
            }
        }, [data, loading])

        if (loading) return <Spinner />

        return (
            <form className='auth-form' onSubmit={(event) => {
                event.preventDefault()
                login({
                    variables: { email: email.trim(), password: password.trim() }
                })
            }}>
                <Error error={alert} />
                <div className="mb-3 mt-2">
                    <label className="form-label" htmlFor='email'>Email </label>
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
                    <button className='btn m-2' type='submit' >Login</button>
                    <button className='btn' onClick={() => navigate('/signUp')}>
                    Not a member? Signup                     </button>
                </div>
            </form>
        )
    }

    return (
        <Login />
    )
}

