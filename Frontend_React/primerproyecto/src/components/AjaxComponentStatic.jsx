import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'

export const AjaxComponentStatic = () => {

    const [usuarios, setUsuarios] = useState([]);

    //Función para rellenar el array de usuarios 
    const getUsuariosEstaticos = () => {
        setUsuarios([
            {"id":7,"email":"michael.lawson@reqres.in","first_name":"Michael","last_name":"Lawson","avatar":"https://reqres.in/img/faces/7-image.jpg"},
            {"id":8,"email":"lindsay.ferguson@reqres.in","first_name":"Lindsay","last_name":"Ferguson","avatar":"https://reqres.in/img/faces/8-image.jpg"},
            {"id":9,"email":"tobias.funke@reqres.in","first_name":"Tobias","last_name":"Funke","avatar":"https://reqres.in/img/faces/9-image.jpg"},
            {"id":10,"email":"byron.fields@reqres.in","first_name":"Byron","last_name":"Fields","avatar":"https://reqres.in/img/faces/10-image.jpg"},
            {"id":11,"email":"george.edwards@reqres.in","first_name":"George","last_name":"Edwards","avatar":"https://reqres.in/img/faces/11-image.jpg"},
            {"id":12,"email":"rachel.howell@reqres.in","first_name":"Rachel","last_name":"Howell","avatar":"https://reqres.in/img/faces/12-image.jpg"}      
        ]);
    }

    useEffect(() => {
        getUsuariosEstaticos()
    }, [])

    return (
    <div>
        <h2>Lista de Usuarios de API</h2>
        {/* Peticiones Ajax,... podremos realizarlo mediante:
        -promesas (fetch, HttpRequest), async await, ...axios */}

        <ol>
            {usuarios.map((usuario) => (
                <li key={usuario.id}>
                    <p>{usuario.first_name} {usuario.last_name}</p>
                    <p>{usuario.email}</p>
                    <img src={usuario.avatar} alt="Imagen" />
                </li>
            ))}
        </ol>

    </div>
  )
}
