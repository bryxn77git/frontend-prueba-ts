import { useEffect, useState } from "react"

type Cliente = {
    id: number,
    nombre: string,
    direccion: string,
    tipo_cliente: number,
    fecha_alta: string,
}

type TipoCliente = {
    id: number,
    clave: string,
    descripcion: string,
}


interface ClienteFormData {
    nombre: string;
    direccion: string;
    tipo_cliente: number;
  }


export const Clientes = () => {

    const [data, setData] = useState<Cliente[]>([]);
    const [dataTipoCliente, setDataTipoCliente] = useState<TipoCliente[]>([]);

    const [formData, setFormData] = useState<ClienteFormData>({
        nombre: '',
        direccion: '',
        tipo_cliente: 0
      });

    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await fetch('http://localhost:4000/clientes');
              if (!response.ok) {
                throw new Error('Error al obtener los datos');
              }
              const jsonData = await response.json();
              setData(jsonData);
            } catch (error) {
              console.error('Error:', error);
            }
          };

          const fetchDataTipoCliente = async () => {
            try {
              const response = await fetch('http://localhost:4000/tipo_cliente');
              if (!response.ok) {
                throw new Error('Error al obtener los datos');
              }
              const jsonData = await response.json();
              setDataTipoCliente(jsonData);
            } catch (error) {
              console.error('Error:', error);
            }
          };
      
          fetchData();
          fetchDataTipoCliente();
    }, [data]);

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: name === 'tipo_cliente' ? parseInt(value) : value // Convertir el valor a número solo para el campo 'cliente'
        });
      };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData)
        fetch('http://localhost:4000/clientes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
            nombre: formData.nombre,
            direccion: formData.direccion,
            tipo_cliente: formData.tipo_cliente
        })})
        .then(response => response.json())
        
        setFormData({
            nombre: '',
            direccion: '',
            tipo_cliente: 0
        });
    };

    const handleDelete = (id: number) => {
        console.log(id)
        fetch(`http://localhost:4000/clientes/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }})
        .then(response => response.json())
    }
    

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="" >
                <div className="my-5">
                <label className="mr-3 w-auto">
                    Nombre:
                </label>
                    <input
                    className="w-auto border" 
                    type="text" 
                    name="nombre" 
                    value={formData.nombre} 
                    onChange={handleInputChange} 
                    required 
                    />
                </div>
                <div className="my-5">
                <label className="mr-3 w-auto">
                    Dirección:
                </label>
                    <input
                    className="w-auto border" 
                    type="text" 
                    name="direccion" 
                    value={formData.direccion} 
                    onChange={handleInputChange} 
                    required 
                    />
                </div>
                <div>
                <label className="mr-3 w-auto">
                    Tipo de cliente:
                </label>
                <select
                name="tipo_cliente"
                value={formData.tipo_cliente}
                onChange={handleInputChange}
                required
                className="w-auto border" 
                >
                    <option selected>Seleccione un tipo de cliente</option>
                    { dataTipoCliente && dataTipoCliente.map( tipo_cliente => (
                        <option value={tipo_cliente.id} key={tipo_cliente.id}>{ tipo_cliente.clave}</option>
                        )
                    )}
                </select>
                </div>
                <button type="submit" className="mt-5 border-2 rounded-md px-3 hover:bg-slate-50 shadow-sm">Crear</button>
            </form>

            <table className="w-full my-5 border-2">
                <tr className="border-2">
                    <th>ID</th>
                    <th>NOMBRE</th>
                    <th>DIRECCION</th>
                    <th>TIPO DE CLIENTE</th>
                    <th>FECHA DE ALTA</th>
                    <th></th>
                </tr>
                
                    { data && data.map( ({id, nombre, direccion, tipo_cliente, fecha_alta }) => (
                        <tr key={id}>
                            <td >{id}</td>
                            <td>{nombre}</td>
                            <td >{direccion}</td>
                            <td >{tipo_cliente}</td>
                            <td >{fecha_alta}</td>
                            <td className="font-bold text-red-700"><button onClick={() => handleDelete(id)}>X</button></td>
                        
                        </tr>
                    ))}
                
            </table >
        </div>
      )
}
