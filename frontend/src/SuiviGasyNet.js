import React, { useState, useEffect } from 'react';
import './css/Sidebar.css';
import './css/FormPage.css'; // Reusing SaisieBudget's CSS for consistency
import './css/EtatsAEtablir.css';
import Sidebar from "./Sidebar";
import Header from "./Header";

function SuiviGasyNet() {
  const [showMonthlyTable, setShowMonthlyTable] = useState(false);
  const [show5YearTable, setShow5YearTable] = useState(false);
  const [comptes, setComptes] = useState([]);
  const [selectedCompte, setSelectedCompte] = useState(null);
  const [monthlyYear, setMonthlyYear] = useState('');
  const [monthlyTVA, setMonthlyTVA] = useState('');
  const [localites, setLocalites] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [error, setError] = useState(null);
  const [yearStart, setYearStart] = useState('');
  const [yearTVA, setYearTVA] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [fiveYearData, setFiveYearData] = useState({});
  const [evolutionData, setEvolutionData] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const comptesResponse = await fetch('http://localhost:8000/api/comptes/comptes/');
        const comptesData = await comptesResponse.json();
        const filteredComptes = comptesData.filter(compte => compte.id_compte === 1 || compte.id_compte === 2);
        setComptes(filteredComptes);

        const villesResponse = await fetch('http://localhost:8000/api/localites/villes/');
        const villesData = await villesResponse.json();
        setLocalites(villesData);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleMonthlySubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedCompte) {
      setError("Veuillez sélectionner un compte.");
      return;
    }

    setLoading(true); // Start loading spinner when form is submitted
    setShowMonthlyTable(false); // Hide table while loading

    try {
      const monthlyResults = await Promise.all(
        localites.map(async (ville) => {
          const monthlyTotals = await Promise.all(
            Array.from({ length: 12 }, (_, i) => getMonthlyTotal(ville.id_ville, i + 1))
          );
          const annualTotal = monthlyTotals.reduce((sum, total) => sum + (total || 0), 0);
          return { ville: ville.nom_ville, monthlyTotals, annualTotal };
        })
      );
      setMonthlyData(monthlyResults);
      setShowMonthlyTable(true); // Show table after data is fetched
    } catch (err) {
      setError('Erreur lors de la récupération des données mensuelles.');
      console.error(err);
    } finally {
      setLoading(false); // Stop loading spinner when data is loaded
    }
  };

  const getMonthName = (monthNumber) => {
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return monthNames[monthNumber - 1];
  };


  const getMonthlyTotal = async (villeId, month) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/recetteGasynet/recetteGasynet/?annee=${monthlyYear}&localite=${villeId}&tva=${monthlyTVA}&compte=${selectedCompte}`
      );
      const data = await response.json();
      const monthName = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
      ][month - 1];
      return parseFloat(data.mois[monthName]) || 0;
    } catch (err) {
      console.error(err);
      return 0;
    }
  };
  
 

  const calculateGrandTotal = () => {
    const grandTotal = Array(12).fill(0);
    monthlyData.forEach(({ monthlyTotals }) =>
      monthlyTotals.forEach((total, index) => {
        if (typeof total === 'number' && !isNaN(total)) {
          grandTotal[index] += total;
        }
      })
    );
    return grandTotal;
  }

  const grandTotal = calculateGrandTotal();


  const handle5YearSubmit = async (e) => {
    e.preventDefault();
  
    if (!yearStart || !yearTVA || !location) {
      console.error("Tous les champs doivent être remplis.");
      return;
    }
  
    console.log("Requête à l'API avec ces paramètres:");
    console.log("Année Début:", yearStart);
    console.log("TVA:", yearTVA);
    console.log("Localisation:", location);
  
    try {
      const response = await fetch(
        `http://localhost:8000/api/recetteGasynet/recetteGasynet/evolution/?annee_debut=${yearStart}&tva=${yearTVA}&localite=${location}`
      );
  
      if (response.ok) {
        const data = await response.json();
        console.log("Données reçues:", data);
  
        // Générer dynamiquement les années
        const years = Array.from({ length: 5 }, (_, i) => parseInt(yearStart) + i);
  
        // Structurer les données
        const completedData = years.map((year) => ({
          year,
          RFM: data[year]?.RFM || 0,
          DSM: data[year]?.DSM || 0,
        }));
  
        setEvolutionData(completedData); // Mise à jour des données
        setShow5YearTable(true); // Affiche le tableau
      } else {
        console.error("Erreur lors de la récupération des données:", response.statusText);
      }
    } catch (error) {
      console.error("Erreur de requête:", error);
    }
  };
  
  
  
  // Fonction pour rendre le tableau des évolutions sur 5 ans
  const renderEvolutionTable = () => {
    if (!evolutionData || evolutionData.length === 0) {
      return <div>Chargement...</div>;
    }
  
    const years = Array.from({ length: 5 }, (_, i) => parseInt(yearStart) + i);
  
    return (
      <table className="tiers-table">
        <thead>
          <tr>
            <th>Nature Prestation</th>
            {years.map((year) => (
              <th key={year}>{year}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>RFM</td>
            {years.map((year) => {
              const value = evolutionData.find((data) => data.year === year)?.RFM || 0;
              return <td key={`rfm-${year}`}>{value}</td>;
            })}
          </tr>
          <tr>
            <td>DSM</td>
            {years.map((year) => {
              const value = evolutionData.find((data) => data.year === year)?.DSM || 0;
              return <td key={`dsm-${year}`}>{value}</td>;
            })}
          </tr>
        </tbody>
      </table>
    );
  };
  
  
  

  
  

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Suivi Gasy Net - Évolution Mensuelle des Recettes</h2>
          <form onSubmit={handleMonthlySubmit} className="form">
            <div className="form-group">
              <label htmlFor="annualInput">Année:</label>
              <input
                type="number"
                id="annualInput"
                value={monthlyYear}
                onChange={(e) => setMonthlyYear(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="compte-select">Compte:</label>
              <select
                id="compte-select"
                value={selectedCompte || ''}
                onChange={(e) => setSelectedCompte(e.target.value)}
                required
              >
                <option value="">--Choisissez un compte--</option>
                {comptes.map((compte) => (
                  <option key={compte.id_compte} value={compte.id_compte}>
                    {compte.code} - {compte.libelle}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="monthlyTVA">TVA:</label>
              <select id="monthlyTVA" value={monthlyTVA} onChange={(e) => setMonthlyTVA(e.target.value)} required>
                <option value="">--Choisissez--</option>
                <option value="avec">Avec</option>
                <option value="sans">Sans</option>
              </select>
            </div>
            <div className="button-group">
              <button type="submit" className="btn save-btn">OK</button>
            </div>
          </form>

          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div> {/* Spinner affiché pendant le chargement */}
            </div>
          )}

          {showMonthlyTable && !loading && monthlyData.length > 0 && (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>Localité</th>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <th key={month}>{getMonthName(month)}</th>
                  ))}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map(({ ville, monthlyTotals, annualTotal }) => (
                  <tr key={ville}>
                    <td>{ville}</td>
                    {monthlyTotals.map((total, index) => (
                      <td key={index}>{total !== null && total !== undefined ? total : 0}</td>
                    ))}
                    <td>{annualTotal}</td>
                  </tr>
                ))}
                <tr>
                  <td><strong>Total</strong></td>
                  {grandTotal.map((total, index) => (
                    <td key={index}>
                      {typeof total === 'number' ? total.toFixed(2) : 0.00}  {/* Vérification que 'total' est bien un nombre */}
                    </td>
                  ))}

                  <td>{grandTotal.reduce((sum, total) => sum + total, 0).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>



      {/* 5-Year Evolution Section */}
      <div className="form-container">
  <h2 className="div-h2">Tableau d'Évolution sur 5 ans</h2>
  <form onSubmit={handle5YearSubmit} className="form">
    <div className="form-group">
      <label htmlFor="yearStart">Année Début:</label>
      <input
        type="number"
        id="yearStart"
        value={yearStart}
        onChange={(e) => setYearStart(e.target.value)}
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="yearTVA">TVA:</label>
      <select
        id="yearTVA"
        value={yearTVA}
        onChange={(e) => setYearTVA(e.target.value)}
        required
      >
        <option value="">--Choisissez--</option>
        <option value="avec">Avec</option>
        <option value="sans">Sans</option>
      </select>
    </div>
    <div className="form-group">
      <label htmlFor="location">Localisation:</label>
      <select
        id="location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      >
        <option value="">--Choisissez--</option>
        {localites.map((localite) => (
          <option key={localite.id_ville} value={localite.id_ville}>
            {localite.nom_ville}
          </option>
        ))}
      </select>
    </div>

    <div className="button-group">
      <button type="submit" className="btn save-btn">OK</button>
    </div>
  </form>

  {/* Afficher le tableau d'évolution après la soumission */}
  {show5YearTable && (
    <div>
      
      {renderEvolutionTable()} {/* Appel de la fonction pour afficher le tableau */}
    </div>
  )}

  {error && <p>{error}</p>}
</div>



  </div>
</div>
      
    
  );
}

export default SuiviGasyNet;
