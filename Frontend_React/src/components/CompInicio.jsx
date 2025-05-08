import React from 'react'
import {Header} from '../components/Header'
import {Carrousel} from '../components/Carrousel'
import {Bienvenida} from '../components/Bienvenida'
import {Newsletter} from '../components/Newsletter'
import {BotonesLoginRegister} from '../components/BotonesLoginRegister'
import {Footer} from '../components/Footer'

export const CompInicio = () => {
  return (
    <div>
      <Header/>
        <Carrousel/>
        <Bienvenida/>
        <div className='containerComponents'>
            <Newsletter/>
            <BotonesLoginRegister/>
        </div>
        <Footer/>
    </div>
  )
}

