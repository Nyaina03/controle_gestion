import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/EtatsAEtablir.css"; // Réutilisation des styles existants pour les tableaux
import "./css/FormPage.css"; // Pour des styles supplémentaires

function EtatEngagementParCompte() {
  const [compte, setCompte] = useState("");
  const [annee, setAnnee] = useState("");
  const [engagements, setEngagements] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comptes, setComptes] = useState([]);

  useEffect(() => {
    // Charger les comptes
    fetch('http://localhost:8000/api/comptes/comptes/')
      .then(response => response.json())
      .then(data => setComptes(data))
      .catch(error => console.error('Erreur lors du chargement des comptes:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Appel de l'API
      const response = await fetch(
        `http://localhost:8000/api/realisationBudget/etat_engagement_par_compte/${compte}/${annee}/`
      );

      if (!response.ok) {
        throw new Error(
          `Erreur lors de la récupération des données: ${response.statusText}`
        );
      }

      const data = await response.json();
      setEngagements(data); // Stocker les données dans l'état
      setShowTable(true); // Afficher le tableau après récupération des données
    } catch (err) {
      setError(err.message);
      setShowTable(true); // Toujours afficher le tableau, même en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">État des Engagements par Compte</h2>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            {/* Sélection du compte */}
            <div className="form-group">
              <label htmlFor="compte-select">Compte:</label>
              <select
                id="compte-select"
                value={compte}
                onChange={(e) => setCompte(e.target.value)}
                required
              >
                <option value="">--Choisissez un compte--</option>
                {comptes.map(compte => (
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
                required
              />
            </div>
            <div className="button-group">
              <button type="submit" className="btn save-btn" disabled={loading}>
                {loading ? "Chargement..." : "OK"}
              </button>
            </div>
          </form>

          {/* Message d'erreur */}
          {error && <p className="error-message">{error}</p>}

          {/* Affiche le tableau uniquement si showTable est vrai */}
          {showTable && (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>Date ENG</th>
                  <th>Compte</th>
                  <th>Num ENG</th>
                  <th>Fournisseurs</th>
                  <th>Objet</th>
                  <th>Montant</th>
                  <th>État</th>
                  <th>Num PTA</th>
                </tr>
              </thead>
              <tbody>
                {/* Si il y a des engagements, afficher les lignes */}
                {engagements.length > 0 ? (
                  engagements.map((eng, index) => (
                    <tr key={index}>
                      <td>{eng.dateEng}</td>
                      <td>{eng.compte}</td>
                      <td>{eng.numEng}</td>
                      <td>{eng.fournisseurs}</td>
                      <td>{eng.objet}</td>
                      <td>{eng.montant}</td>
                      <td>{eng.etat}</td>
                      <td>{eng.numPta}</td>
                    </tr>
                  ))
                ) : (
                  // Afficher un message d'erreur si aucun engagement n'est trouvé
                  <tr>
                    <td colSpan="8" className="no-data-message">
                      Aucune donnée disponible.
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

export default EtatEngagementParCompte;
