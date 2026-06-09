import React, { useState, useEffect } from 'react';
import './css/Sidebar.css';
import './css/FormPage.css'; // Reusing SaisieBudget's CSS for consistency
import './css/EtatsAEtablir.css';
import Sidebar from './Sidebar';
import Header from './Header';

function SuiviRecetteApmf_Evolution() {
  const [recetteGlobaleTable, setRecetteGlobaleTable] = useState(true);
  const [evolutionMensuelleTable, setEvolutionMensuelleTable] = useState(true);
  const [recetteParVilleTable, setRecetteParVilleTable] = useState(false);
  const [recetteParCompteTable, setRecetteParCompteTable] = useState(false);

  const [monthlyYear, setMonthlyYear] = useState('');
  const [showMonthlyTable, setShowMonthlyTable] = useState(false);
  const [showMonthlyTableParCompte, setShowMonthlyTableParCompte] = useState(false);
  const [anneeGlobale, setAnneeGlobale] = useState('');
  const [tvaGlobale, setTvaGlobale] = useState('');
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlyDataParCompte, setMonthlyDataParCompte] = useState([]);
  const [yearlyDataParCompte, setYearlyDataParCompte] = useState([]);
  const [compteParCompte, setCompteParCompte] = useState('');
  const [localite, setLocalite] = useState('');
  const [yearStart, setYearStart] = useState('');
  const [tvaParCompte, setTvaParCompte] = useState('');
  const [anneeDebut, setAnneeDebut] = useState('');
  const [comptes, setComptes] = useState([]);
  const [compte, setCompte] = useState([]);
  const [localites, setLocalites] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCompte, setSelectedCompte] = useState(null);

  const [anneeParCompte, setAnneeParCompte] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); 

  const [loadingVille, setLoadingVille] = useState(false);
  const [errorVille, setErrorVille] = useState(null);
  const [recettesParVille, setRecettesParVille] = useState([]);
  const [evolutionDataParVille, setEvolutionDataParVille] = useState(null);

  const generateYears = (startYear) => {
    const start = parseInt(startYear, 10);
    return Array.from({ length: 5 }, (_, i) => start + i);
  };


  const getMonthName = (monthNumber) => {
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return monthNames[monthNumber - 1];
  };

  useEffect(() => {
    fetch('http://localhost:8000/api/comptes/comptes/')
      .then(response => response.json())
      .then(data => setComptes(data))
      .catch(error => console.error('Erreur lors de la récupération des comptes:', error));

    fetch('http://localhost:8000/api/localites/villes/')
      .then(response => response.json())
      .then(data => setLocalites(data))
      .catch(error => console.error('Erreur lors de la récupération des localités:', error));

   
  }, []);



  const getMonthlyTotal = async (villeId, month) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/recetteAllApmf/evolution_mensuelle_globale/?anneeGlobale=${anneeGlobale}&localiteGlobale=${villeId}&tvaGlobale=${tvaGlobale}`
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

  const handleRecetteGlobaleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    

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


  {/*evolution mensuelle par compte */}
  const getMonthlyTotalParCompte = async (villeIdParCompte, month) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/recetteAllApmf/evolution_mensuelle_par_compte/?anneeParCompte=${anneeParCompte}&localiteParCompte=${villeIdParCompte}&tvaParCompte=${tvaParCompte}&compteParCompte=${compte}`
      );
  
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Convertir les données mensuelles pour le mois donné
      const monthName = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
      ][month - 1];
  
      return parseFloat(data.mois[monthName]) || 0;
    } catch (err) {
      console.error('Erreur de fetch des données mensuelles :', err);
      return 0;
    }
  };
  

  const handleEvolutionMensuelleSubmit = async (event) => {
    event.preventDefault();
    

    setLoading(true); // Start loading spinner when form is submitted
    setShowMonthlyTableParCompte(false); // Hide table while loading

    try {
      const monthlyResults = await Promise.all(
        localites.map(async (ville) => {
          const monthlyTotalParCompte = await Promise.all(
            Array.from({ length: 12 }, (_, i) => getMonthlyTotalParCompte(ville.id_ville, i + 1))
          );
          const annualTotal = monthlyTotalParCompte.reduce((sum, total) => sum + (total || 0), 0);
          return { ville: ville.nom_ville, monthlyTotalParCompte, annualTotal };
        })
      );
      setMonthlyDataParCompte(monthlyResults);
      setShowMonthlyTableParCompte(true); // Show table after data is fetched
    } catch (err) {
      setError('Erreur lors de la récupération des données mensuelles.');
      console.error(err);
    } finally {
      setLoading(false); // Stop loading spinner when data is loaded
    }
  };

  const calculateGrandTotalParCompte = () => {
    const grandTotalParCompte = Array(12).fill(0);
    monthlyDataParCompte.forEach(({ monthlyTotalParCompte }) => {
      monthlyTotalParCompte.forEach((total, index) => {
        if (typeof total === 'number' && !isNaN(total)) {
          grandTotalParCompte[index] += total;
        }
      });
    });
    return grandTotalParCompte;
  };  

  const grandTotalParCompte = calculateGrandTotalParCompte();

  
  /*Evolution des recettes par ville sur 5ans */
  const handleRecetteParVilleSubmit = async (event) => {
    event.preventDefault();
    setLoadingVille(true);
    setErrorVille(null);
    setRecetteParVilleTable(false);
  
    try {
      const response = await fetch(
        `http://localhost:8000/api/recetteAllApmf/evolution_par_ville_sur5Ans/?anneeDebut=${anneeDebut}`
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }
      const data = await response.json();
      setEvolutionDataParVille(data); // Mettre à jour l'état avec les données récupérées
      setRecetteParVilleTable(true);
    } catch (err) {
      setErrorVille(err.message || "Erreur lors de la récupération des données.");
    } finally {
      setLoadingVille(false);
    }
  };
  
  

/** Evolution des recettes sur 5 ans */
const renderEvolutionParVilleTable = () => {
  if (!evolutionDataParVille || evolutionDataParVille.length === 0) {
    return <div>Chargement...</div>;
  }

  const years = Array.from({ length: 5 }, (_, i) => parseInt(anneeDebut) + i);

  return (
    <table className="tiers-table">
      <thead>
        <tr>
          <th>Code Localité</th>
          <th>Localité</th>
          {years.map((year) => (
            <th key={year}>{year}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {evolutionDataParVille.map((ville) => (
          <tr key={ville.code_loc}>
            <td>{ville.code_loc}</td>
            <td>{ville.localite}</td>
            {years.map((year) => (
              <td key={year}>
                {ville[year] !== null && ville[year] !== undefined
                  ? ville[year].toFixed(2) // Formater les nombres
                  : "0.00"}
              </td>
            ))}
          </tr>
        ))}
        <tr>
          <td colSpan="2">
            <strong>Total</strong>
          </td>
          {years.map((year) => {
            const total = evolutionDataParVille.reduce(
              (sum, ville) => sum + (ville[year] || 0),
              0
            );
            return (
              <td key={year}>
                {total.toFixed(2)}
              </td>
            );
          })}
        </tr>
      </tbody>
    </table>
  );
};

/**Evoution des recettes par compte sur 5ans */
// Gestion de la soumission du formulaire
const handleRecetteParCompteSubmit = (event) => {
  event.preventDefault();

  fetch(`http://localhost:8000/api/recetteAllApmf/evolution_par_compte_sur5Ans/?localiteParCompte5=${localite}&yearStart=${yearStart}`)
    .then((response) => response.json())
    .then((data) => setRecetteParCompteTable(data))
    .catch((error) => console.error("Erreur lors de la récupération des données :", error));
};



  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />

        {/* Evolution Mensuelle des Recettes Globales */}
        <div className="form-container">
          <h2 className="div-h2">EVOLUTION MENSUELLE DES RECETTES GLOBALES</h2>
          <form onSubmit={handleRecetteGlobaleSubmit} className="form">
          <div className="form-group">
              <label htmlFor="anneeGlobale">Choix de l'année:</label>
              <input
                type="number"
                id="anneeGlobale"
                value={anneeGlobale}
                onChange={(e) => setAnneeGlobale(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tvaGlobale">TVA:</label>
              <select
                id="tvaGlobale"
                value={tvaGlobale}
                onChange={(e) => setTvaGlobale(e.target.value)}
                required
              >
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

          {recetteGlobaleTable && !loading && monthlyData.length > 0 &&(
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>Localité </th>
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

        {/* Evolution Mensuelle Par Compte */}
        <div className="form-container">
          <h2 className="div-h2">EVOLUTION MENSUELLE PAR COMPTE</h2>
          <form onSubmit={handleEvolutionMensuelleSubmit} className="form">
            
            <div className="form-group">
                <label htmlFor="anneeParCompte">Choix de l'année:</label>
                <input
                  type="number"
                  id="anneeParCompte"
                  value={anneeParCompte}
                  onChange={(e) => setAnneeParCompte(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="compte">Choix du Compte:</label>
                <select 
                  id="compte" 
                  value={compte} 
                  onChange={(e) => setCompte(e.target.value)} 
                  required
                >
                  <option value="">Sélectionner un compte</option>
                  {comptes
                    .filter(compte => compte.id_compte !== 1 && compte.id_compte !== 2 && compte.id_type_compte === 1)
                    .map(compte => (
                      <option key={compte.id_compte} value={compte.id_compte}>
                        {compte.code} - {compte.libelle}
                      </option>
                    ))}
                </select>
              </div>

            <div className="form-group">
              <label htmlFor="tvaParCompte">TVA:</label>
              <select
                id="tvaParCompte"
                value={tvaParCompte}
                onChange={(e) => setTvaParCompte(e.target.value)}
                required
              >
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


          {evolutionMensuelleTable && !loading && monthlyDataParCompte.length > 0 ? (
           <table className="tiers-table">
           <thead>
             <tr>
               <th>Localité </th>
               {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                 <th key={month}>{getMonthName(month)}</th>
               ))}
               <th>Total</th>
             </tr>
           </thead>
           <tbody>
             {monthlyDataParCompte.map(({ ville, monthlyTotalParCompte, annualTotal }) => (
               <tr key={ville}>
                 <td>{ville}</td>
                 {monthlyTotalParCompte.map((total, index) => (
                   <td key={index}>{total !== null && total !== undefined ? total : 0}</td>
                 ))}
                 <td>{annualTotal}</td>
               </tr>
             ))}
             <tr>
               <td><strong>Total</strong></td>
               {grandTotalParCompte.map((total, index) => (
                 <td key={index}>
                   {typeof total === 'number' ? total.toFixed(2) : 0.00}  {/* Vérification que 'total' est bien un nombre */}
                 </td>
               ))}

               <td>{grandTotalParCompte.reduce((sum, total) => sum + total, 0).toFixed(2)}</td>
             </tr>
           </tbody>
         
         </table>
          ) : (
            !loading && <p>{/*Aucune donnée disponible pour les critères sélectionnés.*/}</p>
          )}
        </div>

        {/* Evolution Par Ville sur 5 Ans */}
        <div className="form-container">
          <h2 className="div-h2">EVOLUTION DES RECETTES PAR VILLE SUR 5 ANS</h2>
          <form onSubmit={handleRecetteParVilleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="anneeDebut">Choix de l'année début:</label>
              <input
                type="number"
                id="anneeDebut"
                value={anneeDebut}
                onChange={(e) => setAnneeDebut(e.target.value)}
                required
              />
            </div>
            <div className="button-group">
              <button type="submit" className="btn save-btn">
                OK
              </button>
            </div>
          </form>

          {/* Affichage du tableau */}
          {recetteParVilleTable && (
             <div>
      
             {renderEvolutionParVilleTable()} {/* Appel de la fonction pour afficher le tableau */}
           </div>
         )}
       
         {error && <p>{error}</p>}
        </div>
      

        {/* Evolution Par Compte sur 5 Ans */}
        <div className="form-container">
          <h2 className="div-h2">ÉVOLUTION DES RECETTES PAR COMPTE SUR 5 ANS</h2>
          <form onSubmit={handleRecetteParCompteSubmit} className="form">
            <div className="form-group">
              <label htmlFor="localiteParCompte5">Localité:</label>
              <select
                id="localiteParCompte5"
                value={localite}
                onChange={(e) => setLocalite(e.target.value)}
                required
              >
                <option value="">Sélectionner une localité</option>
                {localites.map((loc) => (
                  <option key={loc.id_ville} value={loc.id_ville}>
                    {loc.nom_ville}
                  </option>
                ))}
              </select>
            </div>

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

            <div className="button-group">
              <button type="submit" className="btn save-btn">OK</button>
            </div>
          </form>

          {recetteParCompteTable && (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>Compte</th>
                  <th>Libellé</th>
                  {generateYears(yearStart).map((year) => (
                    <th key={year}>{year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recetteParCompteTable.map((row, index) => (
                  <tr key={index}>
                    <td>{row.code}</td>
                    <td>{row.libelle}</td>
                    {generateYears(yearStart).map((year) => (
                      <td key={year}>{row[year] || 0}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2" style={{ fontWeight: 'bold' }}>Total</td>
                  {generateYears(yearStart).map((year) => {
                    // Calcul du total pour l'année
                    const total = recetteParCompteTable.reduce((sum, row) => sum + (row[year] || 0), 0);
                    return <td key={year} style={{ fontWeight: 'bold' }}>{total}</td>;
                  })}
                </tr>
              </tfoot>
            </table>
          )}
        </div>



      </div>
      </div>
   
  );
}

export default SuiviRecetteApmf_Evolution;
