import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import style from "../CrudVendedor/styles.module.css";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyCEli15SSz40ZzsWWY3orYRcxx8I9qxIXw",
  authDomain: "agroshop-tramontin-c28cc.firebaseapp.com",
  projectId: "agroshop-tramontin-c28cc",
  storageBucket: "agroshop-tramontin-c28cc.appspot.com",
  messagingSenderId: "550256230785",
  appId: "1:550256230785:web:fa4e1d693f4a7f7b0fe880",
});

export const CrudVendedor = () => {
  const [Vendedores, setVendedores] = useState([]);
  const [filteredVendedores, setFilteredVendedores] = useState([]);
  const [activeClientId, setActiveClientId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const db = getFirestore(firebaseApp);
  const VendedoresCollectionRef = collection(db, "Vendedores");

  useEffect(() => {
    const getVendedores = async () => {
      const data = await getDocs(VendedoresCollectionRef);
      const sortedClients = data.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .sort((a, b) => a.nome.localeCompare(b.nome)); // Ordena os nomes alfabeticamente
      setVendedores(sortedClients);
      setFilteredVendedores(sortedClients); // Inicialmente, a lista filtrada é a lista completa
    };
    getVendedores();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = Vendedores.filter((client) =>
      client.nome.toLowerCase().includes(term)
    );
    setFilteredVendedores(filtered);
  };

  const toggleClientDetails = (id) => {
    setActiveClientId(activeClientId === id ? null : id);
  };

  async function deleteUser(id) {
    try {
      const userDoc = doc(db, "Vendedores", id);
      await deleteDoc(userDoc);
      alert("Usuário deletado com sucesso!");
      setVendedores(Vendedores.filter((user) => user.id !== id));
      setFilteredVendedores(
        filteredVendedores.filter((user) => user.id !== id)
      );
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
        {filteredVendedores.map((user) => (
          <li
            key={user.id}
            className={`${style.clientItem} ${
              activeClientId === user.id ? style.active : ""
            }`}
            onClick={() => toggleClientDetails(user.id)}
          >
            {user.nome}
            <div className={style.clientDetails}>
              <p>Codigo: {user.codigo}</p>
              <p>Valor vendido: {user.ValorVendido}</p>
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
