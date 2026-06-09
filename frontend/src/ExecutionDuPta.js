import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/EtatsAEtablir.css"; // Réutilisation des styles existants pour les tableaux
import "./css/FormPage.css"; // Comme classe de CSS

function ExecutionDuPta() {
  const [annee, setAnnee] = useState("");
  const [executionData, setExecutionData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [message, setMessage] = useState(""); // Pour afficher un message en rouge si aucune donnée n'est trouvée

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowTable(true); // Affiche le tableau après soumission
    console.log("Année sélectionnée :", annee);

    // Appeler l'API pour récupérer les données
    try {
      const response = await fetch(`http://localhost:8000/api/marches/execution_pta/?annee=${annee}`);
      const data = await response.json();

      if (data.length === 0) {
        setMessage("Aucune donnée trouvée pour l'année sélectionnée.");
        setExecutionData([]);
      } else {
        setMessage(""); // Effacer le message si des données sont trouvées
        setExecutionData(data);
      }
    } catch (error) {
      console.error("Erreur lors de l'appel API :", error);
      setMessage("Erreur lors de la récupération des données.");
      setExecutionData([]);
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Exécution du PTA</h2>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="annee">Choix de l'année :</label>
              <input
                id="annee"
                type="number"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                required // Validation automatique du navigateur
              />
            </div>

            <div className="button-group">
              <button type="submit" className="btn save-btn">OK</button>
            </div>
          </form>

          {/* Affiche un message si aucune donnée n'est trouvée */}
          {message && <p style={{ color: 'red', fontWeight: 'bold' }}>{message}</p>}

          {/* Affiche le tableau uniquement si showTable est vrai et qu'il y a des données */}
          {showTable && executionData.length > 0 && (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>Stratégie</th>
                  <th>Activité</th>
                  <th>Libellé</th>
                  <th>Compte</th>
                  <th>Prévision</th>
                  <th>Réalisation</th>
                  <th>Écart</th>
                  <th>Taux de réalisation</th>
                </tr>
              </thead>
              <tbody>
                {/* Lignes du tableau */}
                {executionData.map((data, index) => {
                  const ecart = data.montant_previsionnel - data.montant_realisation;
                  const tauxRealisation = ((data.montant_realisation / data.montant_previsionnel) * 100).toFixed(2);
                  return (
                    <tr key={index}>
                      <td>{data.code_strategique}</td>
                      <td>{data.code_activite}</td>
                      <td>{data.libelle}</td>
                      <td>{data.compte}</td>
                      <td>{data.montant_previsionnel.toLocaleString()}</td>
                      <td>{data.montant_realisation.toLocaleString()}</td>
                      <td>{ecart.toLocaleString()}</td>
                      <td>{tauxRealisation}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExecutionDuPta;
