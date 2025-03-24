import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import axios from 'axios';

export const AjaxComponentDinamic = () => {

    const [usuarios, setUsuarios] = useState([]);

    //   Manejo y gestion de errores 
    const [error, setError] = useState("");
  
      //Función para rellenar el array de usuarios 
      // Opcion 1 - Fetch
      const getUsuariosDinamicoFetch = () => {
          fetch('https://rickandmortyapi.com/api/character', {
            method:'GET', 
            headers: {'Content-Type': 'application/json'}
          })
          .then(respuesta => respuesta.json())
          .then(resultadoFinal => {
            setUsuarios(resultadoFinal.results)
          }),
          error => {
            console.log(error);
            setError(error.message);
          }
        }

      // Opcion 2 - Async Await
      const getUsuariosDinamicoAsync = async() => {
            try {
                const peticion = await fetch('https://rickandmortyapi.com/api/character', {
                                        method:'GET', 
                                        headers: {'Content-Type': 'application/json'}
                                    });

                const {results} = await peticion.json()
                console.log(results);
                setUsuarios(results)
            } catch(error) {
                console.log(error);
                setError(error.message);
            }
        }

        // Opcion 3 - Axios
        const getUsuariosDinamicoAxios = () => {
            axios.get('https://rickandmortyapi.com/api/character')
                .then(resultadoFinal => {
                    setUsuarios(resultadoFinal.data.results);
                })
                .catch(error => {
                    console.error(error);
                    setError(error.message);
                });
        };
        

      useEffect(() => {
        getUsuariosDinamicoAxios()
      }, [])

      if (error !== "") {
        return (
            <div>
                <h2>Lista de Usuarios de API</h2>
                <p>Listado de usuarios no ha podido cargarse</p>       
                <p>Error: {error}</p> 
            </div>
          )
      
      } else {
        return (
            <div>
                <h2>Lista de Usuarios de API</h2>
                {/* Peticiones Ajax,... podremos realizarlo mediante:
                -promesas (fetch, HttpRequest), async await, ...axios */}
                {/* Opcion 1 */}
                {/* <ol>
                    {usuarios.map((usuario) => (
                        <li key={usuario.id}>
                            <p>{usuario.name}</p>
                            <p>{usuario.species}</p>
                            <img src={usuario.image} alt="Imagen" />
                        </li>
                    ))}
                </ol> */}

                {/* Opcion 2 */}
                <ol>

                    {usuarios.forEach(usuario => {
                        return(
                        <li key={usuario.id}>
                            <p>{usuario.name}</p>
                            <p>{usuario.species}</p>
                            <img src={usuario.image} alt="Imagen" />
                            <p>Hola</p>
                        </li>
                        )
                    })}
                </ol>
        
            </div>
          )
      }
  
      
}
