import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/EtatsAEtablir.css"; // Réutilisation des styles existants
import "./css/FormPage.css"; // Réutilisation de styles pour les formulaires

function SituationBudgetaire() {
  // États pour l'année, les données, le message d'erreur et l'affichage du tableau
  const [annee, setAnnee] = useState('');
  const [donnees, setDonnees] = useState([]);
  const [messageErreur, setMessageErreur] = useState('');
  const [afficherTableau, setAfficherTableau] = useState(false);

  // Fonction pour récupérer les données depuis l'API
  const fetchDonnees = async () => {
    if (annee) {
      try {
        const response = await fetch(`http://localhost:8000/api/budget/situation_budgetaire/${annee}/`);
        const result = await response.json();

        if (response.ok) {
          setDonnees(result);
          setMessageErreur('');
        } else {
          setDonnees([]);
          setMessageErreur('Aucune donnée trouvée pour l\'année ' + annee);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setDonnees([]);
        setMessageErreur('Erreur lors de la récupération des données');
      }
    }
  };

  // Gérer la soumission du formulaire et l'affichage du tableau
  const handleSubmit = (e) => {
    e.preventDefault(); // Empêcher le rechargement de la page
    setAfficherTableau(true); // Afficher le tableau après le clic sur OK
    fetchDonnees(); // Charger les données
  };

  useEffect(() => {
    // Recharger les données si l'année change
    if (afficherTableau) {
      fetchDonnees();
    }
  }, [annee, afficherTableau]); 

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Situation Budgétaire</h2>

          {/* Formulaire de saisie de l'année */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="annee">Choix de l'année:</label>
              <input
                id="annee"
                type="number"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                required
                placeholder="Entrez l'année"
              />
            </div>

            <div className="button-group">
              <button type="submit" className="btn save-btn">OK</button>
            </div>
          </form>

          {/* Message d'erreur si aucune donnée n'est trouvée */}
          {messageErreur && <p style={{ color: 'red' }}>{messageErreur}</p>}

          {/* Affichage du tableau uniquement après la soumission du formulaire */}
          {afficherTableau && (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>Compte</th>
                  <th>Libellé</th>
                  <th>Budget</th>
                  <th>Réalisation (SIIGFP)</th>
                  <th>Disponible (BUDG_REAL)</th>
                </tr>
              </thead>
              <tbody>
                {donnees.length > 0 ? (
                  donnees.map((ligne, index) => (
                    <tr key={index}>
                      <td>{ligne.code}</td>
                      <td>{ligne.libelle}</td>
                      <td>{ligne.montant}</td>
                      <td>{ligne.realisation}</td>
                      <td>{ligne.disponible}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'red' }}>
                      {messageErreur || 'Aucune donnée disponible pour cette année.'}
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

export default SituationBudgetaire;
