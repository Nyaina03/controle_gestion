import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/EtatsAEtablir.css"; // Réutilisation des styles existants pour les tableaux
import "./css/FormPage.css"; // Pour des styles supplémentaires

function VisualisationDesEngagements() {
  const [annee, setAnnee] = useState("");
  const [showTable, setShowTable] = useState(false); // État pour afficher ou masquer le tableau
  const [engagements, setEngagements] = useState([]); // État pour stocker les données récupérées
  const [errorMessage, setErrorMessage] = useState(""); // État pour afficher les erreurs

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowTable(true); // Affiche le tableau après soumission
    setErrorMessage(""); // Réinitialise le message d'erreur

    try {
      const response = await fetch(`http://localhost:8000/api/realisationBudget/visualisation_engagement/${annee}/`);
      const data = await response.json();

      if (response.ok) {
        if (data.length > 0) {
          setEngagements(data); // Stocke les engagements dans l'état
        } else {
          setErrorMessage("Aucun engagement trouvé pour l'année " + annee); // Affiche un message si aucune donnée n'est trouvée
        }
      } else {
        setErrorMessage("Erreur lors de la récupération des données.");
      }
    } catch (error) {
      setErrorMessage("Erreur de connexion ou serveur indisponible.");
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Visualisation des Engagements</h2>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="annee">Choix de l'année :</label>
              <input
                id="annee"
                type="number"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                placeholder="Ex: 2024"
                min="2000"
                max="2100"
                required // Validation automatique du navigateur
              />
            </div>
            <div className="button-group">
              <button type="submit" className="btn save-btn">OK</button>
            </div>
          </form>

          {/* Affiche le message d'erreur si nécessaire */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          {/* Affiche le tableau uniquement si showTable est vrai */}
          {showTable && engagements.length > 0 && (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>Num ENG</th>
                  <th>PROG</th>
                  <th>Code Tiers</th>
                  <th>Nom Tiers</th>
                  <th>Compte</th>
                  <th>Objet</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Grande Rubrique</th>
                  <th>Montant</th>
                  <th>État</th>
                  <th>Date Visa</th>
                  <th>Date OS</th>
                  <th>Marché</th>
                  <th>Type ENG</th>
                  <th>Code PTA</th>
                  <th>Ville</th>
                </tr>
              </thead>
              <tbody>
                {engagements.map((eng, index) => (
                  <tr key={index}>
                    <td>{eng.numEng}</td>
                    <td>{eng.prog}</td>
                    <td>{eng.codeTiers}</td>
                    <td>{eng.nomTiers}</td>
                    <td>{eng.compte}</td>
                    <td>{eng.objet}</td>
                    <td>{eng.date}</td>
                    <td>{eng.type}</td>
                    <td>{eng.grandeRubrique}</td>
                    <td>{eng.montant.toLocaleString()}</td>
                    <td>{eng.etat}</td>
                    <td>{eng.dateVisa || "N/A"}</td>
                    <td>{eng.dateOs || "N/A"}</td>
                    <td>{eng.marche}</td>
                    <td>{eng.typeEng}</td>
                    <td>{eng.codePta}</td>
                    <td>{eng.ville}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Si aucun engagement n'est trouvé */}
          {showTable && engagements.length === 0 && !errorMessage && (
            <div className="no-data-message">Aucune donnée disponible pour l'année {annee}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VisualisationDesEngagements;
