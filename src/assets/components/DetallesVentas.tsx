import { useEffect, useRef, useState } from "react";
import { DownloadTableExcel } from "react-export-table-to-excel";

type DetalleVenta = {
    cliente: string,
    folio: string,
    fecha: string,
    producto: string,
    cantidad: number
}

type Ventas = {
    id: number,
    folio: string,
    cliente: number,
    fecha_registro: string
}

type Producto = {
    id: number,
    clave: string,
    descripcion: string,
}

interface VentaFormData {
    venta: number;
    producto: number;
    cantidad: number
}

export const DetallesVentas = () => {
    const [data, setData] = useState<DetalleVenta[]>([]);
    const [dataVenta, setDataVenta] = useState<Ventas[]>([]);
    const [dataProducto, setDataProducto] = useState<Producto[]>([]);

    const [formData, setFormData] = useState<VentaFormData>({
        venta: 0,
        producto: 0,
        cantidad: 0,
      });

    const tableExcel = useRef(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await fetch('http://localhost:4000/detalle_ventas_resumen');
              if (!response.ok) {
                throw new Error('Error al obtener los datos');
              }
              const jsonData = await response.json();
              setData(jsonData);
            } catch (error) {
              console.error('Error:', error);
            }
          };

          const fetchDataVentas = async () => {
            try {
              const response = await fetch('http://localhost:4000/ventas');
              if (!response.ok) {
                throw new Error('Error al obtener los datos');
              }
              const jsonData = await response.json();
              setDataVenta(jsonData);
            } catch (error) {
              console.error('Error:', error);
            }
          };

          const fetchDataProductos = async () => {
            try {
              const response = await fetch('http://localhost:4000/productos');
              if (!response.ok) {
                throw new Error('Error al obtener los datos');
              }
              const jsonData = await response.json();
              setDataProducto(jsonData);
            } catch (error) {
              console.error('Error:', error);
            }
          };
      
          fetchData();
          fetchDataVentas()
          fetchDataProductos() 
    }, [data])

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: name === 'venta' || 'producto' ? parseInt(value) : value
        });
      };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData)
        fetch('http://localhost:4000/detalle_ventas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
            venta: formData.venta,  
            producto: formData.producto,
            cantidad: formData.cantidad,
        })})
        .then(response => response.json())
        
        setFormData({
            venta: 0,
            producto: 0,
            cantidad: 0,
        });
    };

    const changeFolio = (folio: string) => {
        const copyFolio = folio.split('-'); 
        const newFolio = parseInt(copyFolio[1], 10) + 10; 
        copyFolio[1] = newFolio.toString(); 
        console.log(copyFolio.join('-')) 
    }

    
    return (
        <div className="w-full">

        <form onSubmit={handleSubmit} className="" >
            <div className="my-5">
                <label className="mr-3 w-auto">
                    Venta:
                </label>
                    <select
                    name="venta"
                    value={formData.venta}
                    onChange={handleInputChange}
                    required
                    className="w-auto border" 
                    >
                        <option selected>Seleccione una venta</option>
                        { dataVenta && dataVenta.map( venta => (
                            <option value={venta.id} key={venta.id}>{ venta.folio }</option>
                            )
                        )}
                    </select>
                </div>
            <div className="my-5">
                <label className="mr-3 w-auto">
                    Producto:
                </label>
                    <select
                    name="producto"
                    value={formData.producto}
                    onChange={handleInputChange}
                    required
                    className="w-auto border" 
                    >
                        <option selected>Seleccione un producto</option>
                        { dataProducto && dataProducto.map( producto => (
                            <option value={producto.id} key={producto.id}>{ producto.clave }</option>
                            )
                        )}
                    </select>
                </div>
                <div className="my-5">
                    <label className="mr-3 w-auto">
                        Cantidad:
                    </label>
                    <input
                    className="w-auto border" 
                    type="number" 
                    name="cantidad" 
                    value={formData.cantidad} 
                    onChange={handleInputChange} 
                    required 
                    />
                </div>
                    
                <button type="submit" className="mt-5 border-2 rounded-md px-3 hover:bg-slate-50 shadow-sm">Crear</button>
            </form>
           
            <table className="w-full mt-5 border-2" ref={tableExcel}>
                <tr className="border-2">
                    <th>CLIENTE</th>
                    <th>FOLIO</th>
                    <th>FECHA</th>
                    <th>PRODUCTO</th>
                    <th>CANTIDAD</th>
                </tr>
                
                    { data && data.map( ({cliente, folio, fecha, producto, cantidad }, index) => (
                        <tr key={index}>
                            <td >{cliente}</td>
                            <td onClick={() => changeFolio(folio)}>{folio}</td>
                            <td>{fecha}</td>                        
                            <td >{producto}</td>                        
                            <td >{cantidad}</td>                        
                        </tr>
                    ))}
                
            </table >

            <DownloadTableExcel
                filename="Tbla de ventas"
                sheet="users"
                currentTableRef={tableExcel.current}
            >
                <button className="mt-5 border-2 rounded-md px-3 hover:bg-slate-50 shadow-sm">Excel</button>

            </DownloadTableExcel>
        </div>
      )
}
