import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/EtatsAEtablir.css"; // Réutilisation des styles existants pour les tableaux
import "./css/FormPage.css"; // Pour des styles supplémentaires

function SuiviDesEngagements() {
  const [compte, setCompte] = useState("");
  const [etatEngagement, setEtatEngagement] = useState("");
  const [annee, setAnnee] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [comptes, setComptes] = useState([]);
  const [engagements, setEngagements] = useState([]);
  const [loading, setLoading] = useState(false); // Ajouter un état pour la gestion du chargement
  const [error, setError] = useState(null); // Ajouter un état pour gérer les erreurs

  useEffect(() => {
    // Charger les comptes
    fetch('http://localhost:8000/api/comptes/comptes/')
      .then(response => response.json())
      .then(data => setComptes(data))
      .catch(error => console.error('Erreur lors du chargement des comptes:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowTable(false); // Cache le tableau avant la soumission

    // Effectuer l'appel API
    fetch(`http://localhost:8000/api/realisationBudget/suivi_des_engagements/${compte}/${etatEngagement}/${annee}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        return response.json();
      })
      .then((data) => {
        // Vérifier si la réponse est bien un tableau imbriqué
        if (Array.isArray(data) && Array.isArray(data[0])) {
          setEngagements(data[0]); // Extraire le tableau interne
        } else {
          setEngagements(data); // Si pas de tableau imbriqué
        }
        setShowTable(true); // Affiche le tableau après récupération des données
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message); // Gérer les erreurs
        setLoading(false);
      });
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Suivi des Engagements</h2>

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
              <label htmlFor="etatEngagement">État d'Engagement :</label>
              <select
                id="etatEngagement"
                value={etatEngagement}
                onChange={(e) => setEtatEngagement(e.target.value)}
                required // Validation automatique du navigateur
              >
                <option value="">Sélectionnez un état d'engagement</option>
                <option value="liquide">Liquide</option>
                <option value="vise">Vise</option>
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
              <button type="submit" className="btn save-btn">OK</button>
            </div>
          </form>

          {/* Affiche le tableau uniquement si showTable est vrai */}
          {loading && <p>Chargement des données...</p>} {/* Affiche le message de chargement */}
          {error && <p className="error-message">{error}</p>} {/* Affiche l'erreur, le cas échéant */}
          {showTable && (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>Date ENG</th>
                  <th>Num ENG</th>
                  <th>PRGM</th>
                  <th>Objet</th>
                  <th>Montant</th>
                </tr>
              </thead>
              <tbody>
                {/* Lignes du tableau dynamiques */}
                {engagements.length > 0 ? (
                  engagements.map((engagement, index) => (
                    <tr key={index}>
                      <td>{engagement.date_eng}</td>
                      <td>{engagement.num_engagement}</td>
                      <td>{engagement.code_programme}</td>
                      <td>{engagement.objet}</td>
                      <td>
                        {/* Vérification avant d'utiliser toLocaleString */}
                        {engagement.montant !== undefined && engagement.montant !== null
                          ? engagement.montant.toLocaleString()
                          : "N/A"
                        }
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">Aucun engagement trouvé</td>
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

export default SuiviDesEngagements;
