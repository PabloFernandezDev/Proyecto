import React from 'react'
import { CompInicio } from '../src/components/CompInicio'
import { Login } from '../src/components/Login'
import { Register } from '../src/components/Register'
import { DashBoard } from '../src/components/DashBoard'
import { FormCoche } from '../src/components/FormCoche'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Prueba } from '../src/components/Prueba'
import { Aboutus } from '../src/components/Aboutus'
import { WhereAreWe } from '../src/components/WhereAreWe'
import { Perfil } from '../src/components/Perfil'
import { CocheDetails } from '../src/components/CocheDetails'

const RouterPrincipal = () => {
  return (
        <Routes>
            <Route path='/' element={<CompInicio/>}></Route>
            <Route path='/aboutus' element={<Aboutus/>}></Route>
            <Route path='/where' element={<WhereAreWe/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/register' element={<Register/>}></Route>
            <Route path='/home' element={<DashBoard/>}></Route>
            <Route path='/home/addCoche' element={<FormCoche/>}></Route>
            <Route path='/home/coche/details' element={<CocheDetails/>}></Route>
            <Route path='/home/perfil' element={<Perfil/>}></Route>
            <Route path='/prueba' element={<Prueba/>}></Route>
            
        </Routes>
  )
}

export default RouterPrincipal
