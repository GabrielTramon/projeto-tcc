import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  deleteDoc,
  getDocs,
  updateDoc, // Importando função para atualizar documentos
} from "firebase/firestore";
import { useEffect, useState } from "react";
import style from "../CrudCliente/styles.module.css";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyCEli15SSz40ZzsWWY3orYRcxx8I9qxIXw",
  authDomain: "agroshop-tramontin-c28cc.firebaseapp.com",
  projectId: "agroshop-tramontin-c28cc",
  storageBucket: "agroshop-tramontin-c28cc.appspot.com",
  messagingSenderId: "550256230785",
  appId: "1:550256230785:web:fa4e1d693f4a7f7b0fe880",
});

export const CrudCliente = () => {
  const [Clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [activeClientId, setActiveClientId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingClient, setEditingClient] = useState(null); // Estado para o cliente em edição
  const [editFormData, setEditFormData] = useState({}); // Dados do formulário de edição

  const db = getFirestore(firebaseApp);
  const ClientesCollectionRef = collection(db, "Clientes");

  useEffect(() => {
    const getClientes = async () => {
      const data = await getDocs(ClientesCollectionRef);
      const sortedClients = data.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .sort((a, b) => a.nome.localeCompare(b.nome)); // Ordena os nomes alfabeticamente
      setClientes(sortedClients);
      setFilteredClientes(sortedClients); // Inicialmente, a lista filtrada é a lista completa
    };
    getClientes();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = Clientes.filter((client) =>
      client.nome.toLowerCase().includes(term)
    );
    setFilteredClientes(filtered);
  };

  const toggleClientDetails = (id) => {
    setActiveClientId(activeClientId === id ? null : id);
  };

  async function deleteUser(id) {
    try {
      const userDoc = doc(db, "Clientes", id);
      await deleteDoc(userDoc);
      alert("Cliente deletado com sucesso!");
      setClientes(Clientes.filter((client) => client.id !== id));
      setFilteredClientes(filteredClientes.filter((client) => client.id !== id));
    } catch (e) {
      console.error("Erro ao deletar cliente: ", e);
      alert("Erro ao deletar cliente: " + e.message);
    }
  }

  const startEditClient = (client) => {
    setEditingClient(client);
    setEditFormData(client); // Preenche o formulário com os dados do cliente atual
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const saveEdits = async (e) => {
    e.preventDefault();
    try {
      const clientDoc = doc(db, "Clientes", editingClient.id);
      await updateDoc(clientDoc, editFormData);
      alert("Cliente atualizado com sucesso!");
      // Atualiza a lista de clientes com os dados modificados
      const updatedClientes = Clientes.map((client) =>
        client.id === editingClient.id ? { ...editFormData, id: editingClient.id } : client
      );
      setClientes(updatedClientes);
      setFilteredClientes(updatedClientes);
      setEditingClient(null); // Sai do modo de edição
    } catch (e) {
      console.error("Erro ao atualizar cliente: ", e);
      alert("Erro ao atualizar cliente: " + e.message);
    }
  };

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
        {filteredClientes.map((client) => (
          <li
            key={client.id}
            className={`${style.clientItem} ${
              activeClientId === client.id ? style.active : ""
            }`}
            onClick={() => toggleClientDetails(client.id)}
          >
            {client.nome}
            <div className={style.clientDetails}>
              <p>Email: {client.email}</p>
              <p>Endereço: {client.endereço}</p>
              <p>CPF: {client.cpf}</p>
              <p>Telefone: {client.telefone}</p>
              <p>Data de Nascimento: {client.dataNascimento}</p>
              <button
                className={style.deleteButton}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteUser(client.id);
                }}
              >
                Deletar
              </button>
              <button
                className={style.editButton}
                onClick={(e) => {
                  e.stopPropagation();
                  startEditClient(client);
                }}
              >
                Editar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Formulário de edição */}
      {editingClient && (
        <form className={style.editForm} onSubmit={saveEdits}>
          <h3>Editando Cliente: {editingClient.nome}</h3>
          <label>
            Nome:
            <input
              type="text"
              name="nome"
              value={editFormData.nome}
              onChange={handleEditChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={editFormData.email}
              onChange={handleEditChange}
            />
          </label>
          <label>
            Endereço:
            <input
              type="text"
              name="endereço"
              value={editFormData.endereço}
              onChange={handleEditChange}
            />
          </label>
          <label>
            CPF:
            <input
              type="text"
              name="cpf"
              value={editFormData.cpf}
              onChange={handleEditChange}
            />
          </label>
          <label>
            Telefone:
            <input
              type="text"
              name="telefone"
              value={editFormData.telefone}
              onChange={handleEditChange}
            />
          </label>
          <label>
            Data de Nascimento:
            <input
              type="date"
              name="dataNascimento"
              value={editFormData.dataNascimento}
              onChange={handleEditChange}
            />
          </label>
          <button type="submit" className={style.editButton}>Salvar Alterações</button>
          <button
            type="button"
            className={style.deleteButton}
            onClick={() => setEditingClient(null)} // Cancelar edição
          >
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
};
