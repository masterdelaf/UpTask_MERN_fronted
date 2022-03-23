import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import {useNavigate} from 'react-router-dom'
import useAuth from "../hooks/useAuth";
import io from 'socket.io-client'

let socket

const ProyectosContext = createContext()

const ProyectosProvider = ({children}) => {

    const [proyectos, setProyectos] = useState([])
    const [alerta, setAlerta] = useState({})
    const [proyecto, setProyecto] = useState({})
    const [cargando, setCargando] = useState(false)
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
    const [tareaSeleccionada, setTareaSeleccionada] = useState({})
    const [colaborador, setColaborador] = useState({})

    const [buscador, setBuscador] = useState(false)

    const navigate = useNavigate()
    const { auth } = useAuth()

    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
                const token = localStorage.getItem('token')
                if(!token) return

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const { data } = await clienteAxios('/proyectos', config)
                setProyectos(data)

            } catch (error) {
                console.log(error)
            }
        }
        obtenerProyectos()
    }, [auth])

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
    }, [])

    const mostrarAlerta = alerta => {
        setAlerta(alerta)

        setTimeout(() => {
            setAlerta({})
        }, 5000)
    }

    const submitProyecto = async proyecto => {

        if(proyecto.id) {
            await editarProyecto(proyecto)
        }else{
            await nuevoProyecto(proyecto)
        }
        
    }

    const editarProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
            
            //Sincronizar el state
            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id == data._id ? data : proyectoState)
            setProyectos(proyectosActualizados)
            
            setAlerta({
                msg: 'Proyecto actualizado correctamente',
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000)

        } catch (error) {
            console.log(error)
        }
    }
    const nuevoProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post('/proyectos', proyecto, config)
            //Esta linea es para cuando cree un proyecto nuevo lo agregue al state y no hace falta consultar de nuevo la Bd y lo saca en pantalla
            setProyectos([...proyectos, data])

            setAlerta({
                msg: 'Proyecto creado correctamente',
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000)

            
        } catch (error) {
            console.log(error)
        }
    }

    const obtenerProyecto = async id => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios(`/proyectos/${id}`, config)
            setProyecto(data)
            setAlerta({})
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        } finally {
            setCargando(false)
        }
    }

    const eliminarProyecto = async id => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.delete(`/proyectos/${id}`, config)

            // Sincronizar el state
            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id)
            setProyectos(proyectosActualizados)
            
            console.log(data)            
            setAlerta({
                msg: data,
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000)

        } catch (error) {
            console.log(error)
        }
    }

    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTareaSeleccionada({})
    }

    const submitTarea = async tarea => {

        tarea.proyecto = proyecto._id

        if(tarea?.id){
            await editarTarea(tarea)
        }else{
            await crearTarea(tarea)
        }

         
        
    }

    const crearTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post('/tareas', tarea, config)

            setAlerta({})

            //SOCKET IO
            socket.emit('nueva tarea', data)
            
           
            
        } catch (error) {
            console.log(error)
        }
    }

    const editarTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
            
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === data._id ? data : tareaState)

            setProyecto(proyectoActualizado)
            setTareaSeleccionada({})
            //TODO: Averiguar como redireccionar al proyecto pasando la ID
            navigate({
                pathname: '/proyectos',
                search: `${proyectoActualizado._id}`
            })


        } catch (error) {
            console.log(error)
        }
    }

    const pasarDatosEditarTarea = tarea => {
        setTareaSeleccionada(tarea)

        navigate('tareas')
    }

    const eliminarTarea = async tarea => {
        //console.log(tarea)
        let opcion = confirm('¿Estas seguro de eliminar la tarea?')

        if(opcion){
            try {
                const token = localStorage.getItem('token')
                if(!token) return
    
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const {data} = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
                setAlerta({
                    msg: data.msg,
                    error: false
                })

                //Socket
                socket.emit('eliminar tarea', tarea)

                setTareaSeleccionada({})

                setTimeout(() => {
                    setAlerta({})
                }, 3000)

            } catch (error) {
                console.log(error)
            }
        }
    }

    const submitColaborador = async email => {

        setCargando(true)

        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            //Lo buscamos en la base de datos
            const { data } = await clienteAxios.post('/proyectos/colaboradores', {email}, config)
            //Lo ponemos en el estado
            setColaborador(data)
            setAlerta({})

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        } finally {
            setCargando(false)
        }
    }

    const agregarColaborador = async email => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)
            
            setAlerta({
                msg: data.msg,
                error: false
            })

            setColaborador({})

            setTimeout(() => {
                setAlerta({})
            }, 3000 )
            

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            
        }
    }

    const eliminarColaborador = async colaborador => {
        let opcion = confirm('¿Estas seguro de eliminar la tarea?')

        if(opcion){
            try {
                const token = localStorage.getItem('token')
                
                if(!token) return

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                setColaborador(colaborador)

                const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config)

                const proyectoActualizado = {...proyecto}

                proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id)

                setProyecto(proyectoActualizado)

                setAlerta({
                    msg: data.msg,
                    error: false
                })
                setColaborador({})
                setTimeout(() => {
                    setAlerta({})
                }, 3000 )
            } catch (error) {
                console.log(error.response)
            }
        }
    }

    const completarTarea = async id => {
        try {
            const token = localStorage.getItem('token')
                
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)

            setTareaSeleccionada({})
            setAlerta({})

            // Socket
            socket.emit('cambiar estado', data)

        } catch (error) {
            console.log(error)
        }
    }

    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    // Socket io
    const submitTareasProyecto = (tarea) => {
         // Agrega la tarea al state
         const proyectoActualizado = {...proyecto}
         proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
         setProyecto(proyectoActualizado)

         navigate({
            pathname: '/proyectos',
            search: `${proyectoActualizado._id}`
        })
    }

    const eliminarTareaProyecto = (tarea) => {
        //Actualiza el state del proyecto
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter( tareaState => tareaState._id !== tarea._id)

        setProyecto(proyectoActualizado)
    }

    const cambiarEstadoTarea = tarea => {
        const proyectoActualizado = {...proyecto}

        proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === tarea._id ? tarea : tareaState )

        setProyecto(proyectoActualizado)
    }

    const cerrarSesionProyectos = () => {
        setProyectos([])
        setProyecto({})
        setAlerta({})
    }

    return(
        <ProyectosContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                modalFormularioTarea,
                handleModalTarea,
                submitTarea,
                pasarDatosEditarTarea,
                tareaSeleccionada,
                setTareaSeleccionada,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                eliminarColaborador,
                completarTarea,
                buscador,
                handleBuscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                cambiarEstadoTarea,
                cerrarSesionProyectos
            }}
        >
            {children}
        </ProyectosContext.Provider>
    )
}

export {
    ProyectosProvider
}

export default ProyectosContext