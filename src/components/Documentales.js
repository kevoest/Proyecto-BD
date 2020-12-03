import React from 'react'
import {db} from '../firebase'
import {useState, useEffect} from 'react'
import "./Usuario.css"

export const Documentales = () => {
    const [documental, setDocumental] = useState([])
    const [venta, setVenta] = useState([])
    const [usuario, setUsuario] = useState([])
    const [documentalNombre, setDocumentalNombre] = useState([])
    const [documentalDescripcion, setDocumentalDescripcion] = useState([])
    const [documentalPrecio, setDocumentalPrecio] = useState([])
    const [modoEdicion, setModoEdicion] = useState(false)
    const [modoEliminar, setModoEliminar] = useState(false)
    const [id, setId] = useState('')
    var f = new Date();
    var dia = f.getDate()
    var mes = f.getMonth()+1
    var messig = 1
    var año = f.getFullYear()
    var fecha = ""
    fecha.concat(dia, "/", mes, "/", año)

    const getDocumental = async () =>{
      const data = await db.collection('documentales').get()
      const arrayDocumentales = data.docs.map(doc => ({id: doc.id, ...doc.data()}))
      setDocumental(arrayDocumentales)
      console.log(documental)
    }

    const getVentas = async() =>{
        const data = await db.collection('venta').get()
        const arrayVentas = data.docs.map(doc => ({id: doc.id, ...doc.data()}))
        setVenta(arrayVentas)
        console.log(venta)
    }

    const getUsuarios = async() =>{
        const data = await db.collection('usuarios').get()
        const arrayUsuarios = data.docs.map(doc => ({id: doc.id, ...doc.data()}))
        setUsuario(arrayUsuarios)
        console.log(usuario)
    }
  
      useEffect(()=>{
        getDocumental()
        getVentas()
        getUsuarios()
     },[]) // eslint-disable-line react-hooks/exhaustive-deps
  
     const limpiarIns =() =>{
        setDocumentalNombre("")
        setDocumentalDescripcion("")
        setDocumentalPrecio("")
        setId("")
     }
  
     const agregarDocumental = async(e)=>{
        e.preventDefault()
        const firebaseLibros = await db.collection('documentales').add({
            DocumentalNombre: documentalNombre,
            DocumentalPrecio: documentalPrecio,
            DocumentalDescripcion: documentalDescripcion,
        })
        limpiarIns()
        getDocumental()
     }

     const agregarVenta = async(e, idL, idU, lPr)=>{
        e.preventDefault()
        const firebaseVentas = await db.collection('venta').add({
            VentaTipo: "Documental",
            ClienteId: idU,
            VentaPrecio: lPr,
            LibroId: idL,
        })
     }

     const agregarRenta = async(e, idL, idU, lPr)=>{
        e.preventDefault()
        const firebaseVentas = await db.collection('renta').add({
            Tiporenta: "Documental",
            Clienteid: idU,
            Preciorenta: lPr,
            idobj: idL,
            Iniciorenta: fecha.concat(dia, "/", mes, "/", año),
            Finrenta: fecha.concat(dia, "/", messig, "/", año)
        })
     }
  
      const activarEdicion = (item) =>{
        setModoEdicion(true)
        if(!modoEdicion){
            setDocumentalNombre(item.DocumentalNombre)
            setDocumentalDescripcion(item.DocumentalDescripcion)
            setDocumentalPrecio(item.DocumentalPrecio)
            setId(item.id)
        }else{
          setModoEdicion(false)
          limpiarIns()
        }
        
      }
  
      const activarEliminar = (item) =>{
        setModoEliminar(!modoEliminar)
      }
  
      const editarDocumental = async(e) =>{
        e.preventDefault()
        const firebaseLibros = await db.collection('documentales').doc(id).update({
            DocumentalNombre: documentalNombre,
            DocumentalPrecio: documentalPrecio,
            DocumentalDescripcion: documentalDescripcion,
        })
        setModoEdicion(false)
        limpiarIns()
        getDocumental() 
      }
  
      const eliminarDocumental = async(id) =>{
        await db.collection('documentales').doc(id).delete()
        activarEliminar()
        getDocumental()
      }

      const mostrarVenta = (item) =>{
        document.getElementById(item.id).style.display="block";
    }

    const esconderVenta = (item) =>{
      document.getElementById(item.id).style.display="none";
  }
    return (
        <div className = "divPadre">
      <h1>DOCUMENTALES</h1>
      <form className = "forBase" onSubmit = {modoEdicion ? editarDocumental : agregarDocumental}>
          <div className="divBase">
            <label>Nombre</label>
            <input type="text" className="form-control" value={documentalNombre} onChange={e => setDocumentalNombre(e.target.value)} required></input>
            <label>Precio</label>
            <input type="text" className="form-control" value={documentalPrecio} onChange={e => setDocumentalPrecio(e.target.value)} required></input>
            <label>Descripcion</label>
            <input type="text" className="form-control" value={documentalDescripcion} onChange={e => setDocumentalDescripcion(e.target.value)} required></input>
            <button type="submit" className="btnAcept">Aceptar</button>
          </div>
          
      </form>
      <ul className = "list-group ">{
        documental.map(item => (
          <li className = "list-group-li" key = {item.id}>
            <ul className="list-group-ul"> Nombre documental: {item.DocumentalNombre}</ul>
            <ul className="list-group-ul"> ID documental: {item.id}</ul>
            <ul className="list-group-ul"> Precio documental: {item.DocumentalPrecio}$</ul>
            <ul className="list-group-ul"> Descripcion documental: {item.DocumentalDescripcion}</ul>
            {modoEdicion ? <button className = "btnCanEdi" onClick={() => activarEdicion(item)}>Cancelar</button> : 
            <button className = "btnEdi" onClick={() => activarEdicion(item)}>Editar</button>}
            {modoEliminar ?
            <h>
              Seguro?
              <button className = "btnSi" onClick={() => eliminarDocumental(item.id)}>Si</button>
              <button className = "btnNo" onClick={() => activarEliminar(item)}>No</button>
            </h> 
            : <button className = "btnEli" onClick={() => activarEliminar(item)}>Eliminar</button>}
            <button className = "btnComRen" onClick={()=> mostrarVenta(item)}>Comprar/Rentar</button>
            <div className="divdesa" id={item.id} >
            <p>Que usuario quiere comprar/rentar este documental?</p>
            {
                usuario.map(itemU => (
                    <ul className = "list-group-ul">Nombre usuario: {itemU.UsuarioNombre}
                    <button className = "btnCom" onClick={e => {
                        agregarVenta(e, item.id, itemU.id, item.DocumentalPrecio) 
                        esconderVenta(item)}}>Comprar</button>
                    <button className = "btnRen" onClick={e => {
                        agregarRenta(e, item.id, itemU.id, (item.DocumentalPrecio)*.35) 
                        esconderVenta(item)}}>Rentar</button>
                    </ul>                    
                ))
            }
            <button className = "btnCerrar" onClick={()=> esconderVenta(item)}>Cerrar</button>
            </div>
            <p></p>
        </li>
        ))
        }
      </ul>
    </div>
    )
}
