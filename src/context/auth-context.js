import React from 'react'
export default React.createContext({
  token: null,
  username: null,
  userId: null,
  login: () => { },
  logout: () => { },
})
