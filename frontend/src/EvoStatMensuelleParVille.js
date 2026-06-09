import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/FormPage.css"; // Réutilisation des styles existants

function EvoStatMensuelleParVille() {
  const [annee, setAnnee] = useState("");
  const [ville, setVille] = useState("");
  const [localites, setLocalites] = useState([]);
  const [mois, setMois] = useState([]);
  const [data, setData] = useState([]); // Ajouter un état pour les données récupérées
  const [afficherTableau, setAfficherTableau] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Charger les localités
    fetch('http://localhost:8000/api/localites/villes/')
      .then(response => response.json())
      .then(data => setLocalites(data))
      .catch(error => console.error('Erreur lors du chargement des localités:', error));
  }, []);

  // Fonction pour récupérer les statistiques mensuelles depuis l'API
  const fetchData = () => {
    fetch(`http://localhost:8000/api/statistiqueBrutes/evo_stat_mensuelle_par_ville/?annee_debut=${annee}&id_ville=${ville}`)
      .then(response => response.json())
      .then(data => {
        setData(data); // Mettre à jour l'état avec les données récupérées
        setAfficherTableau(true); // Afficher le tableau après la récupération des données
      })
      .catch(error => console.error('Erreur lors de la récupération des données:', error));
  };

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
      setMois([
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
      ]);
      fetchData(); // Appeler la fonction fetchData pour récupérer les statistiques
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
          <h2 className="div-h2">Evolution Statistique Mensuelle par Ville</h2>

          {/* Formulaire pour l'année et la ville */}
          <form onSubmit={handleAfficherTableau}>
            <div className="form-group">
              <label htmlFor="annee">Choix année :</label>
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
                onChange={handleVilleChange}
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
                  <th>Code Stat</th>
                  <th>Libelle STAT</th>
                  {mois.map((mois, index) => (
                    <th key={index}>{mois}</th>
                  ))}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {/* Boucle à travers les données récupérées de l'API */}
                {data.map((stat, index) => (
                  <tr key={index}>
                    {/* Affichage de code_stat.code_stat (chaîne de caractères) */}
                    <td>{stat.code_stat && stat.code_stat.code_stat ? stat.code_stat.code_stat : 'N/A'}</td>

                    {/* Affichage de libelle_stat (chaîne de caractères) */}
                    <td>{stat.libelle_stat || 'N/A'}</td>

                    {/* Affichage des données mensuelles */}
                    {stat.mois_data && Array.isArray(stat.mois_data) ? (
                      stat.mois_data.map((quantite, moisIndex) => (
                        <td key={moisIndex}>{quantite}</td>
                      ))
                    ) : (
                      <td colSpan={mois.length}>Aucune donnée</td>
                    )}

                    {/* Calcul du total */}
                    <td>{stat.mois_data ? stat.mois_data.reduce((total, current) => total + current, 0) : 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Message de confirmation après soumission */}
          {isSubmitted && !afficherTableau && (
            <p className="confirmation-message">
              Veuillez entrer une année valide et une ville pour afficher les statistiques mensuelles.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EvoStatMensuelleParVille;
