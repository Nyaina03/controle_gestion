import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './css/EtatsAEtablir.css'; // Réutilisation des styles existants
import './css/FormPage.css'; // Si nécessaire pour d'autres styles

function VisualisationInvestissement() {
  const [code, setCode] = useState('');
  const [programme, setProgramme] = useState('');
  const [annee, setAnnee] = useState('');
  const [tri, setTri] = useState('');
  const [afficherTableau, setAfficherTableau] = useState(false);
  const [data, setData] = useState([]);  // Pour stocker les données de l'API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  // Pour gérer les erreurs

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAfficherTableau(true);
    setLoading(true);  // Démarre le chargement des données
    setError(null);    // Réinitialise les erreurs

    try {
      // Construire l'URL de l'API avec les paramètres
      const response = await fetch(
        `http://localhost:8000/api/budget/visualisation_investissement/?code_programme=${programme}&annee=${annee}&tri=${tri}`
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }

      const result = await response.json();
      setData(result);  // Mettre à jour l'état avec les données reçues
    } catch (error) {
      setError(error.message);  // Si une erreur survient
    } finally {
      setLoading(false);  // Arrêter le chargement une fois la requête terminée
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Visualisation des Investissements (Classe 2)</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="programme">Code Programme:</label>
              <select
                id="programme"
                value={programme}
                onChange={(e) => setProgramme(e.target.value)}
                required
              >
                <option value="">Sélectionner un programme</option>
                <option value="22">22</option>
                <option value="209">209</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="annee">Choix de l'année:</label>
              <input
                  id="annee"
                  type="number"
                  value={annee}
                  onChange={(e) => setAnnee(e.target.value)}
                  required
                />
            </div>

            <div className="form-group">
              <label htmlFor="tri">Tri par:</label>
              <select
                id="tri"
                value={tri}
                onChange={(e) => setTri(e.target.value)}
                required
              >
                <option value="">Sélectionner un critère de tri</option>
                <option value="compte">Compte</option>
                <option value="montant">Montant</option>
              </select>
            </div>

            <div className="button-group">
              <button type="submit" className="btn save-btn">OK</button>
            </div>
          </form>

          {/* Affichage du tableau après soumission */}
          {loading && <p>Chargement des données...</p>} {/* Affiche un message de chargement */}
          {error && <p style={{ color: 'red' }}>{error}</p>} {/* Affiche une erreur si elle existe */}

          {afficherTableau && !loading && (
            <table className="tiers-table">
            <thead>
              <tr>
                <th>Code Programme</th>
                <th>Compte</th>
                <th>Libelle</th>
                <th>Engagement</th>
                <th>Crédit</th>
                <th>MOD-</th>
                <th>MOD+</th>
                <th>Corrige</th>
                <th>Code PTA</th>
              </tr>
            </thead>
            <tbody>
              {/* Vérification s'il y a des données */}
              {data.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ color: 'red', textAlign: 'center' }}>
                    Aucune donnée disponible.
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.programme}</td>
                    <td>{item.code_compte}</td>
                    <td>{item.libelle}</td>
                    <td>{item.total_attachements}</td>
                    <td>{item.credit}</td>
                    <td style={{ color: parseFloat(item.modif_moins) < 0 ? 'red' : 'initial' }}>
                      {item.modif_moins}
                    </td>
                    <td style={{ color: parseFloat(item.modif_plus) > 0 ? 'green' : 'initial' }}>
                      {item.modif_plus}
                    </td>
                    <td>{item.montant_apres_modification}</td>
                    <td>{item.pta.map(pta => pta.libelle).join(', ')}</td>
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

export default VisualisationInvestissement;
