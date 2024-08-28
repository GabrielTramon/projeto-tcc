import "./styles.css";
import logo from "../../../assets/logo.png";

export function HomeGerente() {
  return (
    <div className="page">
      <div className="logo">
        <img src={logo} alt="Workflow" className="logo" width={450} />
      </div>
    </div>
  );
}
