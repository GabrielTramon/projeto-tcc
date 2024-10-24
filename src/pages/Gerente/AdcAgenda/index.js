import React, { useState, useEffect } from "react";
import { db } from "../../../services/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { AuthProvider, useAuth } from "../../../services/authContext";
import emailjs from "emailjs-com";

function AdcAgenda() {
  const [pets, setPets] = useState([]);
  const [selectedPets, setSelectedPets] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const [dataHora, setDataHora] = useState("");
  const [totalValue, setTotalValue] = useState(0);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const router = useRouter(); // Substitui navigate pelo hook de navegação do Next.js

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  useEffect(() => {
    const fetchPets = async () => {
      if (currentUser) {
        const q = query(
          collection(db, "Pets"),
          where("UsuarioID", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const petList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPets(petList);
      }
    };

    fetchPets();
  }, [currentUser]);

  const handlePetSelection = (petId) => {
    setSelectedPets((prev) => {
      if (prev.includes(petId)) {
        return prev.filter((id) => id !== petId);
      } else {
        return [...prev, petId];
      }
    });
  };

  const handleServiceChange = (petId, service) => {
    setSelectedServices((prev) => ({
      ...prev,
      [petId]: service,
    }));
  };

  useEffect(() => {
    const calculateTotalValue = async () => {
      let calculatedTotalValue = 0;

      for (let petId of selectedPets) {
        const petDoc = await getDoc(doc(db, "Pets", petId));
        const petData = petDoc.data();
        const petValue = petData.ValorBanho;
        const service = selectedServices[petId];

        if (service === "banho_e_tosa_completo") {
          calculatedTotalValue += petValue + 20;
        } else {
          calculatedTotalValue += petValue;
        }
      }

      setTotalValue(calculatedTotalValue);
    };

    calculateTotalValue();
  }, [selectedPets, selectedServices]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedDate = new Date(dataHora);
    const currentDate = new Date();

    if (selectedPets.length === 0 || !dataHora) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (selectedDate <= currentDate) {
      setError("A data do agendamento deve ser posterior a hoje.");
      return;
    }

    try {
      let petNames = [];

      for (let petId of selectedPets) {
        const petDoc = await getDoc(doc(db, "Pets", petId));
        const petData = petDoc.data();
        const service = selectedServices[petId];
        const petValue = petData.ValorBanho;

        petNames.push(petData?.Nome || "Nome não disponível");

        await addDoc(collection(db, "Agendamentos"), {
          DataHora: selectedDate,
          PetID: petId,
          TipoPelagem: petData?.Pelagem || "",
          UsuarioID: currentUser.uid,
          Valor: service === "banho_e_tosa_completo" ? petValue + 20 : petValue,
          Status: "Pendente",
        });
      }

      const templateParams = {
        to_email: currentUser.email,
        user_name: currentUser.displayName || currentUser.email,
        appointment_date: selectedDate.toLocaleString(),
        pet_name: petNames.join(", "),
        price: totalValue.toFixed(2),
      };

      await emailjs.send(
        "service_7xoagkl",
        "template_h32yvo8",
        templateParams,
        "MBiM7SIBygzCqO4sU"
      );

      alert("Agendamento realizado com sucesso!");
      router.push("/");
    } catch (err) {
      setError("Erro ao realizar o agendamento. Tente novamente.");
      console.error("Erro ao realizar o agendamento: ", err);
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now.getTime() - offset)
      .toISOString()
      .slice(0, 16);
    return localISOTime;
  };

  if (!currentUser) {
    return <div>Você precisa estar logado para agendar um banho e tosa.</div>;
  }

  return (
    <div>
      <h2>Agendar Banho e Tosa</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {pets.map((pet) => (
          <div key={pet.id} style={{ marginBottom: "20px" }}>
            <label style={{ marginRight: "10px" }}>
              <input
                type="checkbox"
                checked={selectedPets.includes(pet.id)}
                onChange={() => handlePetSelection(pet.id)}
              />
              {pet.Nome}
            </label>
            {selectedPets.includes(pet.id) && (
              <label style={{ marginLeft: "10px" }}>
                Selecione o Serviço:
                <select
                  onChange={(e) => handleServiceChange(pet.id, e.target.value)}
                >
                  <option value="apenas_banho">Apenas Banho</option>
                  <option value="banho_e_tosa_completo">
                    Banho e Tosa Completo (+ R$ 20,00)
                  </option>
                </select>
              </label>
            )}
            <br />
          </div>
        ))}
        <label>
          Data e Hora:
          <input
            type="datetime-local"
            value={dataHora}
            min={getCurrentDateTime()}
            onChange={(e) => setDataHora(e.target.value)}
          />
        </label>
        <br />
        <p>Valor total: R$ {totalValue.toFixed(2)}</p>
        <button type="submit">Confirmar Agendamento</button>
      </form>
    </div>
  );
}

export default AdcAgenda;
