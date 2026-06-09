import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/EtatsAEtablir.css"; // Réutilisation des styles existants
import "./css/FormPage.css"; // Si nécessaire pour d'autres styles spécifiques
import "./css/TableauEquilibreFinancier.css"; // Styles pour le tableau

function TableauEquilibreFinancier() {
  const [annee, setAnnee] = useState("");
  const [revenue, setRevenue] = useState("");
  const [investment_expenses,  setInvestmentExpenses] = useState("");
  const [operating_expenses, setOperatingExpenses] = useState("");
  const [adjustments, setAdjustments] = useState("");
  const [total_expenses, seTotal_expenses] = useState("");
  const [balance, setBalance] = useState("");
  const [rec_dep_positif, setRec_dep_positif] = useState("");
  const [rec_dep_negatif, setRec_dep_negatif] = useState("");
  const [solde, seTSolde] = useState("");
  const [tableauData, setTableauData] = useState(null);
  const [afficherTableau, setAfficherTableau] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAfficherTableau(false);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8000/api/budget/tableau_equilibre_financier/?annee=${annee}`
      );
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const data = await response.json();
      setTableauData(data);
      setAfficherTableau(true);
    } catch (err) {
      setError("Impossible de charger les données. Veuillez réessayer.");
      console.error(err);
    }
  };

  const handleExportClick = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/budget/export_pdf/', {
        method: 'POST',  // Utilisez POST ici
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          annee: annee,  // Passer l'année ou d'autres données nécessaires à l'API
          revenue : revenue,
          investment_expenses : investment_expenses,
          operating_expenses : operating_expenses,
          adjustments : adjustments,
          total_expenses : total_expenses,
          balance : balance,
          rec_dep_positif : rec_dep_positif,
          rec_dep_negatif : rec_dep_negatif,
          solde : solde
        }),
      });
  
      if (response.ok) {
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'tableau_equilibre_financier.pdf';
        link.click();
      } else {
        console.error('Erreur lors de l\'exportation du PDF');
      }
    } catch (error) {
      console.error('Erreur de connexion à l\'API:', error);
    }
  };
  

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Tableau d'Équilibre Financier</h2>

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

          {error && <p className="error-message">{error}</p>}

          {afficherTableau && tableauData && (
            <div>
              <table className="tableau-equilibre">
                <thead>
                  <tr>
                    <th>Compte</th>
                    <th>Dépenses</th>
                    <th>Montant</th> 
                    <th>Compte</th>
                    <th>Recettes</th>
                    <th>Montant</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {tableauData.depenses_fonctionnement.map((depense, index) =>(
                    <td>{depense.code}</td>))
                      }
                    
                    <td>Sous-total dépenses</td>
                    <td className="total-cl6">{tableauData.total_expenses}</td>
                    <td>Classe 2</td>
                    <td>Sous-total recettes</td>
                    <td className="total-cl7">{tableauData.revenue}</td>
          
                  </tr>
                  <tr>
                    <td></td>
                    <td>Excédent prévisionnel</td>
                    <td className="rec-dep-positif">{tableauData.rec_dep_positif}</td>
                    <td></td>
                    <td>Déficit prévisionnel</td>
                    <td className="rec-dep-negatif">{tableauData.rec_dep_negatif}</td>
                  </tr>
                  <tr>
                  {tableauData.depenses_investissemt.map((depense, index) =>(
                    <td>{depense.code}</td>))
                      }
                     
                    
                    <td>Total des dépenses d'invest</td>
                    <td>{tableauData.investment_expenses}</td>
                    
                      
                       
                    <td>Total des recettes d'invest</td>
                    <td>Classe 1</td>
                    <td>{tableauData.balance}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Apport aux fonds de roulement</td>
                    <td className="tdi-positif">{tableauData.solde}</td>
                    <td></td>
                    <td>Prélèvement sur fonds de roulement</td>
                    <td className="tdi-negatif">{tableauData.adjustments}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="totaux-egaux">
                      Totaux égaux en recettes et dépenses (1) + (2)
                    </td>
                    <td colSpan="2" className="totaux-egaux"></td>
                  </tr>
                  <tr>
                    <td>Total brut des dépenses</td>
                    <td>(1) + (2)</td>
                    <td>{tableauData.total_expenses}</td>
                    <td>Total brut des recettes</td>
                    <td>(1) + (2)</td>
                    <td>{tableauData.revenue}</td>
                  </tr>
                </tbody>
              </table>

              {/* Afficher le bouton Export PDF seulement si le tableau est affiché */}
              <div className="button-group">
                <button type="button" className="btn save-btn" onClick={handleExportClick}>
                  Export PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TableauEquilibreFinancier;
