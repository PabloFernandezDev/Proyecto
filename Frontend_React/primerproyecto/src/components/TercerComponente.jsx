import React from 'react'
import PropTypes from 'prop-types'
export const TercerComponente = (props) => {

    // opcion 2 - utilizando desestructuracion del objeto
    // export const TercerComponente = ({nombre, apellidos, ficha}) => 

    // definiendo valores por defecto 
    // export const TercerComponente = ({nombre = "Pablo", apellidos = "Fernandez", ficha}) => 
    
    console.log(props);

    return (
        <div>
            <h1>Estoy comunicando componentes</h1>
            <ul>
                <li>{props.nombre}</li>
                <li>{props.apellidos}</li>
                <li>{props.ficha.altura}</li>
                <li>{props.ficha.peso}</li>
                <li>{props.ficha.alergias}</li>
            </ul>
        </div>
    )
}

//Validacion de propiedades
//https://es.legacy.reactjs.org/docs/typechecking-with-proptypes.html
TercerComponente.PropTypes = {
    nombre: PropTypes.string.isRequired,
    apellidos: PropTypes.string.isRequired,
    ficha: PropTypes.object.isRequired,
}

//definicion de valores por defecto

TercerComponente.defaultProps = {
    nombre: "Juan",
    apellidos: "Martinez",
    ficha: {altura: "199cm", peso:"85kg"}
}