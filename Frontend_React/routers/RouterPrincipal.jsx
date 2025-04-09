import React from 'react'
import { CompInicio } from '../src/components/CompInicio'
import { Login } from '../src/components/Login'
import { Register } from '../src/components/Register'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

const RouterPrincipal = () => {
  return (
        <Routes>
            <Route path='/' element={<CompInicio/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/register' element={<Register/>}></Route>
        </Routes>
  )
}

export default RouterPrincipal
