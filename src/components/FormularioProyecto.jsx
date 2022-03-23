import {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos'
import Alerta from './Alerta'

const FormularioProyecto = () => {

    const [id, setId] = useState(null)
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [fechaEntrega, setFechaEntrega] = useState('')
    const [cliente, setCliente] = useState('')

    const params = useParams()

    const {mostrarAlerta, alerta, submitProyecto, proyecto} = useProyectos()

    // Este useEffect se utiliza por si al cargar se está editando rellenar los campos.
    useEffect(() => {
        //Si existe la ID está editando
        if(params.id) {
            setId(proyecto._id)
            setNombre(proyecto.nombre)
            setDescripcion(proyecto.descripcion)
            // Este split es para coger el primer bloque de la fecha, que es el que nos interesa, se le pone ? para que no de error si no ha cargado
            setFechaEntrega(proyecto.fechaEntrega?.split('T')[0])
            setCliente(proyecto.cliente)
        }
    }, [])

    const handledSubmit = async (e) => {
        e.preventDefault()

        if([nombre, descripcion, fechaEntrega, cliente].includes('')){
            mostrarAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return
        }

        // pasar los datos hacia el provider
        await submitProyecto({ id, nombre, descripcion, fechaEntrega, cliente })

        setId(null)
        setNombre('')
        setDescripcion('')
        setFechaEntrega('')
        setCliente('')

    }

    const {msg} = alerta

  return (
    <form 
        className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow'
        onSubmit={handledSubmit}
    >

        {msg && <Alerta alerta={alerta}/>}

        <div className='mb-5'>
            <label
                className='text-gray-700 uppercase font-bold text-sm'
                htmlFor='nombre'
            >Nombre</label>

            <input 
                id='nombre'
                type='text'
                className='border w-full p-2 placeholder-gray-400 rounded-md'
                placeholder='Nombre del Proyecto'
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
            />
        </div>

        <div className='mb-5'>
            <label
                className='text-gray-700 uppercase font-bold text-sm'
                htmlFor='descripcion'
            >Descripción</label>

            <textarea 
                id='descripcion'
                className='border w-full p-2 placeholder-gray-400 rounded-md'
                placeholder='Descripción del Proyecto'
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
            />
        </div>

        <div className='mb-5'>
            <label
                className='text-gray-700 uppercase font-bold text-sm'
                htmlFor='fecha-entrega'
            >Fecha de Entrega</label>

            <input 
                id='fecha-entrega'
                type='date'
                className='border w-full p-2 placeholder-gray-400 rounded-md'
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
            />
        </div>

        <div className='mb-5'>
            <label
                className='text-gray-700 uppercase font-bold text-sm'
                htmlFor='cliente'
            >Nombre del Cliente</label>

            <input 
                id='cliente'
                type='text'
                className='border w-full p-2 placeholder-gray-400 rounded-md'
                placeholder='Nombre del Cliente'
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
            />
        </div>

        <input 
            type='submit'
            value={id ? 'Actualizar Proyecto' : 'Agregar Proyecto'}
            className='bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-color'
        />
    </form>
  )
}

export default FormularioProyecto