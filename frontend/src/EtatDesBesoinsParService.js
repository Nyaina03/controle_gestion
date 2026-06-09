import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './css/EtatsAEtablir.css'; // Réutilisation des styles existants
import './css/FormPage.css';

function EtatDesBesoinsParService() {
  const navigate = useNavigate();
  const [selectedDirection, setSelectedDirection] = useState('');
  const [direction, setDirection] = useState([]);
  const [annee, setAnnee] = useState('');
  const [afficherTableau, setAfficherTableau] = useState(false);
  const [besoins, setBesoins] = useState([]); // Nouveau state pour stocker les besoins

  // Charger les directions au démarrage du composant
  useEffect(() => {
    fetch('http://localhost:8000/api/direction/liste_direction/')
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched:', data); // Check API response
        setDirection(data);
      })
      .catch(error => console.error('Erreur lors de la chargement des directions:', error));
  }, []);

  // Fonction pour récupérer les besoins par service de l'API
  const fetchBesoinsParService = () => {
    const url = `http://localhost:8000/api/creationArticle/etat_besoin_par_service/${annee}/${selectedDirection}/`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched from EtatBesoinParService:', data); // Check API response
        setBesoins(data); // Mettre à jour le state avec les besoins
      })
      .catch(error => console.error('Erreur lors de la récupération des besoins:', error));
  };

  // Gérer l'envoi du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchBesoinsParService(); // Appeler l'API pour récupérer les besoins
    setAfficherTableau(true); // Afficher le tableau
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">État des Besoins par Service</h2>

          <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="direction">Choix du service:</label>
                <select
                  id="direction-select"
                  value={selectedDirection}
                  onChange={(e) => setSelectedDirection(parseInt(e.target.value))} // Convertir en entier
                  required
                >
                  <option value="">--Choisissez un service--</option>
                  {direction.map((d) => (
                    <option key={d.id_direction} value={d.id_direction}>
                      {d.nom_direction}
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
                  <th>Code Article</th>
                  <th>Désignation</th>
                  <th>Quantité</th>
                  <th>PU</th>
                  <th>Montant</th>
                </tr>
              </thead>
              <tbody>
                {/* Dynamically render the rows based on fetched data */}
                {besoins.length > 0 ? (
                  besoins.map((besoin) => (
                    <tr key={besoin.id_besoin_par_service}>
                      <td>{besoin.code_article}</td>
                      <td>{besoin.article}</td>
                      <td>{besoin.quantite}</td>
                      <td>{besoin.pu}</td>
                      <td>{(besoin.quantite * besoin.pu).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">Aucun besoin trouvé pour cette année et direction.</td>
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

export default EtatDesBesoinsParService;
