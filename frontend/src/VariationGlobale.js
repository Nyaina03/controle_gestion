import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/EtatsAEtablir.css"; // Réutilisation des styles existants
import "./css/FormPage.css"; // Si des styles supplémentaires sont nécessaires

function VariationGlobale() {
  // Données statiques pour démonstration (peuvent être remplacées par des données dynamiques)
  const donnees = [
    { rubrique: "Investissement", modifMoins: 5000, modifPlus: 2000 },
    { rubrique: "Fonctionnement", modifMoins: 10000, modifPlus: 8000 },
    { rubrique: "Personnel", modifMoins: 3000, modifPlus: 4000 },
  ];

  // Ajout des calculs pour la colonne Total
  const donneesAvecTotal = donnees.map((ligne) => ({
    ...ligne,
    total: ligne.modifPlus - ligne.modifMoins,
  }));

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Variation Globale</h2>

          <table className="tiers-table">
            <thead>
              <tr>
                <th>Rubrique</th>
                <th>MODIF(-)</th>
                <th>MODIF(+)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {donneesAvecTotal.map((ligne, index) => (
                <tr key={index}>
                  <td>{ligne.rubrique}</td>
                  <td>{ligne.modifMoins.toLocaleString()}</td>
                  <td>{ligne.modifPlus.toLocaleString()}</td>
                  <td
                    style={{
                      color: ligne.total < 0 ? "red" : "green", // Rouge si négatif, vert si positif
                    }}
                  >
                    {ligne.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default VariationGlobale;
