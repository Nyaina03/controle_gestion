import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/FormPage.css"; // Réutilisation des styles existants

function StatistiqueParVille() {
  const [annee, setAnnee] = useState("");
  const [ville, setVille] = useState("");
  const [localites, setLocalites] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [afficherTableau, setAfficherTableau] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [statistiques, setStatistiques] = useState([]); // Stockage des données récupérées

  // Charger les localités
  useEffect(() => {
    fetch('http://localhost:8000/api/localites/villes/')
      .then(response => response.json())
      .then(data => setLocalites(data))
      .catch(error => console.error('Erreur lors du chargement des localités:', error));
  }, []);

  // Gestion du changement de l'année
  const handleAnneeChange = (e) => {
    setAnnee(e.target.value);
  };

  // Gestion du changement de la ville
  const handleVilleChange = (e) => {
    setVille(e.target.value);
  };

  // Fonction pour afficher le tableau après validation
  const handleAfficherTableau = (e) => {
    e.preventDefault();

    if (annee && ville && !isNaN(annee)) {
      setIsSubmitted(true);
      const anneeStart = parseInt(annee);
      const anneeRange = Array.from({ length: 5 }, (_, i) => anneeStart + i);
      setAnnees(anneeRange);
      setAfficherTableau(true);

      // Appel à l'API pour récupérer les données statistiques
      fetch(`http://localhost:8000/api/statistiqueBrutes/stat_par_ville/?annee_debut=${annee}&id_ville=${ville}`)
        .then(response => response.json())
        .then(data => {
          setStatistiques(data.data); // Stocker les données des statistiques dans l'état
        })
        .catch(error => console.error('Erreur lors de la récupération des statistiques:', error));
    } else {
      alert("Veuillez remplir tous les champs avec des données valides.");
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Statistique par Ville</h2>

          {/* Formulaire pour l'année et la ville */}
          <form onSubmit={handleAfficherTableau}>
            <div className="form-group">
              <label htmlFor="annee">Choix année Début:</label>
              <input
                type="number"
                id="annee"
                value={annee}
                onChange={handleAnneeChange}
                required
              />
            </div>

            {/* Sélection de la localité */}
            <div className="form-group">
              <label htmlFor="localite-select">Choix Ville:</label>
              <select
                id="localite-select"
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                required
              >
                <option value="">--Choisissez une localité--</option>
                {localites.map(localite => (
                  <option key={localite.id_ville} value={localite.id_ville}>
                    {localite.nom_ville}
                  </option>
                ))}
              </select>
            </div>

            {/* Bouton OK pour afficher le tableau */}
            <div className="button-group">
              <button type="submit" className="btn save-btn">
                OK
              </button>
            </div>
          </form>

          {/* Affichage du tableau après avoir cliqué sur OK */}
          {afficherTableau && (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>Code STAT</th>
                  <th>Libelle</th>
                  {annees.map((annee) => (
                    <th key={annee}>{annee}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Affichage dynamique des données récupérées */}
                {statistiques.map((statistique, index) => (
                  <tr key={index}>
                    <td>{statistique.code_stat}</td>
                    <td>{statistique.libelle_stat}</td>
                    {annees.map((annee, index) => (
                      <td key={index}>{statistique.quantites[index]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Message de confirmation après soumission */}
          {isSubmitted && !afficherTableau && (
            <p className="confirmation-message">
              Veuillez entrer une année valide et une ville pour afficher les statistiques.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatistiqueParVille;
