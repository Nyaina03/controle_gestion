import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/EtatsAEtablir.css"; // Réutilisation des styles pour le tableau
import "./css/FormPage.css"; // Pour des styles supplémentaires

function ProgrammeDemploi() {
  // États pour l'année, les données, le message d'erreur et l'affichage du tableau
  const [annee, setAnnee] = useState('');
  const [donnees, setDonnees] = useState([]);
  const [messageErreur, setMessageErreur] = useState('');
  const [afficherTableau, setAfficherTableau] = useState(false);

  // Fonction pour récupérer les données depuis l'API
  const fetchDonnees = async () => {
    if (annee) {
      try {
        const response = await fetch(`http://localhost:8000/api/budget/programme_emploi/${annee}/`);
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
          <h2 className="div-h2">Programme d'Emploi</h2>

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
                  <th>PRGME</th>
                  <th>Rubrique</th>
                  <th>BUDG Initial</th>
                  <th>MODIF(-)</th>
                  <th>MODIF(+)</th>
                  <th>Corrigé (BI ± MODIF)</th>
                </tr>
              </thead>
              <tbody>
                {donnees.length > 0 ? (
                  donnees.map((ligne, index) => (
                    <tr key={index}>
                      <td>{ligne.prgme}</td>
                      <td>{ligne.rubrique}</td>
                      <td>{ligne.budgetInitial.toLocaleString()}</td>
                      <td>{ligne.modifMoins.toLocaleString()}</td>
                      <td>{ligne.modifPlus.toLocaleString()}</td>
                      <td
                        style={{
                          color: ligne.corrige < 0 ? "red" : "green", // Rouge si négatif, vert si positif
                        }}
                      >
                        {ligne.corrige.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'red' }}>
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

export default ProgrammeDemploi;
