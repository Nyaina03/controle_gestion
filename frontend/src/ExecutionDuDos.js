import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/EtatsAEtablir.css"; // Réutilisation des styles existants pour les tableaux
import "./css/FormPage.css"; // Comme classe de CSS

function ExecutionDuDos() {
  const [annee, setAnnee] = useState("");
  const [executionData, setExecutionData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowTable(false);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:8000/api/dos/execution_dos/?annee=${annee}`);
      if (!response.ok) {
        if (response.status === 404) {
          // Si aucune donnée trouvée, affiche un message convivial
          setError("Aucune donnée trouvée pour l'année sélectionnée.");
        } else {
          throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
        }
      } else {
        const data = await response.json();
        setExecutionData(data);
        setShowTable(data.length > 0); // Affiche le tableau uniquement s'il y a des données
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de la récupération des données.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Exécution du DOS</h2>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="annee">Choix de l'année :</label>
              <input
                id="annee"
                type="number"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                required // Validation automatique du navigateur
              />
            </div>

            <div className="button-group">
              <button type="submit" className="btn save-btn" disabled={loading}>
                {loading ? "Chargement..." : "OK"}
              </button>
            </div>
          </form>

          {/* Affichage des erreurs */}
          {error && <p className="error-message">{error}</p>}

          {/* Affiche le tableau uniquement si showTable est vrai */}
          {showTable && (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>REF DOS</th>
                  <th>N ENG</th>
                  <th>Compte</th>
                  <th>Libellé PTA</th>
                  <th>Montant PTA</th>
                  <th>Montant Dépense</th>
                </tr>
              </thead>
              <tbody>
                {executionData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.ref_dos}</td>
                    <td>{data.num_engagement}</td>
                    <td>{data.code_compte}</td>
                    <td>{data.libelle_pta}</td>
                    <td>{data.montant_pta.toLocaleString()}</td>
                    <td>{data.montant_depense.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExecutionDuDos;
