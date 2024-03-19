
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Ventas } from './assets/components/Ventas'
import { Navbar } from './assets/components/Navbar'
import { DetallesVentas } from './assets/components/DetallesVentas'
import { Clientes } from './assets/components/Clientes'
import { Productos } from './assets/components/Productos'

function App() {


  return (
    <>
    <Navbar />
     <Routes>
          <Route path="/" element={<></>} />
          <Route path="/ventas" element={<Ventas/>} />
          <Route path="/detalles_ventas" element={<DetallesVentas/>} />
          <Route path="/clientes" element={<Clientes/>} />
          <Route path="/productos" element={<Productos/>} />
      </Routes>

      
    </>
  )
}

export default App
