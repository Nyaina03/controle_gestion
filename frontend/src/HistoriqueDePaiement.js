import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/EtatsAEtablir.css"; // Réutilisation des styles existants pour les tableaux
import "./css/FormPage.css"; // Comme classe de CSS

function HistoriqueDePaiement() {
  const [anneeDebut, setAnneeDebut] = useState("");
  const [paiements, setPaiements] = useState([]);
  const [showTable, setShowTable] = useState(false);

  // Fonction pour récupérer les paiements depuis l'API Django
  const fetchPaiements = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/marches/historique_paiement/${anneeDebut}/`);
      const data = await response.json();
      setPaiements(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des paiements :", error);
    }
  };

  // Fonction pour générer les années dynamiquement
  const generateYears = (startYear) => {
    const years = [];
    for (let i = 0; i < 5; i++) {
      years.push(startYear + i);
    }
    return years;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowTable(true); // Affiche le tableau après soumission
    fetchPaiements(); // Récupérer les paiements à partir de l'API
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Historique de Paiement</h2>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="anneeDebut">Choix de l'année de départ :</label>
              <input
                id="anneeDebut"
                type="number"
                value={anneeDebut}
                onChange={(e) => setAnneeDebut(e.target.value)}
                required // Validation automatique du navigateur
              />
            </div>

            <div className="button-group">
              <button type="submit" className="btn save-btn">OK</button>
            </div>
          </form>

          {/* Affiche le tableau uniquement si showTable est vrai */}
          {showTable && anneeDebut && (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>Ville</th>
                  <th>N° Marché</th>
                  <th>Libellé</th>
                  <th>Montant du Marché</th>
                  {generateYears(Number(anneeDebut)).map((year, index) => (
                    <th key={index}>{year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(paiements).map(([ville, marcheList], villeIndex) =>
                  marcheList.map((paiement, index) => (
                    <tr key={`${villeIndex}-${index}`}>
                      <td>{ville}</td>
                      <td>{paiement.num_marche}</td>
                      <td>{paiement.libelle}</td>
                      <td>{paiement.montant_ht.toLocaleString()}</td>
                      {paiement.total_paiements.map((paiementAnnuel, idx) => (
                        <td key={idx}>{paiementAnnuel.toLocaleString()}</td>
                      ))}
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

export default HistoriqueDePaiement;
