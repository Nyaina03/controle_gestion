import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './css/EtatsAEtablir.css'; // Réutilisation des styles existants
import './css/FormPage.css'; // Si nécessaire pour d'autres styles

function EtatParFamilleDemandeur() {
  const [direction, setDirection] = useState('');
  const [annee, setAnnee] = useState('');
  const [directions, setDirections] = useState([]); 
  const [afficherTableau, setAfficherTableau] = useState(false);
  const [resultats, setResultats] = useState([]);

  useEffect(() => {
    // Charger les localités
    fetch('http://localhost:8000/api/direction/liste_direction/')
      .then(response => response.json())
      .then(data => setDirections(data))
      .catch(error => console.error('Erreur lors du chargement des Diections:', error));

    // Charger les comptes
 
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Faire la requête à l'API
    try {
      const response = await fetch(`http://localhost:8000/api/creationArticle/etat_par_famille_par_demandeur/${direction}/${annee}/`);
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
          <h2 className="div-h2">État par Famille (Demandeur)</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="service">Choix de la Direction:</label>
              <select
                id="direction"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                required
              >
                <option value="">Sélectionner un service</option>
                {directions
                  .map(direction => (
                    <option key={direction.id_direction} value={direction.id_direction}>
                      {direction.nom_direction}
                    </option>
                  ))}
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
                placeholder="Entrez l'année"
              />
            </div>

            <div className="button-group">
              <button type="submit" className="btn save-btn">OK</button>
            </div>
          </form>

          {/* Tableau qui s'affiche après avoir sélectionné un service et une année */}
          {afficherTableau && (
            <table className="tiers-table">
            <thead>
              <tr>
                <th>Famille</th>
                <th>Libelle</th>
                <th>Compte</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              {/* Afficher un message si aucun résultat n'est disponible */}
              {resultats.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ color: 'red', textAlign: 'center' }}>
                    Aucun résultat trouvé .
                  </td>
                </tr>
              ) : (
                // Dynamiser les lignes du tableau avec les données reçues de l'API
                resultats.map((item, index) => (
                  <tr key={index}>
                    <td>{item.code_famille}</td>
                    <td>{item.article}</td>
                    <td>{item.code_compte}</td>
                    <td>{item.montant}</td>
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

export default EtatParFamilleDemandeur;
