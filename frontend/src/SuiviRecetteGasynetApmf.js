import React, { useState, useEffect } from 'react';
import './css/Sidebar.css';
import './css/FormPage.css';
import './css/EtatsAEtablir.css';
import Sidebar from './Sidebar';
import Header from './Header';

function SuiviRecetteGasynetApmf() {
  const [recetteGlobaleTable, setRecetteGlobaleTable] = useState(false);
  const [analyseTable, setAnalyseTable] = useState(false);
  const [ecartTable, setEcartTable] = useState(false);

  const [monthlyYear, setMonthlyYear] = useState('');
  const [compte, setCompte] = useState('');
  const [localite, setLocalite] = useState('');
  const [yearStart, setYearStart] = useState('');
  const [tva, setTVA] = useState('');
  const [tvaAnalyse, setTvaAnalyse] = useState('');
  const [comptes, setComptes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [anneeDebut, setAnneeDebut] = useState('');
  const [anneeDebutAnalyse, setAnneeDebutAnalyse] = useState('');
  const [anneeEcart, setAnneeEcart] = useState('');
  const [tvaEcart, setTvaEcart] = useState('');

  const [recetteGlobale, setRecetteGlobale] = useState([]);

  const [ecartData, setEcartData] = useState([]);


  

  const generateYears = (startYear) => {
    const start = parseInt(startYear, 10);
    return [start, start + 1, start + 2, start + 3, start + 4];
  };
  
  const years = generateYears(anneeDebut);
  
 

  const handleEvolutionGlobaleSubmit = (event) => {
    event.preventDefault();
  
    fetch(`http://localhost:8000/api/recetteGasynetApmf/etat-global/?anneeDebut=${anneeDebut}&tva=${tva}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Données reçues :", data); // Vérifiez ici
      setRecetteGlobaleTable(data);
    })
    .catch((error) => console.error("Erreur lors de la récupération des données :", error));
  
  };
  useEffect(() => {
    // Charger les localités
    fetch('http://localhost:8000/api/localites/villes/')
      .then(response => response.json())
      .then(data => setLocalite(data))
      .catch(error => console.error('Erreur lors du chargement des localités:', error));

    // Charger les comptes
    fetch('http://localhost:8000/api/comptes/comptes/')
      .then(response => response.json())
      .then(data => setComptes(data))
      .catch(error => console.error('Erreur lors du chargement des comptes:', error));
  }, []);
  
  useEffect(() => {
    if (anneeDebutAnalyse && tvaAnalyse) {
      // Appel API lorsque les champs nécessaires sont remplis
      setLoading(true);
      setError(null);

      const fetchData = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/api/recetteGasynetApmf/analyse_des_ecarts/?anneeDebutAnalyse=${anneeDebutAnalyse}&tvaAnalyse=${tvaAnalyse}`
          );
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données.");
          }
          const data = await response.json();
          setAnalyseTable(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [anneeDebutAnalyse, tvaAnalyse, comptes]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Le formulaire déclenche l'effet pour appeler l'API
  };

  const generateYears2 = (startYear) => {
    const start = parseInt(startYear, 10);
    return [start, start + 1, start + 2, start + 3, start + 4];
  };
  
  const years2 = generateYears2(anneeDebutAnalyse);
  
 

  const handleEcartSubmit = async (event) => {
    event.preventDefault();
    setRecetteGlobaleTable(false);
    setAnalyseTable(false);
    setEcartTable(false); // Cache le tableau pendant le chargement
  
    try {
      const response = await fetch(
        `http://localhost:8000/api/recetteGasynetApmf/ecart_annuel/?anneeEcart=${anneeEcart}&tvaEcart=${tvaEcart}`,
        {
          method: "GET", // Utilisez GET
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données.");
      }
  
      const data = await response.json();
      setEcartData(data); // Stocke les données récupérées
      setEcartTable(true); // Affiche le tableau avec les nouvelles données
    } catch (error) {
      console.error(error);
      alert("Une erreur s'est produite lors de la récupération des données.");
    }
  };
  

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />

        {/* Evolution Globale des recettes  sur 5 Ans */}
        <div className="form-container">
          <h2 className="div-h2">EVOLUTION GLOBALE DES RECETTES SUR 5 ANS</h2>
          <form onSubmit={handleEvolutionGlobaleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="anneeDebut">Année Début:</label>
              <input
                type="number"
                id="anneeDebut"
                value={anneeDebut}
                onChange={(e) => setAnneeDebut(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tva">TVA:</label>
              <select
                id="tva"
                value={tva}
                onChange={(e) => setTVA(e.target.value)}
                required
              >
                <option value="">Choisissez</option>
                <option value="avec">Avec</option>
                <option value="sans">Sans</option>
              </select>
            </div>

            <div className="button-group">
              <button type="submit" className="btn save-btn">OK</button>
            </div>
          </form>

          {recetteGlobaleTable && (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>Compte</th>
                  <th>Libellé</th>
                  {years.map((year) => (
                    <th key={year}>{year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recetteGlobaleTable.map((row, index) => (
                  <tr key={index}>
                    <td>{row.compte}</td>
                    <td>{row.libelle}</td>
                    {years.map((year) => (
                      <td key={year}>{row[year] !== undefined ? row[year] : 0}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2" style={{ fontWeight: "bold" }}>Total</td>
                  {years.map((year) => {
                    const total = recetteGlobaleTable.reduce(
                      (sum, row) => sum + (parseFloat(row[year]) || 0),
                      0
                    );
                    return <td key={year} style={{ fontWeight: "bold" }}>{total.toFixed(2)}</td>;
                  })}
                </tr>
              </tfoot>
            </table>
          )}

        </div>


        {/* Analyse des écarts */}
        <div className="form-container">
      <h2 className="div-h2">ANALYSE DES ECARTS</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="anneeDebutnalyseA">Année Début:</label>
          <input
            type="number"
            id="anneeDebutAnalyse"
            value={anneeDebutAnalyse}
            onChange={(e) => setAnneeDebutAnalyse(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tvaAnalyse">TVA:</label>
          <select
            id="tvaAnalyse"
            value={tvaAnalyse}
            onChange={(e) => setTvaAnalyse(e.target.value)}
            required
          >
            <option value="">Choisissez</option>
            <option value="avec">Avec</option>
            <option value="sans">Sans</option>
          </select>
        </div>

        <div className="button-group">
          <button type="submit" className="btn save-btn">OK</button>
        </div>
      </form>

      {error && <p className="error-message">{error}</p>}

      {analyseTable.length > 0 && (
  <table className="tiers-table">
    <thead>
      <tr>
        <th></th>
        <th>Compte</th>
        <th>Libellé</th>
        {generateYears2(anneeDebutAnalyse).map((year) => (
          <th key={year}>{year}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {analyseTable.map((entry, index) => (
        <React.Fragment key={index}>
          <tr>
            <td>PREVISION</td>
            <td>{entry.compte.code}</td>
            <td>{entry.compte.libelle}</td>
            {entry.annees.map((yearData, idx) => (
              <td key={idx}>{yearData.prevision}</td>
            ))}
          </tr>
          <tr>
            <td>REALISATION</td>
            <td>{entry.compte.code}</td>
            <td>{entry.compte.libelle}</td>
            {entry.annees.map((yearData, idx) => (
              <td key={idx}>{yearData.realisation}</td>
            ))}
          </tr>
          <tr>
            <td>ECART</td>
            <td>{entry.compte.code}</td>
            <td>{entry.compte.libelle}</td>
            {entry.annees.map((yearData, idx) => (
              <td key={idx}>{yearData.ecart}</td>
            ))}
          </tr>
          <tr>
            <td>TAUX DE REALISATION</td>
            <td>{entry.compte.code}</td>
            <td>{entry.compte.libelle}</td>
            {entry.annees.map((yearData, idx) => (
              <td key={idx}>{yearData.taux_realisation}%</td>
            ))}
          </tr>
          <tr></tr>
          <p>----------------------------------</p>
        </React.Fragment>
      ))}
    </tbody>
  </table>
)}

    </div>

      {/* Ecart annuel */}
        <div className="form-container">
          <h2 className="div-h2">ECART ANNUEL</h2>
          <form onSubmit={handleEcartSubmit} className="form">
          <div className="form-group">
            <label htmlFor="anneeEcart">Choix de l'année:</label>
            <input
              type="number"
              id="anneeEcart"
              value={anneeEcart}
              onChange={(e) => setAnneeEcart(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tvaEcart">TVA:</label>
            <select
              id="tvaEcart"
              value={tvaEcart}
              onChange={(e) => setTvaEcart(e.target.value)}
              required
            >
              <option value="">Choisissez</option>
              <option value="avec">Avec</option>
              <option value="sans">Sans</option>
            </select>
        </div>

            <div className="button-group">
              <button type="submit" className="btn save-btn">OK</button>
            </div>
          </form>

          {ecartTable && (
          <table className="tiers-table">
            <thead>
              <tr>
                <th>Compte</th>
                <th>Libellé</th>
                <th>Prévision</th>
                <th>Réalisation</th>
                <th>Ecart</th>
                <th>Taux de réalisation</th>
              </tr>
            </thead>
            <tbody>
              {ecartData.length > 0 ? (
                ecartData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.compte.code}</td> {/* Utilisez libelle ou une autre propriété */}
                    <td>{item.compte.libelle}</td> {/* Utilisez libelle ou une autre propriété */}
                    <td>{item.annees[0].prevision}</td>
                    <td>{item.annees[0].realisation}</td>
                    <td>{item.annees[0].ecart}</td>
                    <td>{item.annees[0].taux_realisation}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Aucun résultat disponible.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}


        </div>

      </div>
    </div>
  );
}

export default SuiviRecetteGasynetApmf;
