import React, { useState } from 'react'

export const QuintoComponente = () => {
  //UseState dispone de 2 partes:
  //1.- la variable que va a guardar el dato del estado
  //2.- la función que me va a permitir acceder a ese dato y modificarlo
    
  const [nombre, setNombre] = useState("Pablo Fernandez Garcia");

  const cambiarNombre = (e, nombreParam) => {
    setNombre(nombreParam);
  }

  const cambiarNombre2 = (e) => {
    setNombre(e.target.value)
  }
    
  return (
    <div>   
        <h3>Componente cambio de nombre mediante UseState</h3>
        <p>Componente de: {nombre}</p>
        {/* <button onClick={e => cambiarNombre(e, "Pepe grillo")}>Cambiar nombre</button> */}
        <input  onChange={e => cambiarNombre(e, e.target.value)} type='text' placeholder='Cambia el nombre'/>
        <input type="text" onKeyUp={e => cambiarNombre2(e)} />
    </div>
  )
}
