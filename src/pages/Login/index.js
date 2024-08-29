import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { auth } from "../../services/firebaseConfig";
import style from "../Login/styles.module.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const navigate = useNavigate();

  function handleSignIn(e) {
    e.preventDefault();
    signInWithEmailAndPassword(email, password);
  }

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (user) {
    navigate("/homeGerente");
  }

  return (
    <div className={style.container}>
      <header className={style.header}>
        <img src={logo} alt="Workflow" className={style.logo} width={180} />
        <span>Seja Bem-Vindo ao sistema T&T</span>
      </header>

      <form>
        <div className={style.inputContainer}>
          <label htmlFor="email">E-mail</label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Usuario@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={style.inputContainer}>
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className={style.button} onClick={handleSignIn}>
          Entrar
        </button>
      </form>
    </div>
  );
}
