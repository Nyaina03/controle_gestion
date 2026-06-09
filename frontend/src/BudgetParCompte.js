import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './css/EtatsAEtablir.css'; // Réutilisation des styles existants
import './css/FormPage.css'; // Autres styles si nécessaire

function BudgetParCompte() {
  const [compte, setCompte] = useState('');
  const [comptes, setComptes] = useState([]);
  const [annee, setAnnee] = useState('');
  const [data, setData] = useState([]);
  const [resultats, setResultats] = useState([]);
  const [afficherTableau, setAfficherTableau] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    // Charger les comptes
    fetch('http://localhost:8000/api/comptes/comptes/')
      .then(response => response.json())
      .then(data => setComptes(data))
      .catch(error => console.error('Erreur lors du chargement des comptes:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Faire la requête à l'API
    try {
      const response = await fetch(`http://localhost:8000/api/budget/budget_par_compte/?compte=${compte}&annee=${annee}`);
      if (!response.ok) {
        throw new Error('Erreur de récupération des données');
      }
  
      const data = await response.json();
  
      // Mettre à jour l'état avec les résultats obtenus
      setResultats(data);
      setAfficherTableau(true);
    } catch (error) {
      console.error('Erreur:', error);
      // Vous pouvez gérer les erreurs ici (ex: afficher un message d'erreur à l'utilisateur)
    }
  };
  
  

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Budget Par Compte</h2>

          <form onSubmit={handleSubmit}>

          <div className="form-group">
              <label htmlFor="compte-select">Compte:</label>
              <select
                id="compte-select"
                value={compte}
                onChange={(e) => setCompte(e.target.value)}
                required
              >
                <option value="">--Choisissez un compte--</option>
                {comptes
                  .map(compte => (
                    <option key={compte.id_compte} value={compte.id_compte}>
                      {compte.code} - {compte.libelle}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="annee">Saisir l'année:</label>
              <input
                id="annee"
                type="annee"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                required
                placeholder="Entrez l'annee"
              />
            </div>

            <div className="button-group">
              <button type="submit" className="btn save-btn">OK</button>
            </div>
          </form>

          {/* Tableau qui s'affiche après la soumission */}
          {/* Tableau qui s'affiche après la soumission */}
          {afficherTableau && !loading && (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>Code Programme</th>
                  <th>Compte</th>
                  <th>Libelle</th>
                  <th>Montant</th>
                  <th>MOD-</th>
                  <th>MOD+</th>
                  <th>Corrige</th>
            
                </tr>
              </thead>
              <tbody>
                {/* Vérification s'il y a des données */}
                {resultats.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ color: 'red', textAlign: 'center' }}>
                      Aucune donnée disponible.
                    </td>
                  </tr>
                ) : (
                  resultats.map((item, index) => (
                    <tr key={index}>
                      <td>{item.programme}</td>
                      <td>{item.compte}</td>
                      <td>{item.libelle}</td>
                      <td>{item.montant}</td>
                      <td style={{ color: parseFloat(item.modif_moins) < 0 ? 'red' : 'initial' }}>
                        {item.modif_moins}
                      </td>
                      <td style={{ color: parseFloat(item.modif_plus) > 0 ? 'green' : 'initial' }}>
                        {item.modif_plus}
                      </td>
                      <td>{item.montant_apres_modification}</td>
                      
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </div>
  );
}

export default BudgetParCompte;
