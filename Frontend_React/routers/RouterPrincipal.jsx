import React from "react";
import { CompInicio } from "../src/components/CompInicio";
import { Login } from "../src/components/Login";
import { Register } from "../src/components/Register";
import { DashBoard } from "../src/components/DashBoard";
import { FormCoche } from "../src/components/FormCoche";
import { Empleados } from "../src/components/Empleados";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Aboutus } from "../src/components/Aboutus";
import { WhereAreWe } from "../src/components/WhereAreWe";
import { Perfil } from "../src/components/Perfil";
import { Confirmado } from "../src/components/Confirmado";
import { CocheDetails } from "../src/components/CocheDetails";
import { LoginAdmin } from "../src/components/LoginAdmin";
import { Facturas } from "../src/components/Facturas";
import { FacturaDetalle } from "../src/components/FacturaDetalle";
import { LoginMecanico } from "../src/components/LoginMecanico";
import { AdminPanel } from "../src/components/AdminPanel";
import { PanelMecanico } from "../src/components/PanelMecanico";
import { LeerUsers } from "../src/components/crudUsers/LeerUsers";
import { LeerCoches } from "../src/components/crudCoches/LeerCoches";
import { DetalleCoche } from "../src/components/crudCoches/DetalleCoche";
import { AddReparacionCoche } from "../src/components/crudCoches/AddReparacionCoche";
import { FormCita } from "../src/components/FormCita";
import { LeerCitas } from "../src/components/crudCitas/LeerCitas";
import { DetalleCita } from "../src/components/crudCitas/DetalleCita";

const RouterPrincipal = () => {
  return (
    <Routes>
      <Route path="/" element={<CompInicio />}></Route>
      <Route path="/aboutus" element={<Aboutus />}></Route>
      <Route path="/where" element={<WhereAreWe />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/confirmado" element={<Confirmado />} />
      <Route path="/home" element={<DashBoard />}></Route>
      <Route path="/home/addCoche" element={<FormCoche />}></Route>
      <Route path="/home/coche/details" element={<CocheDetails />}></Route>
      <Route path="/home/addcita" element={<FormCita />}></Route>
      <Route path="/home/perfil" element={<Perfil />}></Route>
      <Route path="/home/facturas" element={<Facturas/>}></Route>
      <Route path="/home/factura/:id/detalle" element={<FacturaDetalle/>}></Route>

      <Route path="/employees" element={<Empleados />}></Route>
      <Route path="/employees/admin" element={<LoginAdmin />}></Route>
      <Route path="/employees/admin/panel" element={<AdminPanel />}></Route>
      <Route path="/employees/mecanic" element={<LoginMecanico />}></Route>
      <Route
        path="/employees/mecanic/panel"
        element={<PanelMecanico />}
      ></Route>
      <Route path="/employees/crud/users" element={<LeerUsers />}></Route>
      <Route path="/employees/crud/coches" element={<LeerCoches />}></Route>
      <Route
        path="/employees/crud/coches/addreparacion"
        element={<AddReparacionCoche />}
      ></Route>
      <Route
        path="/employees/crud/coches/:id/detalle"
        element={<DetalleCoche />}
      ></Route>
      <Route path="/employees/crud/citas" element={<LeerCitas />}></Route>
      <Route
        path="/employees/crud/citas/:id/detalle"
        element={<DetalleCita />}
      ></Route>
    </Routes>
  );
};

export default RouterPrincipal;
