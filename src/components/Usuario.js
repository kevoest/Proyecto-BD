import React from 'react'
import {db} from '../firebase'
import {useState, useEffect} from 'react'
import "./Usuario.css"

const Usuario = () => {
    const [usuarios, setUsuarios] = useState([])
    const [rentas, setRentas] = useState([])
    const [ventas, setVentas] = useState([])
    const [usuarioId, setUsuarioId] = useState([])
    const [membresia, setMembresia] = useState([])
    const [nombres, setNombres] = useState([])
    const [modoEdicion, setModoEdicion] = useState(false)
    const [modoEliminar, setModoEliminar] = useState(false)
    const [id, setId] = useState('')
    const [modoRenta, setModoRenta] = useState(false)
  
    const getUsuarios = async () =>{
      const data = await db.collection('usuarios').get()
      const arrayUsuarios = data.docs.map(doc => ({id: doc.id, ...doc.data()}))
      setUsuarios(arrayUsuarios)
      console.log(usuarios)
    }

    const getRenta = async () =>{
        const data = await db.collection('renta').get()
        const arrayRentas = data.docs.map(doc => ({id: doc.id, ...doc.data()}))
        setRentas(arrayRentas)
        console.log(rentas)
    }

    const getVenta = async () =>{
      const data = await db.collection('venta').get()
      const arrayVentas = data.docs.map(doc => ({id: doc.id, ...doc.data()}))
      setVentas(arrayVentas)
      console.log(ventas)
  }
  
      useEffect(()=>{
        getUsuarios()
        getRenta()
        getVenta()
     },[]) // eslint-disable-line react-hooks/exhaustive-deps
  
     const limpiarIns =() =>{
        setUsuarioId("")
        setMembresia("")
        setNombres("")
        setId("")
     }
  
     const agregarUsuario = async(e)=>{
        e.preventDefault()
        const firebaseUsuarios = await db.collection('usuarios').add({
          UsuarioId: id,
          UsuarioMembresia: membresia,
          UsuarioNombre: nombres
        })
        limpiarIns()
        getUsuarios()
     }
  
      const activarEdicion = (item) =>{
        setModoEdicion(true)
        if(!modoEdicion){
            setUsuarioId(item.UsuarioId)
            setMembresia(item.UsuarioMembresia)
            setNombres(item.UsuarioNombre)
            setId(item.id)
        }else{
          setModoEdicion(false)
          limpiarIns()
        }
        
      }
  
      const activarEliminar = (item) =>{
        setModoEliminar(!modoEliminar)
      }

      const activarRenta = (item) =>{
        setModoRenta(!modoRenta)
      }
  
      const editarUsuario = async(e) =>{
        e.preventDefault()
        const firebaseUsuarios = await db.collection('usuarios').doc(id).update({
            UsuarioId: usuarioId,
            UsuarioMembresia: membresia,
            UsuarioNombre: nombres
        })
        setModoEdicion(false)
        limpiarIns()
        getUsuarios() 
      }
  
      const eliminarUsuarios = async(id) =>{
        await db.collection('usuarios').doc(id).delete()
        activarEliminar()
        getUsuarios()
      }
    return (
        <div className = "divPadre">
          <form className = "forBase" onSubmit = {modoEdicion ? editarUsuario : agregarUsuario}>
              <div className="divBase">
                <label>Nombre</label>
                <input type="text" className="form-control" value={nombres} onChange={e => setNombres(e.target.value)} required></input>
                <label>Membresia</label>
                <input type="text" className="form-control" value={membresia} onChange={e => setMembresia(e.target.value)} required></input>
              </div>
                <button type="submit" className="btnAce">Aceptar</button>
          </form>
          <ul className = "list-group">
            {
            usuarios.map(usuarios => (
                <li className = "list-group-li" key = {usuarios.id}>
                <ul className="list-group-ul" > Nombre: {usuarios.UsuarioNombre}</ul>
                <ul className="list-group-ul" > ID: {usuarios.id}</ul>
                <ul className="list-group-ul" > Membresia: {usuarios.UsuarioMembresia}</ul>
                {modoEdicion ? <button className = "btnCanEdi" onClick={() => activarEdicion(usuarios)}>Cancelar</button> : 
                <button className = "btnEdi" onClick={() => activarEdicion(usuarios)}>Editar</button>}
                {modoEliminar ?
                <h>
                  <button className = "btnSi" onClick={() => eliminarUsuarios(usuarios.id)}>Si</button>
                  <button className = "btnNo" onClick={() => activarEliminar(usuarios)}>No</button>
                </h> 
                : <button className = "btnEli" onClick={() => activarEliminar(usuarios)}>Eliminar</button>}
                <p>Rentas y compras del usuario</p>
                {
                rentas.map(rentas =>(
                    <lu key = {rentas.id}>
                        {usuarios.id === rentas.Clienteid &&(
                            <ul className="list-group-ul"> Id renta: {rentas.id}</ul>
                        )
                        }
                    </lu>
                    ))
            }
            {
                ventas.map(ventas =>(
                    <lu key = {ventas.id}>
                        {usuarios.id === ventas.ClienteId &&(
                            <ul className="list-group-ul"> Id compra: {ventas.id}</ul>
                        )
                        }
                    </lu>
                    ))
            }
            <p></p>
            </li>
            ))
            }
          </ul>
          
        </div>
    )
}

export default Usuario
