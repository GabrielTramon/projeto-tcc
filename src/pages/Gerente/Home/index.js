import { useNavigate } from "react-router-dom";
import style from "../Home/styles.module.css";
import logo from "../../../assets/logo.png";
import Menu from "../../../componentes/menu"; // Importa o Menu corretamente.

export function HomeGerente() {
  const navigate = useNavigate();

  function PageVenda() {
    navigate("/venda");
  }

  function PageAdcCliente() {
    navigate("/adcCliente");
  }

  function PageCrudCliente() { // Corrigido o nome da função
    navigate("/crudCliente");
  }

  function AdcProduto() {
    navigate("/adcProduto");
  }

  function CrudProduto() {
    navigate("/crudProduto");
  }

  function AdcVendedor() {
    navigate("/adcVendedor");
  }

  function CrudVendedor() {
    navigate("/crudVendedor");
  }

  function AdcAgenda() {
    navigate("/adcAgenda");
  }

  function CrudAgenda() {
    navigate("/crudAgenda");
  }

  function PageFaturamento() {
    navigate("/faturamento");
  }

  return (
    <div className={style.page}>
      <Menu />
      <header className={style.header}>
        <img src={logo} alt="Logo" className={style.logo} />
        <div className={style.headerContent}>
          <span className={style.title}>Seja Bem-Vindo</span>
        </div>
      </header>
      <div className={style.menu}>
        <div className={style.buttonsContainer}>
          <button className={style.button} onClick={PageVenda}>
            Venda ao consumidor
          </button>
          <button className={style.button} onClick={PageAdcCliente}>
            Adicionar cliente
          </button>
          <button className={style.button} onClick={PageCrudCliente}> {/* Corrigido o nome */}
            Visualizar Clientes
          </button>
          <button className={style.button} onClick={AdcProduto}>
            Adicionar Produto
          </button>
          <button className={style.button} onClick={CrudProduto}>
            Visualizar Produtos
          </button>
          <button className={style.button} onClick={AdcVendedor}>
            Adicionar Vendedor
          </button>
          <button className={style.button} onClick={CrudVendedor}>
            Visualizar Vendedores
          </button>
          <button className={style.button} onClick={AdcAgenda}>
            Adicionar Pet Banho e tosa
          </button>
          <button className={style.button} onClick={CrudAgenda}>
            Visualizar agenda
          </button>
          <button className={style.button} onClick={PageFaturamento}>
            Faturamento
          </button>
        </div>
      </div>
    </div>
  );
}
