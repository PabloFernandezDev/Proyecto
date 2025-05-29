import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CompInicio } from "../src/components/Diseño/CompInicio";
import { Aboutus } from "../src/components/Diseño/Aboutus";
import { WhereAreWe } from "../src/components/Diseño/WhereAreWe";
import { Confirmado } from "../src/components/Diseño/Confirmado";
import { Login } from "../src/components/User/Login";
import { Register } from "../src/components/User/Register";
import { DashBoard } from "../src/components/User/DashBoard";
import { Perfil } from "../src/components/User/Perfil";
import { FormCoche } from "../src/components/Coche/FormCoche";
import { CocheDetails } from "../src/components/Coche/CocheDetails";
import { FormCita } from "../src/components/crudCitas/FormCita";
import { Facturas } from "../src/components/crudFacturas/Facturas";
import { FacturaDetalle } from "../src/components/crudFacturas/FacturaDetalle";
import { Empleados } from "../src/components/Empleados";
import { LoginAdmin } from "../src/components/Admin/LoginAdmin";
import { AdminPanel } from "../src/components/Admin/AdminPanel";
import { LeerUsers } from "../src/components/crudUsers/LeerUsers";
import { LeerMecanicos } from "../src/components/crudMecanicos/LeerMecanicos";
import { AddMecanico } from "../src/components/crudMecanicos/AddMecanico";
import { LeerAdmins } from "../src/components/crudAdmins/LeerAdmins";
import { AddAdmin } from "../src/components/crudAdmins/AddAdmin";
import { LeerCoches } from "../src/components/crudCoches/LeerCoches";
import { LeerCochesSuperAdmin } from "../src/components/crudCoches/LeerCochesSuperAdmin";
import { AddReparacionCoche } from "../src/components/crudCoches/AddReparacionCoche";
import { DetalleCoche } from "../src/components/crudCoches/DetalleCoche";
import { LeerCitas } from "../src/components/crudCitas/LeerCitas";
import { LeerCitasSuperAdmin } from "../src/components/crudCitas/LeerCitasSuperAdmin";
import { DetalleCita } from "../src/components/crudCitas/DetalleCita";
import { LeerFacturas } from "../src/components/crudFacturas/LeerFacturas";
import { AddPresupuesto } from "../src/components/crudCitas/AddPresupuesto";


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
      <Route path="/home/addCoche" element={<FormCoche/>}></Route>
      <Route path="/home/coche/details" element={<CocheDetails />}></Route>
      <Route path="/home/addcita" element={<FormCita />}></Route>
      <Route path="/home/perfil" element={<Perfil />}></Route>
      <Route path="/home/facturas" element={<Facturas />}></Route>
      <Route path="/home/factura/:id/detalle" element={<FacturaDetalle />}></Route>

      <Route path="/employees" element={<Empleados/>}></Route>
      <Route path="/employees/admin" element={<LoginAdmin />}></Route>
      <Route path="/employees/admin/panel" element={<AdminPanel />}></Route>

      <Route path="/employees/crud/users" element={<LeerUsers />}></Route>
      
      <Route path="/employees/crud/mecanicos" element={<LeerMecanicos />}></Route>
      <Route path="/employees/crud/mecanicos/addMecanico" element={<AddMecanico />}></Route>

      <Route path="/employees/crud/admins" element={<LeerAdmins />}></Route>
      <Route path="/employees/crud/admins/addAdmin" element={<AddAdmin />}></Route>


      <Route path="/employees/crud/reparaciones" element={<LeerCoches />}></Route>
      <Route path="/employees/crud/coches" element={<LeerCochesSuperAdmin />}></Route>
      <Route path="/employees/crud/coches/addreparacion/:citaId" element={<AddReparacionCoche />} ></Route>
      <Route path="/employees/crud/coches/:id/detalle" element={<DetalleCoche />} ></Route>

      <Route path="/employees/crud/citas" element={<LeerCitas />}></Route>
      <Route path="/employees/crud/citas/all" element={<LeerCitasSuperAdmin />}></Route>
      <Route path="/employees/crud/citas/:id/detalle" element={<DetalleCita />} ></Route>
      <Route path="/employees/presupuesto/add/:usuarioId" element={<AddPresupuesto />} ></Route>

      <Route path="/employees/crud/facturas" element={<LeerFacturas />}></Route>
      <Route path="/employees/crud/facturas/:id/detalle" element={<FacturaDetalle />}></Route>
    </Routes>
  );
};

export default RouterPrincipal;
