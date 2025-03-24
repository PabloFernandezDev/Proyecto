import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react' 
import { AvisoComponente } from './AvisoComponente'

export const SextoComponenteUseEffect = () => {


    const [usuario, setUsuario] = useState("pablo Fernandez")

    const modificoUsuario = (e) => {
        setUsuario(e.target.value);
    }

    const [fecha, setFecha] = useState("11/11/1125")

    const cambiarFecha = (e) => {
        setFecha(new Date().toLocaleString())
    }

    const [contador, setContador ] = useState(0)

    //Opcion 1 - que se ejecute este metodo/efecto nada más que cargamos el componente 
    useEffect(() => {
        console.log("Cargo el componente")
    },[]);

    //Opcion 2 - que se ejecute cuando cambia una variable,... por ejemplo mi usuario 
    useEffect(() => {
        console.log("Recargo el componente por una variable")
        setContador(contador + 1)
    },[usuario,fecha]);
    

  return (
    <div>
        <h1>Componente Use State - Use Effect</h1>
        {/* Vamos a generar un efecto en cadena cuando se realice un cambio en el estado de mi componente */}
        <b className={contador > 10 ? 'label label--green' : 'label'}>{usuario}</b>

        <b className={contador > 10 ? 'label label--green' : 'label'}>{fecha}</b>

        <p>
            <input type="text" onChange={modificoUsuario} placeholder='Cambia el nombre'/>
            <button onClick={cambiarFecha}>Cambiar Fecha</button>
        </p>

        {usuario == 'Admin' && <AvisoComponente/>}
    </div>
  )
}
