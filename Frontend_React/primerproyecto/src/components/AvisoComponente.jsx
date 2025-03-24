import React from 'react'
import { useEffect } from 'react'

export const AvisoComponente = () => {
  
    useEffect(() => {
        alert("El componente AvisoComponente se ha montado ");

        // cuando se desmonta un componente lo vamos a detectar a partir de la ejecución de este return 
        return () => {
            alert("componente desmontado");
        }
    }, []);
  
    return (
    <div>
        <hr /><hr />
        <h3>Bienvenido Administrador</h3>
        <button onClick={(e) => {
            alert("Bienvenido!!!")
        }}>Mostrar Alerta</button>
    </div>
  )
}
