import { useEffect, useRef, useState } from "react";
import { DownloadTableExcel } from "react-export-table-to-excel";

type Ventas = {
    id: number,
    folio: string,
    cliente: number,
    fecha_registro: string
}

type Cliente = {
    id: number,
    nombre: string,
    direccion: string,
    tipo_cliente: number,
    fecha_alta: string,
}


interface VentaFormData {
    folio: string;
    cliente: number;
}

export const Ventas = () => {

    const [data, setData] = useState<Ventas[]>([]);
    const [dataClientes, setDataClientes] = useState<Cliente[]>([]);
    const tableExcel = useRef(null)

    const [formData, setFormData] = useState<VentaFormData>({
        folio: '',
        cliente: 0
      });

    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await fetch('http://localhost:4000/ventas');
              if (!response.ok) {
                throw new Error('Error al obtener los datos');
              }
              const jsonData = await response.json();
              setData(jsonData);
            } catch (error) {
              console.error('Error:', error);
            }
          };

        const fetchDataClientes = async () => {
            try {
              const response = await fetch('http://localhost:4000/clientes');
              if (!response.ok) {
                throw new Error('Error al obtener los datos');
              }
              const jsonData = await response.json();
              setDataClientes(jsonData);
            } catch (error) {
              console.error('Error:', error);
            }
          };


          fetchData();
          fetchDataClientes();

    }, [data])

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: name === 'cliente' ? parseInt(value) : value // Convertir el valor a número solo para el campo 'cliente'
        });
      };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData)
        fetch('http://localhost:4000/ventas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
            folio: formData.folio,  
            cliente: formData.cliente,
        })})
        .then(response => response.json())
        
        setFormData({
            folio: '',
            cliente: 0
        });
    };

    const handleDelete = (id: number) => {
        fetch(`http://localhost:4000/ventas/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }})
        .then(response => response.json())
    }




    

  return (
    <div>
        <form onSubmit={handleSubmit} className="" >
            <div className="my-5">
            <label className="mr-3 w-auto">
                Folio:
            </label>
                <input
                className="w-auto border" 
                type="text" 
                name="folio" 
                value={formData.folio} 
                onChange={handleInputChange} 
                required 
                />
            </div>
            <div>
            <label className="mr-3 w-auto">
                Cliente:
            </label>
            <select
              name="cliente"
              value={formData.cliente}
              onChange={handleInputChange}
              required
              className="w-auto border" 
            >
                <option selected>Seleccione un cliente</option>
                { dataClientes && dataClientes.map( cliente => (
                    <option value={cliente.id} key={cliente.id}>{ cliente.nombre}</option>
                    )
                )}
            </select>
            </div>
            <button type="submit" className="mt-5 border-2 rounded-md px-3 hover:bg-slate-50 shadow-sm">Crear</button>
        </form>
        <table className="w-full mt-5 border-2" ref={tableExcel}>
            <tr className="border-2">
                <th>ID</th>
                <th>CLIENTE</th>
                <th>FOLIO</th>
                <th>FECHA REGISTRO</th>
                <th></th>
            </tr>
            
                { data && data.map( ({id, cliente, folio, fecha_registro}) => (
                    <tr key={id}>
                        <td >{id}</td>
                        <td >{cliente}</td>
                        <td >{folio}</td>
                        <td >{fecha_registro}</td>
                        <td className="font-bold text-red-700"><button onClick={() => handleDelete(id)}>X</button></td>
                    
                    </tr>
                ))}
            
        </table >

    </div>
  )
}