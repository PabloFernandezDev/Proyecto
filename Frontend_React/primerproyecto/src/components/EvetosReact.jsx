import React from 'react'

export const EvetosReact = () => {
    const hasDadoClick = (e) =>  {
        alert ("Has dado click al botón");
    }

    const hasDadoDobleClick = (e, nombre) =>  {
        alert ("Has dado doble click al botón " + nombre);
    }

    const hasEntrado = (e) =>  {
        alert ("Has entrado en la caja");
    }

    const hasSalido = (e) =>  {
        alert ("Has salido en la caja");
    }

    return ( 
        <div>
            <h1>Eventos en React</h1>
            { }
                <button onClick={hasDadoClick}>Click Aqui!!!</button>
            { }
                <button onDoubleClick={e => hasDadoDobleClick(e, "Pablo")}>Doble Click Aqui!!!</button>
                <hr/>
            <div className='caja' id='caja' onMouseEnter={hasEntrado} onMouseLeave={hasSalido}>
                Soy una CAJA!!!
            </div>
            {/* <p>
                <input type="text" onFocus={hasEntrado} onBlur={hasSalido} placeholder='Introduce tu nombre'/> 
            </p> */}
        </div>
  )
}

