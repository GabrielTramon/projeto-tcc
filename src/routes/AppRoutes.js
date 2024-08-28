import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "../pages/Login";
import { HomeGerente } from "../pages/Gerente/Home";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/homeGerente" element={<HomeGerente />} />
      </Routes>
    </BrowserRouter>
  );
}
