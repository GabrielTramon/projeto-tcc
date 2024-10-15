import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "../pages/Login";
import { Venda } from "../pages/Gerente/Venda";
import { AdcCliente } from "../pages/Gerente/AdcCliente";
import { CrudCliente } from "../pages/Gerente/CrudCliente";
import { AdcProduto } from "../pages/Gerente/AdcProduto";
import { CrudProduto } from "../pages/Gerente/CrudProduto";
import { AdcVendedor } from "../pages/Gerente/AdcVendedor";
import { CrudVendedor } from "../pages/Gerente/CrudVendedor";
import { AdcAgenda } from "../pages/Gerente/AdcAgenda";
import { CrudAgenda } from "../pages/Gerente/CrudAgenda";
import { Faturamento } from "../pages/Gerente/Faturamento";
import AppProviderTheme from "../componentes/menu";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/painel" element={<AppProviderTheme/>}>
          <Route path="venda" element={<Venda />} />
          <Route path="adcCliente" element={<AdcCliente />} />
          <Route path="crudCliente" element={<CrudCliente />} />
          <Route path="adcProduto" element={<AdcProduto />} />
          <Route path="crudProduto" element={<CrudProduto />} />
          <Route path="adcVendedor" element={<AdcVendedor />} />
          <Route path="crudVendedor" element={<CrudVendedor />} />
          <Route path="adcAgenda" element={<AdcAgenda />} />
          <Route path="crudAgenda" element={<CrudAgenda />} />
          <Route path="faturamento" element={<Faturamento />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
