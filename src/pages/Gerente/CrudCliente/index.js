import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  deleteDoc,
  getDocs,
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
  const [activeClientId, setActiveClientId] = useState(null);

  const db = getFirestore(firebaseApp);
  const ClientesCollectionRef = collection(db, "Clientes");

  useEffect(() => {
    const getClientes = async () => {
      const data = await getDocs(ClientesCollectionRef);
      setClientes(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getClientes();
  }, []);

  const toggleClientDetails = (id) => {
    setActiveClientId(activeClientId === id ? null : id);
  };

  async function deleteUser(id) {
    try {
      const userDoc = doc(db, "Clientes", id);
      await deleteDoc(userDoc);
      alert("Usuário deletado com sucesso!");
      setClientes(Clientes.filter((user) => user.id !== id));
    } catch (e) {
      console.error("Erro ao deletar usuário: ", e);
      alert("Erro ao deletar usuário: " + e.message);
    }
  }

  return (
    <div className={style.container}>
      <ul className={style.clientList}>
        {Clientes.map((user) => (
          <li
            key={user.id}
            className={`${style.clientItem} ${
              activeClientId === user.id ? style.active : ""
            }`}
            onClick={() => toggleClientDetails(user.id)}
          >
            {user.nome}
            <div className={style.clientDetails}>
              <p>Email: {user.email}</p>
              <p>Endereço: {user.endereço}</p>
              <p>CPF: {user.cpf}</p>
              <p>Telefone: {user.telefone}</p>
              <p>Data de Nascimento: {user.dataNascimento}</p>
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
