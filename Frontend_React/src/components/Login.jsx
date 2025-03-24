import React from 'react'

export const Login = () => {
  return (
    <div className="login">
        <div className='login__container'>
            <h2 className='login__titulo'>Iniciar Sesión</h2>
            <form className='login__formulario'>
                <input 
                type='email' 
                placeholder='Correo Electrónico'
                className='login__input'
                />
                <input 
                type='password' 
                placeholder='Contraseña'
                className='login__input'
                />
                <button type='submit' className='boton login__boton'>
                Iniciar Sesión
                </button>
            </form>
        </div>
    </div>
  )
}
