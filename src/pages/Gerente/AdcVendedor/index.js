import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import style from "../AdcCliente/styles.module.css";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyCEli15SSz40ZzsWWY3orYRcxx8I9qxIXw",
  authDomain: "agroshop-tramontin-c28cc.firebaseapp.com",
  projectId: "agroshop-tramontin-c28cc",
  storageBucket: "agroshop-tramontin-c28cc.appspot.com",
  messagingSenderId: "550256230785",
  appId: "1:550256230785:web:fa4e1d693f4a7f7b0fe880",
});

export const AdcVendedor = () => {
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");

  const db = getFirestore(firebaseApp);
  const usersCollectionRef = collection(db, "Vendedores");

  async function criarDado() {
    try {
      const user = await addDoc(usersCollectionRef, {
        codigo,
        nome,
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
    <div className={style.container}>
      <h1>Adicionar Vendedor</h1>
      <input
        className={style.input}
        type="text"
        placeholder="Codigo"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
      />
      <input
        className={style.input}
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <button className={style.button} onClick={criarDado}>
        Criar dado
      </button>
    </div>
  );
};
