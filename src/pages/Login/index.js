import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { auth } from "../../services/firebaseConfig";
import "./styles.css";

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
    navigate("/homeGerente"); // Redireciona para a página "/dashboard"
  }

  return (
    <div className="container">
      <header className="header">
        <img src={logo} alt="Workflow" className="logo" width={180} />
        <span>Seja Bem-Vindo ao sistema T&T</span>
      </header>

      <form>
        <div className="inputContainer">
          <label htmlFor="email">E-mail</label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Usuario@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="inputContainer">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="button" onClick={handleSignIn}>
          Entrar
        </button>
      </form>
    </div>
  );
}
