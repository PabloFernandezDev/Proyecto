import React, { useState } from 'react'
import PropTypes from 'prop-types'

// 1.- Crear un componente
// 2.- Recibir una "prop" con el año actual.
// 3.- Debo usar funciones para sacar el año.
// 4.- Usar estados y eventos para tener dos botones.
//     - Pasar al próximo año
//     - Ir al año anterior.
//     - Mostar en todo momento el año por pantalla.
// 5.- Validar que el año sea un numero y que sea reperido (prop)
// 6.- Cambiar el año mediante un input de texto y que se cambie dinámicamente

export const CuartoComponente = ({year}) => {

    const [yearNew, setYearNew] = useState(year)

    const siguiente = () => {
        setYearNew(yearNew+1);
    }

    const anterior = () => {
        setYearNew(yearNew-1);
    }

    const cambiarYear = (e) => {
        let dato = parseInt(e.target.value);

        if (Number.isInteger(dato)) {
            setYearNew(dato)
        }   else {
            setYearNew(year);
        }

    }

  return (
    <div>
        <h2>Ejercicio de props y UseState</h2>
        <p className='label'>{yearNew}</p>
        <button onClick={anterior}>Anterior</button>
        <button onClick={siguiente}>Siguiente</button>
        <p>Cambia año:
            <input onChange={cambiarYear} type='text' placeholder='Cambia el año'/>
        </p>
    </div>
  )
}


CuartoComponente.PropTypes = {
    year:   PropTypes.number.isRequired
}
