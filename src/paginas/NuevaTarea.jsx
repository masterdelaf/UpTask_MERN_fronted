import React from 'react'
import FormularioTarea from '../components/FormularioTarea'
import useProyectos from '../hooks/useProyectos'

const NuevaTarea = () => {

  const {tareaSeleccionada} = useProyectos()

  return (
    <>
      <h1 className='text-4xl font-black'>{Object.keys(tareaSeleccionada).length > 0 ? 'Editar Tarea' : 'Nueva Tarea '}</h1>

      <div className='mt-10 flex justify-center'>
        <FormularioTarea/>
      </div>
    </>
  )
}

export default NuevaTarea