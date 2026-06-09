import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/EtatsAEtablir.css"; // Réutilisation des styles existants pour les tableaux
import "./css/FormPage.css"; // Pour des styles supplémentaires

function EtatEngagementParTiers() {
  const [compte, setCompte] = useState("");
  const [annee, setAnnee] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [engagements, setEngagements] = useState([]); // État pour stocker les données récupérées
  const [loading, setLoading] = useState(false); // État pour la gestion du chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs
  const [comptes, setComptes] = useState([]); // État pour les comptes disponibles

  useEffect(() => {
    // Charger les comptes
    fetch("http://localhost:8000/api/comptes/comptes/")
      .then((response) => response.json())
      .then((data) => setComptes(data))
      .catch((error) =>
        console.error("Erreur lors du chargement des comptes:", error)
      );
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowTable(false); // Cache le tableau avant la soumission

    // Effectuer l'appel API
    fetch(
      `http://localhost:8000/api/realisationBudget/etat_engagement_par_tiers/${compte}/${annee}/`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        return response.json();
      })
      .then((data) => {
        setEngagements(data); // Met à jour l'état avec les données de l'API
        setShowTable(true); // Affiche le tableau après récupération des données
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message); // Gère les erreurs
        setLoading(false);
      });
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">État des Engagements par Tiers</h2>
          <form onSubmit={handleSubmit} className="form">
            {/* Formulaire */}
            <div className="form-group">
              <label htmlFor="compte-select">Compte:</label>
              <select
                id="compte-select"
                value={compte}
                onChange={(e) => setCompte(e.target.value)}
                required
              >
                <option value="">--Choisissez un compte--</option>
                {comptes.map((compte) => (
                  <option key={compte.id_compte} value={compte.id_compte}>
                    {compte.code} - {compte.libelle}
                  </option>
                ))}
              </select>
            </div>
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
              <button type="submit" className="btn save-btn">
                OK
              </button>
            </div>
          </form>

          {/* Message de chargement */}
          {loading && <p>Chargement des données...</p>}

          {/* Affichage des erreurs */}
          {error && <p className="error-message">{error}</p>}

          {/* Affichage du tableau */}
          {showTable && !loading && !error && (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>Code Tiers</th>
                  <th>Nom Tiers</th>
                  <th>Montant</th>
                  <th>Nb Paiements Effectués</th>
                </tr>
              </thead>
              <tbody>
                {engagements.length > 0 ? (
                  engagements.map((engagement, index) => (
                    <tr key={index}>
                      <td>{engagement.code_tiers}</td>
                      <td>{engagement.fournisseurs}</td>
                      <td>{engagement.montant.toLocaleString()}</td>
                      <td>{engagement.nbPaiements}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">
                      Aucun engagement trouvé pour les critères spécifiés.
                    </td>
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

export default EtatEngagementParTiers;
