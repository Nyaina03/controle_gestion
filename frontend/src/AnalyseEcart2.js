import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/EtatsAEtablir.css"; // Réutilisation des styles existants pour les tableaux
import "./css/FormPage.css"; // Comme classe de CSS

function AnalyseEcart2() {
  const [annee, setAnnee] = useState("");
  const [analyses, setAnalyses] = useState([]);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    if (showTable && annee) {
      // Récupération des données depuis le backend
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/marches/analyse_des_ecarts/${annee}/`);
          if (response.ok) {
            const data = await response.json();
            setAnalyses(data);
          } else {
            console.error("Erreur lors de la récupération des données.");
            setAnalyses([]); // Vide les analyses en cas d'erreur
          }
        } catch (error) {
          console.error("Erreur de connexion :", error);
          setAnalyses([]); // Vide les analyses en cas d'erreur
        }
      };

      fetchData();
    }
  }, [showTable, annee]); // Le tableau de dépendances inclut showTable et annee

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowTable(true); // Affiche le tableau après soumission
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Analyse des Écarts</h2>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="annee">Choix de l'année :</label>
              <input
                id="annee"
                type="number"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                required
              />
            </div>

            <div className="button-group">
              <button type="submit" className="btn save-btn">
                OK
              </button>
            </div>
          </form>

          {/* Affiche le tableau uniquement si showTable est vrai */}
          {showTable && annee && (
            <>
              {/* Si aucune donnée, affiche un message en rouge */}
              {analyses.length === 0 ? (
                <div style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
                  Aucune donnée ne correspond à l'année saisie.
                </div>
              ) : (
                <table className="tiers-table">
                  <thead>
                    <tr>
                      <th>Compte</th>
                      <th>Projet</th>
                      <th>N° Marché</th>
                      <th>Budget/PTA</th>
                      <th>Réalisation/ Marché</th>
                      <th>Écart</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Lignes du tableau */}
                    {analyses.map((analyse, index) => (
                      <tr key={index}>
                        <td>{analyse.compte}</td>
                        <td>{analyse.projet}</td>
                        <td>{analyse.num_marche}</td>
                        <td>{analyse.budget_pta}</td>
                        <td>{analyse.realisation_marche}</td>
                        <td>
                          {analyse.ecart}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyseEcart2;
