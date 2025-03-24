import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PrimerComponente from './components/PrimerComponente.jsx'
import { SegundoComponente } from './components/SegundoComponente.jsx'
import { TercerComponente } from './components/TercerComponente.jsx'
import { EvetosReact } from './components/EvetosReact.jsx'
import { CuartoComponente } from './components/CuartoComponente.jsx'
import { QuintoComponente } from './components/QuintoComponente.jsx'
import { SextoComponenteUseEffect } from './components/SextoComponenteUseEffect.jsx'
import { AjaxComponentStatic } from './components/AjaxComponentStatic.jsx'
import { AjaxComponentDinamic } from './components/AjaxComponentDinamic.jsx'

const ficha_medica = {
  altura: "180 cm",
  peso: "80kg",
  alergias: "ninguna"
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <AjaxComponentDinamic/>
    <AjaxComponentStatic/>
    <SextoComponenteUseEffect/>
    <PrimerComponente/>
    <SegundoComponente/>
    <TercerComponente nombre="Pablo" apellidos="Fernandez Garcia" ficha={ficha_medica}/>
    {/* <EvetosReact nombre="El tio la vara"/> */}
    <CuartoComponente />
    <QuintoComponente/>
  </StrictMode>,
)
