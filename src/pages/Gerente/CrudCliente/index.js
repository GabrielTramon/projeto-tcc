import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";

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

  const db = getFirestore(firebaseApp);
  const ClientesCollectionRef = collection(db, "Clientes");

  useEffect(() => {
    const getClientes = async () => {
      const data = await getDocs(ClientesCollectionRef);
      setClientes(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getClientes();
  }, []);

  async function deleteUser(id) {
    try {
      const userDoc = doc(db, "Clientes", id);
      await deleteDoc(userDoc);
      alert("Usuário deletado com sucesso!");

      // Atualizar o estado dos clientes após a exclusão
      setClientes(Clientes.filter((user) => user.id !== id));
    } catch (e) {
      console.error("Erro ao deletar usuário: ", e);
      alert("Erro ao deletar usuário: " + e.message);
    }
  }

  return (
    <div>
      <ul>
        {Clientes.map((user) => {
          return (
            <div key={user.id}>
              <li>{user.nome}</li>
              <li>{user.email}</li>
              <li>{user.endereço}</li>
              <li>{user.cpf}</li>
              <li>{user.telefone}</li>
              <li>{user.dataNascimento}</li>
              <button onClick={() => deleteUser(user.id)}>Deletar</button>
            </div>
          );
        })}
      </ul>
    </div>
  );
};
