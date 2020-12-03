import React from 'react'
import {db} from '../firebase'
import {useState, useEffect} from 'react'
import "./Usuario.css"

export const Ventas = () => {
    const [ventas, setVentas] = useState([])
    const [modoEliminar, setModoEliminar] = useState(false)
  
    const getVentas = async () =>{
      const data = await db.collection('venta').get()
      const arrayVentas = data.docs.map(doc => ({id: doc.id, ...doc.data()}))
      setVentas(arrayVentas)
      console.log(ventas)
    }
  
      useEffect(()=>{
        getVentas()
     },[]) // eslint-disable-line react-hooks/exhaustive-deps

      const activarEliminar = (item) =>{
        setModoEliminar(!modoEliminar)
      }

      const eliminarLibro = async(id) =>{
        await db.collection('venta').doc(id).delete()
        activarEliminar()
        getVentas()
      }
    return (
        <div className = "divPadre">
                   <p>Listado de ventas</p>
      <ul className = "list-group">
        {
        ventas.map(item => (
          <li className = "list-group-li" key = {item.id}>
            <ul className="list-group-ul"> Tipo de venta: {item.VentaTipo}</ul>
            <ul className="list-group-ul"> Id venta: {item.id}</ul>
            <ul className="list-group-ul"> Id Libro: {item.LibroId}</ul>
            <ul className="list-group-ul"> Id Cliente: {item.ClienteId}</ul>
            <ul className="list-group-ul"> Costo: {item.VentaPrecio}</ul>
            {modoEliminar ?
            <h>
              <button className = "btnSip" onClick={() => eliminarLibro(item.id)}>Si</button>
              <button className = "btnNop" onClick={() => activarEliminar(item)}>No</button>
            </h> 
            : <button className = "btnEliminar" onClick={() => activarEliminar(item)}>Eliminar</button>}
            
        </li>
        ))
        }
      </ul>
    </div>
    )
}
