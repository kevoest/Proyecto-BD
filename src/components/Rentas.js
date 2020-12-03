import React from 'react'
import {db} from '../firebase'
import {useState, useEffect} from 'react'
import "./Usuario.css"

export const Rentas = () => {
    const [rentas, setRentas] = useState([])
    const [modoEliminar, setModoEliminar] = useState(false)
  
    const getRentas = async () =>{
      const data = await db.collection('renta').get()
      const arrayRentas = data.docs.map(doc => ({id: doc.id, ...doc.data()}))
      setRentas(arrayRentas)
      console.log(rentas)
    }
  
      useEffect(()=>{
        getRentas()
     },[]) // eslint-disable-line react-hooks/exhaustive-deps
  
      const activarEliminar = (item) =>{
        setModoEliminar(!modoEliminar)
      }
  
      const eliminarRenta = async(id) =>{
        await db.collection('renta').doc(id).delete()
        activarEliminar()
        getRentas()
      }
    return (
        <div className = "divPadre">
          <p>Listado de rentas</p>
      <ul className = "list-group">
        {
        rentas.map(item => (
          <li className = "list-group-li" key = {item.id}>
            <ul className="list-group-ul"> Tipo de renta: {item.Tiporenta}</ul>
            <ul className="list-group-ul"> Id renta: {item.id}</ul>
            <ul className="list-group-ul"> Id cliente: {item.Clienteid}</ul>
            <ul className="list-group-ul"> Id articulo: {item.idobj}</ul>
            <ul className="list-group-ul"> Inicio de renta: {item.Iniciorenta}</ul>
            <ul className="list-group-ul"> Fin renta: {item.Finrenta}</ul>
            <ul className="list-group-ul"> Precio renta: {item.Preciorenta}</ul>
            {modoEliminar ?
            <h>
              <button className = "btnSip" onClick={() => eliminarRenta(item.id)}>Si</button>
              <button className = "btnNop" onClick={() => activarEliminar(item)}>No</button>
            </h> 
            : <button className = "btnEliminar" onClick={() => activarEliminar(item)}>Eliminar</button>}
            <p></p>
        </li>
        ))
        }
      </ul>
    </div>
    )
}
