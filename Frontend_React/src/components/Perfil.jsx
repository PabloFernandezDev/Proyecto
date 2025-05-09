import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { FiUser, FiEdit2, FiCheck, FiX, FiArrowLeft, FiKey } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import '../style.css';

export const Perfil = () => {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [mostrarCambioPassword, setMostrarCambioPassword] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', apellidos: '', email: '', telefono: '', dni: '' });
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      fetch(`http://127.0.0.1:8000/user/${userId}`)
        .then(res => res.json())
        .then(data => {
          setUsuario(data);
          setFormData(data);
        })
        .catch(err => console.error('Error al cargar usuario:', err));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteAccount = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.")) {
      const userId = localStorage.getItem('user_id');
      fetch(`http://127.0.0.1:8000/user/${userId}`, {
        method: 'DELETE',
      })
        .then(() => {
          localStorage.clear();
          alert('Cuenta eliminada correctamente.');
          navigate('/login');
        })
        .catch(err => console.error('Error al eliminar cuenta:', err));
    }
  };

  const guardarCambios = () => {
    const userId = localStorage.getItem('user_id');
    fetch(`http://127.0.0.1:8000/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        setUsuario(data);
        setEditando(false);
      })
      .catch(err => console.error('Error al guardar usuario:', err));
  };

  const cambiarPassword = () => {
    if (nuevaPassword !== confirmarPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    console.log(confirmarPassword)
    const userId = localStorage.getItem('user_id');
    fetch(`http://127.0.0.1:8000/user/${userId}/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: nuevaPassword })
    })
      .then(res => res.json())
      .then(() => {
        alert('Contraseña actualizada correctamente');
        setMostrarCambioPassword(false);
        setNuevaPassword('');
        setConfirmarPassword('');
      })
      .catch(err => console.error('Error al cambiar contraseña:', err));
  };

  return (
    <>
      <Header />
      <div className="perfil" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)' }}>
        <div className="perfil__tarjeta">
          <h2 className="perfil__titulo">Mi Perfil</h2>
          {usuario ? (
            <>
              <div className="perfil__icono" style={{ textAlign: 'center', marginBottom: '20px' }}>
                <FiUser size={100} />
              </div>
              <div className="perfil__info">
                {editando ? (
                  <>
                    <label>Nombre</label>
                    <input name="nombre" value={formData.nombre} onChange={handleInputChange} className="perfil__input" />
                    <label>Apellidos</label>
                    <input name="apellidos" value={formData.apellidos} onChange={handleInputChange} className="perfil__input" />
                    <label>Email</label>
                    <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="perfil__input" />
                    <label>Teléfono</label>
                    <input name="telefono" value={formData.telefono} onChange={handleInputChange} className="perfil__input" />
                    <label>DNI</label>
                    <input name="dni" value={formData.dni} onChange={handleInputChange} className="perfil__input" />
                    <div className="perfil__botones">
                      <button className="perfil__boton" onClick={guardarCambios}><FiCheck /> Guardar</button>
                      <button className="perfil__boton" onClick={() => setEditando(false)}><FiX /> Cancelar</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p><strong>Nombre:</strong> {usuario.nombre}</p>
                    <p><strong>Apellidos:</strong> {usuario.apellidos}</p>
                    <p><strong>Email:</strong> {usuario.email}</p>
                    <p><strong>Teléfono:</strong> {usuario.telefono}</p>
                    <p><strong>DNI:</strong> {usuario.dni}</p>
                    <div className="perfil__botones">
                      <button className="perfil__boton" onClick={() => setEditando(true)}><FiEdit2 /> Editar Perfil</button>
                      <button className="perfil__boton" onClick={() => setMostrarCambioPassword(prev => !prev)}><FiKey /> Cambiar Contraseña</button>
                      <button className="perfil__boton perfil__boton--eliminar" onClick={handleDeleteAccount}>Eliminar Cuenta</button>
                      <button className="perfil__boton" onClick={() => navigate('/home')}><FiArrowLeft /> Volver</button>
                    </div>
                  </>
                )}

                {mostrarCambioPassword && (
                  <div className="perfil__cambio-password">
                    <label>Nueva contraseña</label>
                    <input
                      type="password"
                      value={nuevaPassword}
                      onChange={(e) => setNuevaPassword(e.target.value)}
                      className="perfil__input"
                    />
                    <label>Confirmar contraseña</label>
                    <input
                      type="password"
                      value={confirmarPassword}
                      onChange={(e) => setConfirmarPassword(e.target.value)}
                      className="perfil__input"
                    />
                    <div className="perfil__botones">
                      <button className="perfil__boton" onClick={cambiarPassword}><FiCheck /> Guardar nueva contraseña</button>
                      <button className="perfil__boton" onClick={() => setMostrarCambioPassword(false)}><FiX /> Cancelar</button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p>Cargando datos del usuario...</p>
          )}
        </div>
      </div>
    </>
  );
};
