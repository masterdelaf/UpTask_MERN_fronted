import { useState } from 'react'
import {Link} from 'react-router-dom'
import Alerta from '../components/Alerta'
import clienteAxios from '../config/clienteAxios'

const Registrar = () => {
  const [nombre, setNombre ] = useState('')
  const [email, setEmail ] = useState('')
  const [password, setPassword ] = useState('')
  const [repetirPassword, setRepetirPassword ] = useState('')
  const [alerta, setAlerta] = useState({})

  const handledSubmit = async (e) => {
    e.preventDefault()

    // Comprobar que no haya ningun campo vacio
    if([nombre, email, password, repetirPassword].includes('')){
      setAlerta({
        msg: 'Falta algun campo por rellenar',
        error: true
      })
    }

    // Comprobar que las passwors sean iguales
    if(password.trim() !== repetirPassword.trim()){
      setAlerta({
        msg: 'Las passwords no coinciden',
        error: true
      })
      return
    }

    // Comprobar que el password no sea menor a 6
    if(password.length < 6){
      setAlerta({
        msg: 'La password es demasiada corta',
        error: true
      })
      return
    }

    setAlerta({})

    // Crear el usuario en la API
    try {
      // Con destructuring accedemos directamente a data, que es donde estan los datos que interesan
      const {data} = await clienteAxios.post(`/usuarios`, {nombre, email, password})

      setAlerta({
        msg: data.msg,
        error: false
      })

      setNombre('')
      setEmail('')
      setPassword('')
      setRepetirPassword('')

    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const {msg} = alerta

  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl'>Crea tu <span className='text-slate-700'>cuenta</span> </h1>

      { msg && <Alerta alerta={alerta} />}

      <form 
        className='my-10 bg-white shadow rounded-lg p-10'
        onSubmit={handledSubmit}
      >
      <div className='my-5'>
          <label
            className='uppercase text-gray-600 block text-xl font-bold'
            htmlFor='nombre'  
          >
          Nombre</label>
          <input
            id='nombre'
            type="nombre"
            placeholder='Tu nombre'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className='my-5'>
          <label
            className='uppercase text-gray-600 block text-xl font-bold'
            htmlFor='email'  
          >
          Email</label>
          <input
            id='email'
            type="email"
            placeholder='Email de registro'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='my-5'>
          <label
            className='uppercase text-gray-600 block text-xl font-bold'
            htmlFor='password'  
          >
          Password</label>
          <input
            id='password'
            type="password"
            placeholder='Password'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className='my-5'>
          <label
            className='uppercase text-gray-600 block text-xl font-bold'
            htmlFor='password2'  
          >
          Repetir Password</label>
          <input
            id='password2'
            type="password"
            placeholder='Repite la Password'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={repetirPassword}
            onChange={(e) => setRepetirPassword(e.target.value)}
          />
        </div>

        <input
          type='submit'
          value='Crear Cuenta'
          className='bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors'
        />

        <nav className='lg: flex lg:justify-between'>
          <Link
            className='block text-center my-5 text-slate-500 uppercase text-sm'
            to="/registrar"
          >Ya tienes una cuenta? Inicia sesión</Link>
          <Link
            className='block text-center my-5 text-slate-500 uppercase text-sm'
            to="/olvide-password"
          >Olvidé mi password</Link>
        </nav>
      </form>

      
    </>
  )
}

export default Registrar