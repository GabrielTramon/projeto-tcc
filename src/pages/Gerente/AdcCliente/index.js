import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useState } from "react";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyCEli15SSz40ZzsWWY3orYRcxx8I9qxIXw",
  authDomain: "agroshop-tramontin-c28cc.firebaseapp.com",
  projectId: "agroshop-tramontin-c28cc",
  storageBucket: "agroshop-tramontin-c28cc.appspot.com",
  messagingSenderId: "550256230785",
  appId: "1:550256230785:web:fa4e1d693f4a7f7b0fe880",
});

export const AdcCliente = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [endereço, setEndereço] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  const db = getFirestore(firebaseApp);
  const usersCollectionRef = collection(db, "Clientes");

  async function criarDado() {
    try {
      const user = await addDoc(usersCollectionRef, {
        nome,
        email,
        endereço,
        cpf,
        telefone,
        dataNascimento,
      });

      console.log("dados salvos com sucesso", user);
      alert("Dados salvos com sucesso!");

      // Recarregar a página
      window.location.reload();
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Erro ao salvar os dados: " + e.message);
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Endereço"
        value={endereço}
        onChange={(e) => setEndereço(e.target.value)}
      />
      <input
        type="text"
        placeholder="CPF"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
      />
      <input
        type="text"
        placeholder="Telefone"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
      />
      <input
        type="date"
        placeholder="Data de nascimento"
        value={dataNascimento}
        onChange={(e) => setDataNascimento(e.target.value)}
      />
      <button onClick={criarDado}>Criar dado</button>
    </div>
  );
};
