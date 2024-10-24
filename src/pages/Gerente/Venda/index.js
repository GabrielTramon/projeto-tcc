import React, { useState, useEffect } from "react";
import { db } from "../../../services/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Autocomplete, TextField } from "@mui/material";
import BarcodeReader from "react-barcode-reader";
import style from "../Venda/styles.module.css";

function Venda() {
  const [produtoID, setProdutoID] = useState("");
  const [UsuariosID, setUsuariosID] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [vendedorID, setVendedorID] = useState("");
  const [valor, setvalor] = useState(0);
  const [produtos, setProdutos] = useState([]);
  const [Usuarios, setUsuarios] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidadeDisponivel, setQuantidadeDisponivel] = useState(0);
  const [itensVenda, setItensVenda] = useState([]); // Lista de itens

  useEffect(() => {
    const fetchData = async () => {
      try {
        const produtosRef = collection(db, "Produtos");
        const produtosSnap = await getDocs(produtosRef);
        const produtosList = produtosSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProdutos(produtosList);

        const UsuariosRef = collection(db, "Usuarios");
        const UsuariosSnap = await getDocs(UsuariosRef);
        const UsuariosList = UsuariosSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsuarios(UsuariosList);

        const vendedoresRef = collection(db, "Vendedores");
        const vendedoresSnap = await getDocs(vendedoresRef);
        const vendedoresList = vendedoresSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVendedores(vendedoresList);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (produtoID) {
      const selectedProduct = produtos.find(
        (produto) => produto.id === produtoID
      );
      if (selectedProduct) {
        setProdutoSelecionado(selectedProduct);
        setQuantidadeDisponivel(selectedProduct.quantidade || 0);
        setvalor(selectedProduct.valor * quantidade);
      }
    }
  }, [produtoID, quantidade, produtos]);

  useEffect(() => {
    if (produtoSelecionado) {
      setvalor(produtoSelecionado.valor * quantidade);
    }
  }, [quantidade, produtoSelecionado]);

  const handleQuantidadeChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 1 && value <= quantidadeDisponivel) {
      setQuantidade(value);
    } else if (value > quantidadeDisponivel) {
      alert("Quantidade excede a disponibilidade do produto.");
    }
  };

  const adicionarProduto = () => {
    if (
      produtoSelecionado &&
      quantidade > 0 &&
      quantidade <= quantidadeDisponivel
    ) {
      const itemVenda = {
        produtoID: produtoSelecionado.id,
        nome: produtoSelecionado.nome,
        quantidade: quantidade,
        valor: produtoSelecionado.valor * quantidade,
      };
      setItensVenda([...itensVenda, itemVenda]);
      setProdutoID("");
      setProdutoSelecionado(null);
      setQuantidade(1);
      setvalor(0);
    } else {
      alert("Selecione um produto válido e ajuste a quantidade.");
    }
  };

  const removerItem = (index) => {
    const novaLista = itensVenda.filter((_, i) => i !== index);
    setItensVenda(novaLista);
  };

  const handleVenda = async () => {
    if (itensVenda.length === 0) {
      alert("Adicione pelo menos um produto à venda.");
      return;
    }

    try {
      await addDoc(collection(db, "Vendas"), {
        DataHora: new Date(),
        Produtos: itensVenda,
        UsuariosID: UsuariosID,
        VendedorID: vendedorID,
        valorTotal: itensVenda.reduce((total, item) => total + item.valor, 0),
      });

      await Promise.all(
        itensVenda.map(async (item) => {
          const produtoRef = doc(db, "Produtos", item.produtoID);
          const produtoAtualizado = produtos.find(
            (p) => p.id === item.produtoID
          );
          await updateDoc(produtoRef, {
            quantidade: produtoAtualizado.quantidade - item.quantidade,
          });
        })
      );

      alert("Venda registrada com sucesso!");
      window.location.reload();
    } catch (error) {
      console.error("Erro ao registrar a venda:", error);
      alert("Erro ao registrar a venda");
    }
  };

  return (
    <div className={style.container}>
      <div className={style.title}>Venda ao Consumidor</div>
      <form>
        <label htmlFor="produto">
          <Autocomplete
            id="produto"
            options={produtos}
            getOptionLabel={(option) => option.nome || option.id}
            onChange={(event, newValue) => {
              setProdutoID(newValue ? newValue.id : "");
              setQuantidade(1);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Escolha um produto" />
            )}
          />
        </label>
        <br />
        <label htmlFor="user">
          <Autocomplete
            id="user"
            options={Usuarios}
            getOptionLabel={(option) => option.login || option.nome}
            onChange={(event, newValue) =>
              setUsuariosID(newValue ? newValue.id : "")
            }
            renderInput={(params) => (
              <TextField {...params} label="Escolha um usuário" />
            )}
          />
        </label>
        <br />
        <label htmlFor="vendedor">
          <Autocomplete
            id="vendedores"
            options={vendedores}
            getOptionLabel={(option) => option.nome || option.email}
            onChange={(event, newValue) =>
              setVendedorID(newValue ? newValue.id : "")
            }
            renderInput={(params) => (
              <TextField {...params} label="Escolha um vendedor" />
            )}
          />
        </label>
        <br />
        <BarcodeReader
          onError={console.error}
          onScan={(data) => setProdutoID(data)}
        />
        <br />
        <label>
          <p>
            {produtoSelecionado
              ? `Este produto possui ${quantidadeDisponivel} unidades restantes.`
              : ""}
          </p>
          Quantidade:
          <input
            type="number"
            value={quantidade}
            onChange={handleQuantidadeChange}
            required
            min="1"
          />
        </label>
        <br />
        <span>Valor do item: R${valor.toFixed(2)}</span>
        <br />
        <button type="button" onClick={adicionarProduto}>
          Adicionar Produto à Venda
        </button>
        <br />
        <div>
          <h4>Itens adicionados:</h4>
          <ul>
            {itensVenda.map((item, index) => (
              <li key={index}>
                {item.nome} - Quantidade: {item.quantidade} - Valor: R$
                {item.valor.toFixed(2)}
                <button onClick={() => removerItem(index)}>Remover</button>
              </li>
            ))}
          </ul>
          <p>
            <strong>Valor Total:</strong> R$
            {itensVenda
              .reduce((total, item) => total + item.valor, 0)
              .toFixed(2)}
          </p>
        </div>
        <br />
        <button type="button" onClick={handleVenda}>
          Registrar Venda
        </button>
      </form>
    </div>
  );
}

export default Venda;
