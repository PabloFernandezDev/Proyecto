import React from 'react'

export const SegundoComponente = () => {

    // const libros = ["Harry Potter", "Juego de Tronos", "Los pilares de la Tierra"];
    const libros = [];
  
    return (
        <div className='segundo-componente'>
            <h2>Segundo Componente</h2>
            <h3>Listado de libros</h3>
            {   libros.length >= 1 ? (
                    <ul>
                        {
                            libros.map((libro, indice) => {
                                console.log(indice, libro);
                                return <li key={indice}>{libro}</li>
                            })
                        }
                    </ul>
                )   : (<p>No hay libros</p>)
            }


        </div>

)
}
