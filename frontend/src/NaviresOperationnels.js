import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/FormPage.css";

function NaviresOperationnels() {
  const [annee, setAnnee] = useState("");
  const [data, setData] = useState([]);
  const [afficherTableau, setAfficherTableau] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [localite, setLocalite] = useState('');
  const [localites, setLocalites] = useState([]);
 

  useEffect(() => {
    // Charger les localités
    fetch('http://localhost:8000/api/localites/villes/')
      .then(response => response.json())
      .then(data => setLocalites(data))
      .catch(error => console.error('Erreur lors du chargement des localités:', error));

  }, []);

  // Fonction pour gérer le changement de l'année
  const handleAnneeChange = (e) => {
    setAnnee(e.target.value);
  };

  // Fonction pour gérer le changement de la localité
  const handleLocalitesChange = (e) => {
    setLocalites(e.target.value);
  };

  // Fonction pour afficher le tableau après validation
  const handleAfficherTableau = async (e) => {
    e.preventDefault();

    if (annee && localites) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/statistiqueBrutes/navires_operationnels/?annee=${annee}&id_ville=${localite}`
        );

        if (!response.ok) {
          throw new Error(`Erreur API : ${response.statusText}`);
        }

        const result = await response.json();
        setData(result); // Stocke les données dans l'état
        setIsSubmitted(true);
        setAfficherTableau(true);
      } catch (error) {
        console.error("Erreur lors de l'appel de l'API :", error);
        alert("Erreur lors de la récupération des données.");
      }
    } else {
      alert("Veuillez remplir tous les champs.");
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Navires Opérationnels</h2>

          {/* Formulaire pour l'année et localités */}
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
              <label htmlFor="localite-select">Localité:</label>
              <select
                id="localite-select"
                value={localite}
                onChange={(e) => setLocalite(e.target.value)}
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
                  <th>Port / Localité</th>
                  <th>Nom du Navire</th>
                  <th>Nombre d'escales</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.nom_ville}</td>
                      <td>{item.navire}</td>
                      <td>{item.nombre_escales}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">Aucune donnée disponible</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* Message de confirmation après soumission */}
          {isSubmitted && !afficherTableau && (
            <p className="confirmation-message">
              Veuillez entrer tous les champs correctement pour afficher les
              navires opérationnels.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default NaviresOperationnels;
