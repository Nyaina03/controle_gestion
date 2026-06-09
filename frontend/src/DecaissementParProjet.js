import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/EtatsAEtablir.css";
import "./css/FormPage.css";

function DecaissementParProjet() {
  const [annee, setAnnee] = useState("");
  const [afficherTableau, setAfficherTableau] = useState(false);
  const [data, setData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAfficherTableau(true);

    // Appel de l'API pour récupérer les décaissements
    try {
      const response = await fetch(`http://localhost:8000/api/budget/decaissement_par_projet/${annee}/`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        console.error('Erreur lors de la récupération des données');
        setData([]);  // On vide les données en cas d'erreur
      }
    } catch (error) {
      console.error('Erreur réseau', error);
      setData([]);  // On vide les données en cas d'erreur réseau
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Décaissement par Projet</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="annee">Choix de l'année:</label>
              <input
                type="number"
                id="annee"
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

          {afficherTableau && (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>Compte</th>
                  <th>Libellé</th>
                  <th>Décaissement</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ color: "red", textAlign: "center" }}>
                      Aucune donnée disponible pour cette année.
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.compte}</td>
                      <td>{item.libelle}</td>
                      <td>{item.decaissement}</td>
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

export default DecaissementParProjet;
