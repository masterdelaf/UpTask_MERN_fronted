import React, { useEffect, useState } from 'react'
import useProyectos from '../hooks/useProyectos'
import Alerta from './Alerta'
//import {formatearFecha} from '../helpers/formatearFecha'

const FormularioTarea = () => {

    const [id, setId] = useState('')
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [prioridad, setPrioridad] = useState('')
    const [fechaEntrega, setFechaEntrega] = useState('')

    const {mostrarAlerta, alerta, submitTarea, tareaSeleccionada} = useProyectos()

    useEffect(() => {
        if(tareaSeleccionada?._id){
            setId(tareaSeleccionada._id)
            setNombre(tareaSeleccionada.nombre)
            setDescripcion(tareaSeleccionada.descripcion)
            setPrioridad(tareaSeleccionada.prioridad)
            setFechaEntrega(tareaSeleccionada.fechaEntrega?.split('T')[0])
            return
        }
        setId('')
        setNombre('')
        setDescripcion('')
        setFechaEntrega('')
        setPrioridad('')
    }, [])

    const handledSubmit = async e => {
        e.preventDefault()

        if([nombre, descripcion, prioridad, fechaEntrega].includes('')){
            mostrarAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return
        }

        await submitTarea({id, nombre, descripcion, fechaEntrega, prioridad})
    }

    const {msg} = alerta

    return (
        <form 
            onSubmit={handledSubmit}
            className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow'
        >
            {msg && <Alerta alerta={alerta}/>}
            <div className='mb-5'>
                <label
                    className='text-gray-700 uppercase font-bold text-sm'
                    htmlFor='nombre'
                >
                    Nombre Tarea
                </label>
                <input 
                    type='text'
                    id='nombre'
                    placeholder='Nombre de la tarea'
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                />
            </div>

            <div className='mb-5'>
                <label
                    className='text-gray-700 uppercase font-bold text-sm'
                    htmlFor='descripcion'
                >
                    Descripcion Tarea
                </label>
                <textarea 
                    id='descripcion'
                    placeholder='Descripción de la tarea'
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                />
            </div>

            <div className='mb-5'>
                <label
                    className='text-gray-700 uppercase font-bold text-sm'
                    htmlFor='fecha'
                >
                    Fecha de Entrega
                </label>
                <input 
                    type='date'
                    id='fecha'
                    placeholder='Fecha de Entrega'
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    value={fechaEntrega}
                    onChange={e => setFechaEntrega(e.target.value)}
                />
            </div>

            <div className='mb-5'>
                <label
                    className='text-gray-700 uppercase font-bold text-sm'
                    htmlFor='prioridad'
                >
                    Prioridad de Tarea
                </label>
                <select 
                    id='prioridad'
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    value={prioridad}
                    onChange={e => setPrioridad(e.target.value)}
                >
                    <option value=''>-- Seleccionar --</option>
                    {/* {PRIORIDAD.map( opcion => {
                        <option key={opcion} value={opcion}>{opcion}</option>
                    } )} */}
                    <option value='Baja'>Baja</option>
                    <option value='Media'>Media</option>
                    <option value='Alta'>Alta</option>
                </select>
            </div>

            <input 
                type='submit'
                value={Object.keys(tareaSeleccionada).length > 0 ? 'Editar Tarea' : 'Agregar Tarea'}
                className='bg-sky-600 hover:bg-sky-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded text-sm'
            />
        </form>
    )
}

export default FormularioTarea