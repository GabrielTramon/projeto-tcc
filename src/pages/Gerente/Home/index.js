import { useNavigate } from "react-router-dom";

export function HomeGerente() {
  const navigate = useNavigate();

  function PageVenda() {
    navigate("/venda");
  }

  function PageAdcCliente() {
    navigate("/adcCliente");
  }

  function PageCrudCLiente() {
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
    <div className="page">
      <button className="button" onClick={PageVenda}>
        Venda ao consumidor
      </button>
      <button className="button" onClick={PageAdcCliente}>
        Adicionar cliente
      </button>
      <button className="button" onClick={PageCrudCLiente}>
        Visualizar Clientes
      </button>
      <button className="button" onClick={AdcProduto}>
        Adicionar Produto
      </button>
      <button className="button" onClick={CrudProduto}>
        Visualizar Produtos
      </button>
      <button className="button" onClick={AdcVendedor}>
        Adicionar Vendedor
      </button>
      <button className="button" onClick={CrudVendedor}>
        Visualizar Vendedores
      </button>
      <button className="button" onClick={AdcAgenda}>
        Adicionar Pet Banho e tosa
      </button>
      <button className="button" onClick={CrudAgenda}>
        Visualizar agenda
      </button>
      <button className="button" onClick={PageFaturamento}>
        Faturamento
      </button>
    </div>
  );
}
