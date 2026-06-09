import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './css/EtatsAEtablir.css'; // Réutilisation des styles existants
import './css/FormPage.css'; // Si nécessaire pour d'autres styles

function EtatParFamille() {
  const navigate = useNavigate();
  const [famille, setFamille] = useState('');
  const [annee, setAnnee] = useState('');
  const [afficherTableau, setAfficherTableau] = useState(false);
  const [famillesOptions, setFamillesOptions] = useState([]); // Nouveau state pour les familles
  const [donnees, setDonnees] = useState([]); // Nouveau state pour stocker les données de l'API

  // Fonction pour récupérer les familles depuis l'API
  useEffect(() => {
    const fetchFamilles = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/creationArticle/creation_article/');
        if (response.ok) {
          const data = await response.json();
          setFamillesOptions(data); // Met à jour la liste des familles dans l'état
        } else {
          console.error('Erreur lors de la récupération des familles');
        }
      } catch (error) {
        console.error('Erreur réseau:', error);
      }
    };

    fetchFamilles(); // Appeler la fonction pour récupérer les familles
  }, []);

  // Fonction pour appeler l'API pour récupérer les besoins par famille
  const fetchBesoinsParFamille = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/creationArticle/etat_par_famille/${annee}/${famille}/`);
      if (response.ok) {
        const data = await response.json();
        setDonnees(data); // Met à jour les données récupérées de l'API
        setAfficherTableau(true);
      } else {
        console.error('Erreur lors de la récupération des besoins par famille');
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchBesoinsParFamille(); // Appel API au submit
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">État des Besoins par Famille</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="famille">Choix de la famille:</label>
              <select
                id="famille"
                value={famille}
                onChange={(e) => setFamille(e.target.value)}
                required
              >
                <option value="">Sélectionner une famille</option>
                {famillesOptions.map((familleOption) => (
                  <option key={familleOption.code_famille} value={familleOption.code_famille}>
                    {familleOption.code_famille}-{familleOption.article}
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

          {/* Tableau qui s'affiche après avoir sélectionné une famille et une année */}
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
                {donnees.length > 0 ? (
                  donnees.map((item) => (
                    <tr key={item.code_article}>
                      <td>{item.code_article}</td>
                      <td>{item.article}</td>
                      <td>{item.quantite}</td>
                      <td>{item.pu}</td>
                      <td>{item.montant}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">Aucun besoin trouvé pour cette famille et cette année.</td>
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

export default EtatParFamille;
