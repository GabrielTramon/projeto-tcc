import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
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

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const usersCollectionRef = collection(db, "Produtos");

export const AdcProduto = () => {
  const [nome, setNome] = useState("");
  const [marca, setMarca] = useState("");
  const [codigo, setCodigo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descrição, setDescrição] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [foto, setFoto] = useState(null);

  const handleFileChange = (e) => {
    setFoto(e.target.files[0]);
  };

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `Produtos/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const criarDado = async () => {
    try {
      let fotoURL = "";
      if (foto) {
        fotoURL = await uploadImage(foto);
      }

      const user = await addDoc(usersCollectionRef, {
        nome,
        marca,
        codigo,
        categoria,
        descrição,
        quantidade,
        foto: fotoURL,
      });

      console.log("dados salvos com sucesso", user);
      alert("Dados salvos com sucesso!");

      // Recarregar a página
      window.location.reload();
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Erro ao salvar os dados: " + e.message);
    }
  };

  return (
    <div className={style.container}>
      <h1>Adicionar Produtos</h1>
      <input
        className={style.input}
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        className={style.input}
        type="text"
        placeholder="Marca"
        value={marca}
        onChange={(e) => setMarca(e.target.value)}
      />
      <input
        className={style.input}
        type="text"
        placeholder="Código"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
      />
      <input
        className={style.input}
        type="text"
        placeholder="Categoria"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
      />
      <input
        className={style.input}
        type="text"
        placeholder="Descrição"
        value={descrição}
        onChange={(e) => setDescrição(e.target.value)}
      />
      <input
        className={style.input}
        type="number"
        placeholder="Quantidade"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
      />
      <input className={style.input} type="file" onChange={handleFileChange} />
      <button className={style.button} onClick={criarDado}>
        Criar dado
      </button>
    </div>
  );
};
