import React, { useState, useEffect } from 'react'
import { db } from '../../../services/firebaseConfig'
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore'
import { Autocomplete, TextField } from '@mui/material'
import BarcodeReader from 'react-barcode-reader'

function Venda() {
  const [produtoID, setProdutoID] = useState('')
  const [usuarioID, setUsuarioID] = useState('')
  const [quantidade, setquantidade] = useState(1) // Começa com 1 para evitar zero
  const [vendedorID, setVendedorID] = useState('')
  const [Valor, setValor] = useState(0)
  const [produtos, setProdutos] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [vendedores, setVendedores] = useState([])
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)
  const [quantidadeDisponivel, setquantidadeDisponivel] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Produtos
        const produtosRef = collection(db, 'Produtos')
        const produtosSnap = await getDocs(produtosRef)
        const produtosList = produtosSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        setProdutos(produtosList)

        // Fetch Usuários
        const usuariosRef = collection(db, 'Usuario')
        const usuariosSnap = await getDocs(usuariosRef)
        const usuariosList = usuariosSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        setUsuarios(usuariosList)

        // Fetch Vendedores
        const vendedoresRef = collection(db, 'Vendedores')
        const vendedoresSnap = await getDocs(vendedoresRef)
        const vendedoresList = vendedoresSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        setVendedores(vendedoresList)
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      }
    }

    fetchData()
  }, [])

  // Atualiza o Valor total e a quantidade disponível quando um produto é selecionado
  useEffect(() => {
    if (produtoID) {
      const selectedProduct = produtos.find(produto => produto.id === produtoID)
      if (selectedProduct) {
        setProdutoSelecionado(selectedProduct)
        setquantidadeDisponivel(selectedProduct.quantidade || 0)
        setValor(selectedProduct.Valor * quantidade)
      }
    }
  }, [produtoID, quantidade, produtos])

  // Atualiza o Valor total quando a quantidade é alterada
  useEffect(() => {
    if (produtoSelecionado) {
      setValor(produtoSelecionado.Valor * quantidade)
    }
  }, [quantidade, produtoSelecionado])

  const handlequantidadeChange = e => {
    const value = Number(e.target.value)
    if (value >= 1 && value <= quantidadeDisponivel) {
      setquantidade(value)
    } else if (value > quantidadeDisponivel) {
      alert('quantidade excede a disponibilidade do produto.')
    }
  }

  const handleVenda = async () => {
    if (quantidade <= 0 || quantidade > quantidadeDisponivel) {
      alert(
        'A quantidade deve ser maior que zero e não pode exceder a disponibilidade do produto.'
      )
      return
    }

    try {
      // Adiciona a venda na coleção "Vendas"
      await addDoc(collection(db, 'Vendas'), {
        DataHora: new Date(),
        ProdutoID: produtoID,
        UsuarioID: usuarioID,
        quantidade: quantidade,
        VendedorID: vendedorID,
        Valor: Valor,
      })

      // Atualiza o estoque do produto
      const produtoRef = doc(db, 'Produtos', produtoID)
      await updateDoc(produtoRef, {
        quantidade: quantidadeDisponivel - quantidade,
      })

      alert('Venda registrada com sucesso!')
    } catch (error) {
      console.error('Erro ao registrar a venda:', error)
      alert('Erro ao registrar a venda')
    }
  }

  return (
    <div>
      <h1>Venda ao Consumidor</h1>
      <form>
        <label htmlFor="produto">
          <Autocomplete
            id="produto"
            options={produtos}
            getOptionLabel={option => option.nome || option.id} // Exibe o nome do produto ou ID se não houver nome
            onChange={(event, newValue) => {
              setProdutoID(newValue ? newValue.id : '')
              setquantidade(1) // Reseta a quantidade quando o produto é alterado
            }}
            renderInput={params => (
              <TextField {...params} label="Escolha um produto" />
            )}
          />
        </label>
        <br />
        <label htmlFor="user">
          <Autocomplete
            id="user"
            options={usuarios}
            getOptionLabel={option => option.login || option.email} // Exibe login do usuário ou email se não houver login
            onChange={(event, newValue) =>
              setUsuarioID(newValue ? newValue.id : '')
            }
            renderInput={params => (
              <TextField {...params} label="Escolha um usuário" />
            )}
          />
        </label>
        <br />
        <label htmlFor="vendedor">
          <Autocomplete
            id="vendedores"
            options={vendedores}
            getOptionLabel={option => option.nome || option.email} // Exibe nome do vendedor ou email se não houver nome
            onChange={(event, newValue) =>
              setVendedorID(newValue ? newValue.id : '')
            }
            renderInput={params => (
              <TextField {...params} label="Escolha um vendedor" />
            )}
          />
        </label>
        <br />
        <BarcodeReader
          onError={console.error}
          onScan={data => setProdutoID(data)} // Use o código do produto lido
        />
        <br />
        <label>
          <p>
            {produtoSelecionado
              ? `Este produto possui ${quantidadeDisponivel} unidades restantes.`
              : ''}
          </p>
          quantidade:
          <input
            type="number"
            value={quantidade}
            onChange={handlequantidadeChange}
            required
            min="1"
          />
        </label>
        <br />
        <span>Valor Total: R${Valor.toFixed(2)}</span>
        <br />
        <button type="button" onClick={handleVenda}>
          Registrar Venda
        </button>
      </form>
    </div>
  )
}

export default Venda