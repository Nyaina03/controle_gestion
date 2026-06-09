import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/FormPage.css"; // Réutilisation des styles existants

function EvoStatSur5() {
  const [anneeDebut, setAnneeDebut] = useState("");
  const [afficherTableau, setAfficherTableau] = useState(false);
  const [annees, setAnnees] = useState([]);
  const [data, setData] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Gestion du changement de l'année de début
  const handleAnneeDebutChange = (e) => {
    setAnneeDebut(e.target.value);
  };

  // Fonction pour afficher le tableau après validation
  const handleAfficherTableau = async (e) => {
    e.preventDefault();

    if (anneeDebut && !isNaN(anneeDebut)) {
      setIsSubmitted(true);
      setErrorMessage(""); // Réinitialiser les messages d'erreur
      try {
        const response = await fetch(
          `http://localhost:8000/api/statistiqueBrutes/evo_stat_sur_5/?annee_debut=${anneeDebut}`
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données.");
        }

        const result = await response.json();
        setAnnees(result.annees || []);
        setData(result.data || []);
        setAfficherTableau(true);
      } catch (error) {
        setErrorMessage(error.message);
        setAfficherTableau(false);
      }
    } else {
      setErrorMessage("Veuillez entrer une année valide.");
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Evolution Statistique sur 5 ans</h2>

          {/* Formulaire pour l'année de début */}
          <form onSubmit={handleAfficherTableau}>
            <div className="form-group">
              <label htmlFor="anneeDebut">Choix année début :</label>
              <input
                type="number"
                id="anneeDebut"
                value={anneeDebut}
                onChange={handleAnneeDebutChange}
                required
              />
            </div>

            {/* Bouton OK pour afficher le tableau */}
            <div className="button-group">
              <button type="submit" className="btn save-btn">
                OK
              </button>
            </div>
          </form>

          {/* Affichage des erreurs */}
          {errorMessage && (
            <p className="error-message">{errorMessage}</p>
          )}

          {/* Affichage du tableau après avoir cliqué sur OK */}
          {afficherTableau && (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>Code Stat</th>
                  <th>Libelle STAT</th>
                  {annees.map((annee) => (
                    <th key={annee}>{annee}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.code_stat}>
                    <td>{row.code_stat}</td>
                    <td>{row.libelle_stat}</td>
                    {row.quantites.map((quantite, index) => (
                      <td key={index}>{quantite}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Message de confirmation après soumission */}
          {isSubmitted && !afficherTableau && !errorMessage && (
            <p className="confirmation-message">
              Veuillez entrer une année valide pour voir les données.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EvoStatSur5;
