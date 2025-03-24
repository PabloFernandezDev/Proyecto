import React from 'react'
import Icon from '../assets/Icon'

export const Footer = () => {
  return (
    <section className='footer'>
        <div className='footer__iconos'>
            <Icon icon="youtube" size={40} color="white"/>
            <Icon icon="twitter" size={40} color="white"/>
            <Icon icon="instagram" size={40} color="white"/>
            <Icon icon="facebook, brand, social" size={40} color="white"/>
        </div>
        <p className='footer--texto'>Derechos Reservados por Pablo Fernandez Garcia</p>
    </section>
  )
}
