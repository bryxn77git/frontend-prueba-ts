import { useEffect, useState } from "react";

type Producto = {
    id: number,
    clave: string,
    descripcion: string,
}

interface ProductoFormData {
    clave: string;
    descripcion: string;
}

export const Productos = () => {
    const [data, setData] = useState<Producto[]>([]);

    const [formData, setFormData] = useState<ProductoFormData>({
        clave: '',
        descripcion: ''
      });

    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await fetch('http://localhost:4000/productos');
              if (!response.ok) {
                throw new Error('Error al obtener los datos');
              }
              const jsonData = await response.json();
              setData(jsonData);
            } catch (error) {
              console.error('Error:', error);
            }
          };
      
          fetchData();
    }, [data])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData)
        fetch('http://localhost:4000/productos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
            clave: formData.clave,  
            descripcion: formData.descripcion,
        })})
        .then(response => response.json())
        
        setFormData({
            clave: '',
            descripcion: ''
        });
    };

    const handleDelete = (id: number) => {
        fetch(`http://localhost:4000/productos/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }})
        .then(response => response.json())
    }
    
    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="" >
                <div className="my-5">
                <label className="mr-3 w-auto">
                    Clave:
                </label>
                    <input
                    className="w-auto border" 
                    type="text" 
                    name="clave" 
                    value={formData.clave} 
                    onChange={handleInputChange} 
                    required 
                    />
                </div>
                <div className="my-5">
                <label className="mr-3 w-auto">
                    Descripción:
                </label>
                    <input
                    className="w-auto border" 
                    type="text" 
                    name="descripcion" 
                    value={formData.descripcion} 
                    onChange={handleInputChange} 
                    required 
                    />
                </div>
                
                <button type="submit" className="mt-5 border-2 rounded-md px-3 hover:bg-slate-50 shadow-sm">Crear</button>
            </form>

            <table className="w-full my-5 border-2">
                <tr className="border-2">
                    <th>ID</th>
                    <th>CLAVE</th>
                    <th>DESCRIPCION</th>
                    <th></th>
                </tr>
                
                    { data && data.map( ({id, clave, descripcion }) => (
                        <tr key={id}>
                            <td >{id}</td>
                            <td >{clave}</td>
                            <td >{descripcion}</td>   
                            <td className="font-bold text-red-700"><button onClick={() => handleDelete(id)}>X</button></td>                     
                        </tr>
                    ))}
                
            </table >
        </div>
      )
}
