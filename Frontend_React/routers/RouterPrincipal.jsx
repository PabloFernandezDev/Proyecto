import React from 'react'
import { CompInicio } from '../src/components/CompInicio'
import { Login } from '../src/components/Login'
import { Register } from '../src/components/Register'
import { DashBoard } from '../src/components/DashBoard'
import { FormCoche } from '../src/components/FormCoche'
import { Empleados } from '../src/components/Empleados'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Prueba } from '../src/components/Prueba'
import { Aboutus } from '../src/components/Aboutus'
import { WhereAreWe } from '../src/components/WhereAreWe'
import { Perfil } from '../src/components/Perfil'
import { CocheDetails } from '../src/components/CocheDetails'
import { LoginAdmin } from '../src/components/LoginAdmin'
import { LoginMecanico } from '../src/components/LoginMecanico'
import { AdminPanel } from '../src/components/AdminPanel'
import { PanelMecanico } from '../src/components/PanelMecanico'
import { LeerUsers } from '../src/components/crudUsers/LeerUsers'
import { LeerCoches } from '../src/components/crudCoches/LeerCoches'
import { DetalleCoche } from '../src/components/crudCoches/DetalleCoche'

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


            <Route path='/employees' element={<Empleados/>}></Route>
            <Route path='/employees/admin' element={<LoginAdmin/>}></Route>
            <Route path='/employees/admin/panel' element={<AdminPanel/>}></Route>
            <Route path='/employees/mecanic' element={<LoginMecanico/>}></Route>
            <Route path='/employees/mecanic/panel' element={<PanelMecanico/>}></Route>
            <Route path='/employees/crud/users' element={<LeerUsers/>}></Route>
            <Route path='/employees/crud/coches' element={<LeerCoches/>}></Route>
            <Route path='/employees/crud/coches/:id/detalle' element={<DetalleCoche/>}></Route>
            

        </Routes>
  )
}

export default RouterPrincipal
