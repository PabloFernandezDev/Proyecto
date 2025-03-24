import { Header } from './components/Header'
import { Carrousel } from './components/Carrousel'
import { Bienvenida } from './components/Bienvenida'
import { Footer } from './components/Footer'
import { BotonesLoginRegister } from './components/BotonesLoginRegister';
import { Newsletter } from './components/Newsletter';
import { Login } from './components/Login';

function App() {

  return (
    <>
      <Header/>
      <Carrousel/>
      <Bienvenida/>
      <Login/>
      <div className='containerComponents'>
        <Newsletter/>
        <BotonesLoginRegister/>
      </div>
        <Footer/>
    </>
  )
}

export default App
