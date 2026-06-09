import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/EtatsAEtablir.css"; // Réutilisation des styles existants pour les tableaux
import "./css/FormPage.css"; // Pour des styles supplémentaires

function VisualisationDesMarches() {
  const [annee, setAnnee] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [marches, setMarches] = useState([]);
  const [error, setError] = useState(null); // Pour gérer les erreurs

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowTable(true); // Affiche le tableau après soumission

    try {
      // Effectuer l'appel API pour récupérer les données
      const response = await fetch(`http://localhost:8000/api/marches/visualisation_des_marches/${annee}/`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      
      const data = await response.json();
      setMarches(data); // Mettre à jour l'état avec les données récupérées
    } catch (err) {
      setError(err.message); // Gérer l'erreur si l'API échoue
      setMarches([]); // Réinitialiser les données en cas d'erreur
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Visualisation des Marchés</h2>

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

          {/* Affiche l'erreur si elle existe */}
          {error && <div className="error">{error}</div>}

          {/* Affiche le tableau uniquement si showTable est vrai */}
          {showTable && (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>N° Marché</th>
                  <th>Libellé</th>
                  <th>Attributaire</th>
                  <th>Montant</th>
                  <th>Décaissement</th>
                  <th>Observation</th>
                </tr>
              </thead>
              <tbody>
                {/* Lignes du tableau dynamiques */}
                {marches.length > 0 ? (
                  marches.map((marche, index) => (
                    <tr key={index}>
                      <td>{marche.num_marche}</td>
                      <td>{marche.libelle}</td>
                      <td>{marche.attributaire}</td>
                      <td>{marche.montant.toLocaleString()}</td>
                      <td>{marche.decaissement.toLocaleString()}</td>
                      <td>{marche.observation}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">Aucun marché trouvé pour cette année.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default VisualisationDesMarches;
