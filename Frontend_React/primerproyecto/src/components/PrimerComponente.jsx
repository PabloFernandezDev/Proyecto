import React from 'react'

export default function PrimerComponente() {
  
  const nombre = "Pablo Fernandez"; 
  const profesion = "Programador"

  let usuario = {
      nombre: "Homer",
      apellido: "Simpson",
      profesion: "Dibujo animado",
      direccion: "Marbella",
      telefono: "123124512312"
  };

  console.log("Nombre"+ nombre + ", profesion" + profesion);
  console.log(usuario );

  return (
    <div className='mi-componente'>
      <hr/>
      <h2>Componente inicial</h2>
      <p>Este ha sido mi primer componente de: {nombre}</p>
      <p>Profesión: {profesion}</p>
      <h3>Datos del usuario</h3>
      <p>Dirección: {JSON.stringify(usuario.direccion)}</p>
      <p>Teléfono: {JSON.stringify(usuario.telefono)}</p>
      <p>Nombre: {JSON.stringify(usuario.nombre)}</p>
      <p>Apellido: {usuario.apellido}</p>
      <p>Profesion: {usuario.profesion}</p>


    </div>
  )
}
