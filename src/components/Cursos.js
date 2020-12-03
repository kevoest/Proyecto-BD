import React from 'react'
import {db} from '../firebase'
import {useState, useEffect} from 'react'
import "./Usuario.css"

export const Cursos = () => {
    const [cursos, setCursos] = useState([])
    const [venta, setVenta] = useState([])
    const [usuario, setUsuario] = useState([])
    const [cursoNombre, setCursoNombre] = useState([])
    const [cursoPrecio, setCursoPrecio] = useState([])
    const [cursoDescripcion, setCursoDescripcion] = useState([])
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
  
    const getCursos = async () =>{
      const data = await db.collection('cursos').get()
      const arrayCursos = data.docs.map(doc => ({id: doc.id, ...doc.data()}))
      setCursos(arrayCursos)
      console.log(cursos)
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
        getCursos()
        getVentas()
        getUsuarios()
     },[]) // eslint-disable-line react-hooks/exhaustive-deps
  
     const limpiarIns =() =>{
        setCursoNombre("")
        setCursoPrecio("")
        setCursoDescripcion("")
        setId("")
     }
  
     const agregarCursos = async(e)=>{
        e.preventDefault()
        const firebaseLibros = await db.collection('cursos').add({
            CursoNombre: cursoNombre,
            PrecioCurso: cursoPrecio,
            CursoDescripcion: cursoDescripcion
        })
        limpiarIns()
        getCursos()
     }

     const agregarVenta = async(e, idL, idU, lPr)=>{
        e.preventDefault()
        const firebaseVentas = await db.collection('venta').add({
            VentaTipo: "Curso",
            ClienteId: idU,
            VentaPrecio: lPr,
            LibroId: idL,
        })
     }

     const agregarRenta = async(e, idL, idU, lPr)=>{
        e.preventDefault()
        const firebaseVentas = await db.collection('renta').add({
            Tiporenta: "Curso",
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
            setCursoNombre(item.CursoNombre)
            setCursoPrecio(item.PrecioCurso)
            setCursoDescripcion(item.CursoDescripcion)
            setId(item.id)
        }else{
          setModoEdicion(false)
          limpiarIns()
        }
        
      }
  
      const activarEliminar = (item) =>{
        setModoEliminar(!modoEliminar)
      }
  
      const editarCursos = async(e) =>{
        e.preventDefault()
        const firebaseLibros = await db.collection('cursos').doc(id).update({
            CursoNombre: cursoNombre,
            PrecioCurso: cursoPrecio,
            CursoDescripcion: cursoDescripcion
        })
        setModoEdicion(false)
        limpiarIns()
        getCursos() 
      }
  
      const eliminarCursos = async(id) =>{
        await db.collection('cursos').doc(id).delete()
        activarEliminar()
        getCursos()
      }

      const mostrarVenta = (item) =>{
        document.getElementById(item.id).style.display="block";
    }

    const esconderVenta = (item) =>{
      document.getElementById(item.id).style.display="none";
  }
    return (
        <div className = "divPadre">
      <h1>CURSOS</h1>
      <form className = "forBase" onSubmit = {modoEdicion ? editarCursos : agregarCursos}>
          <div className="divBase">
            <label>Nombre Curso</label>
            <input type="text" value={cursoNombre} onChange={e => setCursoNombre(e.target.value)} required></input>
            <label>Precio Curso</label>
            <input type="text" value={cursoPrecio} onChange={e => setCursoPrecio(e.target.value)} required></input>
            <label>Descripcion Curso</label>
            <input type="text" value={cursoDescripcion} onChange={e => setCursoDescripcion(e.target.value)} required></input>
            <button type="submit" className="btnAcept">Aceptar</button>
          </div>
          
      </form>
      <ul className = "list-group">{
        cursos.map(item => (
            <li className="list-group-li" key = {item.id}>
            <ul className="list-group-ul"> Nombre Curso: {item.CursoNombre}</ul>
            <ul className="list-group-ul"> ID Curso: {item.id}</ul>
            <ul className="list-group-ul"> Precio Curso: {item.PrecioCurso}$</ul>
            <ul className="list-group-ul"> Descripcion Curso: {item.CursoDescripcion}</ul>
            {modoEdicion ? <button className = "btnCanEdi" onClick={() => activarEdicion(item)}>Cancelar</button> : 
            <button className = "btnEdi" onClick={() => activarEdicion(item)}>Editar</button>}
            {modoEliminar ?
            <h>
              Seguro?
              <button className = "btnSi" onClick={() => eliminarCursos(item.id)}>Si</button>
              <button className = "btnNo" onClick={() => activarEliminar(item)}>No</button>
            </h> 
            : <button className = "btnEli" onClick={() => activarEliminar(item)}>Eliminar</button>}
            <button className = "btnComRen" onClick={()=> mostrarVenta(item)}>Comprar/Rentar</button>
            <div className="divdesa" id={item.id} >
            <p>Que usuario quiere comprar/rentar este curso?</p>
            {
                usuario.map(itemU => (
                    <ul className = "list-group-ul" >Nombre usuario: {itemU.UsuarioNombre}
                    <button className = "btnCom" onClick={e => {
                        agregarVenta(e, item.id, itemU.id, item.PrecioCurso) 
                        esconderVenta(item)}}>Comprar</button>
                    <button className = "btnRen" onClick={e => {
                        agregarRenta(e, item.id, itemU.id, (item.PrecioCurso)*.35) 
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
