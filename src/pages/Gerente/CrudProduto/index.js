import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import style from "../CrudProduto/styles.module.css";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyCEli15SSz40ZzsWWY3orYRcxx8I9qxIXw",
  authDomain: "agroshop-tramontin-c28cc.firebaseapp.com",
  projectId: "agroshop-tramontin-c28cc",
  storageBucket: "agroshop-tramontin-c28cc.appspot.com",
  messagingSenderId: "550256230785",
  appId: "1:550256230785:web:fa4e1d693f4a7f7b0fe880",
});

export const CrudProduto = () => {
  const [Produtos, setProdutos] = useState([]);
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [activeClientId, setActiveClientId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const db = getFirestore(firebaseApp);
  const ProdutosCollectionRef = collection(db, "Produtos");

  useEffect(() => {
    const getProdutos = async () => {
      const data = await getDocs(ProdutosCollectionRef);
      const sortedClients = data.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }));
      setProdutos(sortedClients);
      setFilteredProdutos(sortedClients); // Inicialmente, a lista filtrada é a lista completa
    };
    getProdutos();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = Produtos.filter((client) =>
      client.nome.toLowerCase().includes(term)
    );
    setFilteredProdutos(filtered);
  };

  const toggleClientDetails = (id) => {
    setActiveClientId(activeClientId === id ? null : id);
  };

  async function deleteUser(id) {
    try {
      const userDoc = doc(db, "Produtos", id);
      await deleteDoc(userDoc);
      alert("Usuário deletado com sucesso!");
      setProdutos(Produtos.filter((user) => user.id !== id));
      setFilteredProdutos(filteredProdutos.filter((user) => user.id !== id));
    } catch (e) {
      console.error("Erro ao deletar usuário: ", e);
      alert("Erro ao deletar usuário: " + e.message);
    }
  }

  return (
    <div className={style.container}>
      <input
        className={style.searchInput}
        type="text"
        placeholder="Pesquisar por nome..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <ul className={style.clientList}>
        {filteredProdutos.map((user) => (
          <li
            key={user.id}
            className={`${style.clientItem} ${
              activeClientId === user.id ? style.active : ""
            }`}
            onClick={() => toggleClientDetails(user.id)}
          >
                          {user.foto && (
                <div>
                  <img
                    src={user.foto}
                    alt="Imagem do Produto"
                    style={{ width: "100px", height: "100px" }}
                  />
                </div>
              )}
            {user.nome}
            <div className={style.clientDetails}>
              <p>Codigo: {user.codigo}</p>
              <p>Descrição: {user.descrição}</p>
              <p>Marca: {user.marca}</p>
              <p>Quantidade: {user.quantidade}</p>
              <p>Categoria: {user.categoria}</p>
              <button
                className={style.deleteButton}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteUser(user.id);
                }}
              >
                Deletar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
