import { Link } from "react-router-dom"

export const Navbar = () => {

  return (
    <section className={`flex justify-between items-center px-5 py-3  bg-background shadow-md`}>
    <nav className="w-full">
        <ul className="flex gap-6 font-poppins font-semibold text-text">
        <li className={`hover:bg-slate-50 transition-all duration-150 cursor-pointer p-1 rounded-lg`}>
            <Link to="/ventas">
                Ventas
            </Link>
        </li>
        <li className={`hover:bg-slate-50 transition-all duration-150 cursor-pointer p-1 rounded-lg`}>
           <Link to="/detalles_ventas">
           Detalles de Ventas
           </Link>  
        </li>
        <li className={`hover:bg-slate-50 transition-all duration-150 cursor-pointer p-1 rounded-lg`}>  
           <Link to="/clientes">
             Clientes
           </Link>    
        </li>
        <li className={`hover:bg-slate-50 transition-all duration-150 cursor-pointer p-1 rounded-lg`}> 
        <Link to="/productos">
        Productos
           </Link>  
               
        </li>
        
        </ul>
    </nav>
    </section>
  )
}
