import React from 'react'
import {Header} from './Header'
import {Carrousel} from './Carrousel'
import {Bienvenida} from './Bienvenida'
import {Newsletter} from './Newsletter'
import {BotonesLoginRegister} from './BotonesLoginRegister'
import {Footer} from './Footer'

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

