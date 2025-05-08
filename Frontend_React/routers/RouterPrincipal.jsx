import React from 'react'
import { CompInicio } from '../src/components/CompInicio'
import { Login } from '../src/components/Login'
import { Register } from '../src/components/Register'
import { DashBoard } from '../src/components/DashBoard'
import { FormCoche } from '../src/components/FormCoche'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

const RouterPrincipal = () => {
  return (
        <Routes>
            <Route path='/' element={<CompInicio/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/register' element={<Register/>}></Route>
            <Route path='/home' element={<DashBoard/>}></Route>
            <Route path='/home/addCoche' element={<FormCoche/>}></Route>
        </Routes>
  )
}

export default RouterPrincipal
