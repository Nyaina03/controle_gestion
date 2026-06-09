import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/EtatsAEtablir.css"; // Réutilisation des styles existants pour les tableaux
import "./css/FormPage.css"; // Comme classe de CSS

function SituationDuDos() {
  const [anneeDebut, setAnneeDebut] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [annees, setAnnees] = useState([]);
  const [situationData, setSituationData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (anneeDebut) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/dos/situation_dos/?annee_debut=${anneeDebut}`
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données.");
        }

        const data = await response.json();
        setAnnees(data.annees);
        setSituationData(data.situation_data);
        setShowTable(true);
        setErrorMessage(""); // Réinitialise le message d'erreur en cas de succès
      } catch (error) {
        console.error("Erreur:", error);
        setErrorMessage("Impossible de récupérer les données. Veuillez réessayer.");
        setShowTable(false);
      }
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Situation du DOS</h2>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="anneeDebut">Choix de l'année début :</label>
              <input
                id="anneeDebut"
                type="number"
                value={anneeDebut}
                onChange={(e) => setAnneeDebut(e.target.value)}
                required // Validation automatique du navigateur
              />
            </div>

            <div className="button-group">
              <button type="submit" className="btn save-btn">OK</button>
            </div>
          </form>

          {/* Affichage des messages d'erreur */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {/* Affiche le tableau uniquement si showTable est vrai */}
          {showTable && (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>REF DOS</th>
                  <th>Activité</th>
                  {annees.map((annee, index) => (
                    <th key={index}>{annee}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {situationData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.ref_dos}</td>
                    <td>{data.activite}</td>
                    {data.annees.map((montant, index) => (
                      <td key={index}>{montant}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default SituationDuDos;
