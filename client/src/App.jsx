import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import RequireAuth from './Components/RequireAuth'

const App = () => {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route path='/' element={<Home />} />
      </Route>
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  )
}

export default App
