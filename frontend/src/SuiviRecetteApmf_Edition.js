import React, { useState, useEffect } from 'react';
import './css/Sidebar.css';
import './css/FormPage.css'; // Reusing SaisieBudget's CSS for consistency
import './css/EtatsAEtablir.css';
import Sidebar from './Sidebar';
import Header from './Header';

function SuiviRecetteApmf_Edition() {
  const [etatTable, setEtatTable] = useState(false);
  const [factures, setFactures] = useState([]);
  const [tableSynop, setTableSynop] = useState(null);

  const [annee, setMonthlyYear] = useState('');
  const [compte, setCompte] = useState('');
  const [localite, setLocalite] = useState('');

  const [anneeSynop, setAnneeSynop] = useState('');
  const [tvaSynop, setTvaSynop] = useState('');
  const [localiteSynop, setLocaliteSynop] = useState('');

  const [comptesList, setComptesList] = useState([]);
  const [villesList, setVillesList] = useState([]);

  const [synoptiqueTable, setSynoptiqueTable] = useState(false);

   // Ajout des variables non définies mentionnées dans les erreurs
   const [compteVis, setCompteVis] = useState('');
   const [numFac, setNumFac] = useState([]);
   const [stat, setStat] = useState('');
   const [visualisationTable, setVisualisationTable] = useState(null);

  

   const handleVisualisationSubmit = (event) => {
    event.preventDefault();
    setEtatTable(false);
    setSynoptiqueTable(false);
    setVisualisationTable(true);
  };

  // Fetch dynamic data for comptes and villes
  useEffect(() => {
    // Fetch comptes data
    fetch('http://localhost:8000/api/comptes/comptes/') // API endpoint for comptes list
      .then((response) => response.json())
      .then((data) => setComptesList(data))
      .catch((error) => console.error('Error fetching comptes:', error));

    // Fetch villes data
    fetch('http://localhost:8000/api/localites/villes/') // API endpoint for villes list
      .then((response) => response.json())
      .then((data) => setVillesList(data))
      .catch((error) => console.error('Error fetching villes:', error));

      fetch('http://localhost:8000/api/recetteAllApmf/get_num_facture/')
      .then(response => response.json())
      .then(data => setNumFac(data))
      .catch(error => console.error('Erreur lors de la récupération des numeros factures:', error));
  }, []);


  const handleEtatSubmit = (event) => {
    event.preventDefault();
    
    // Construct the URL with query parameters
    const url = `http://localhost:8000/api/recetteAllApmf/etat-factures/?year=${annee}&compte=${compte}&localite=${localite}`;
    
    // Fetch data using the constructed URL
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des factures');
        }
        return response.json();
      })
      .then((data) => {
        setFactures(data);  // Set filtered data in state
        setEtatTable(true);  // Display the table
      })
      .catch((error) => {
        console.error('Error fetching factures:', error);
        alert('Impossible de récupérer les données : ' + error.message);
      });
  };
  

  const handleSynoptiqueSubmit = (e) => {
    e.preventDefault();
    fetch(
      `http://localhost:8000/api/recetteAllApmf/tableau-synoptique/?anneeSynop=${anneeSynop}&tvaSynop=${tvaSynop}&localiteSynop=${localiteSynop}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données du tableau synoptique");
        }
        return response.json();
      })
      .then((data) => {
        setTableSynop(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
  };
  

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />

        {/* etat des factures */}
    <div className="form-container">
      <h2 className="div-h2">ETAT DES FACTURES</h2>
      <form onSubmit={handleEtatSubmit} className="form">
        <div className="form-group">
          <label htmlFor="monthlyYear">Année:</label>
          <input
            type="number"
            id="annee"
            value={annee}
            onChange={(e) => setMonthlyYear(e.target.value)}
            required
            min="2000"
            max="9999"
          />
        </div>

        <div className="form-group">
          <label htmlFor="compte">Compte:</label>
          <select
            id="compte"
            value={compte || ''}
            onChange={(e) => setCompte(e.target.value)}
            required
          >
            <option value="">--Choisissez compte--</option>
            {comptesList
              .filter((compte) => compte.id_compte !== 1 && compte.id_compte !== 2 && compte.id_type_compte == 1) // Filtrage des comptes
              .map((compte) => (
                <option key={compte.id_compte} value={compte.id_compte}>
                  {compte.code}-{compte.libelle}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="localite">Localité:</label>
          <select
            id="localite"
            value={localite || ''}
            onChange={(e) => setLocalite(e.target.value)}
            required
          >
            <option value="">--Choisissez Localité--</option>
            {villesList.map((ville) => (
              <option key={ville.id_ville} value={ville.id_ville}>
                {ville.nom_ville}
              </option>
            ))}
          </select>
        </div>

        <div className="button-group">
          <button type="submit" className="btn save-btn">OK</button>
        </div>
      </form>
      {etatTable && (
        <table className="tiers-table">
          <thead>
            <tr>
              <th>N° FAC</th>
              <th>DATE</th>
              <th>COMPTE</th>
              <th>CODE TIERS</th>
              <th>MONTANT HT</th>
              <th>TVA</th>
              <th>MONTANT TTC</th>
              <th>VILLE</th>
              <th>LIBELLE</th>
              <th>CLIENT / SOCIÉTÉ</th>
            </tr>
          </thead>
          <tbody>
            {factures.length > 0 ? (
              factures.map((facture) => (
                <tr key={facture.id_recette_apmf_all}>
                  <td>{facture.num_facture}</td>
                  <td>{facture.date_facture}</td>
                  <td>{facture.code_compte}</td>
                  <td>{facture.id_tiers}</td>
                  <td>{parseFloat(facture.montant_ht).toFixed(2)} Ar</td>
                  <td>{parseFloat(facture.tva).toFixed(2)} Ar</td>
                  <td>{parseFloat(facture.montant_ttc).toFixed(2)} Ar</td>
                  <td>{facture.nom_ville}</td>
                  <td>{facture.libelle}</td>
                  <td>{facture.tiers_nom}</td>
                </tr>
              ))
            ) : (
              <tr>
              <td
                colSpan="10"
                style={{
                  textAlign: "center",
                  fontStyle: "italic",
                  color: "#6c757d",
                  fontSize: "16px",
                  padding: "20px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "5px",
                }}
              >
                Aucune donnée disponible pour les paramètres sélectionnés.
              </td>
            </tr>
            
            
            )}
          </tbody>
          {factures.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan="4" style={{ textAlign: 'right' }}>Total :</td>
                <td>
                  {factures.reduce((acc, curr) => acc + parseFloat(curr.montant_ht), 0).toFixed(2)} Ar
                </td>
                <td>
                  {factures.reduce((acc, curr) => acc + parseFloat(curr.tva), 0).toFixed(2)} Ar
                </td>
                <td>
                  {factures.reduce((acc, curr) => acc + parseFloat(curr.montant_ttc), 0).toFixed(2)} Ar
                </td>
                <td colSpan="3"></td>
              </tr>
            </tfoot>
          )}
        </table>
      )}
    </div>


        <div className="form-container">
      <h2 className="div-h2">TABLEAU SYNOPTIQUE</h2>
      <form onSubmit={handleSynoptiqueSubmit} className="form">
        <div className="form-group">
          <label htmlFor="anneeSynop">Année:</label>
          <input
            type="number"
            id="anneeSynop"
            value={anneeSynop}
            onChange={(e) => setAnneeSynop(e.target.value)}
            required
            min="2000"
            max="9999"
          />
        </div>
        <div className="form-group">
          <label htmlFor="tvaSynop">TVA:</label>
          <select
            id="tvaSynop"
            value={tvaSynop || ''}
            onChange={(e) => setTvaSynop(e.target.value)}
            required
          >
            <option value="">--Choisissez--</option>
            <option value="avec">Avec</option>
            <option value="sans">Sans</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="localiteSynop">Localité:</label>
          <select
            id="localiteSynop"
            value={localiteSynop || ''}
            onChange={(e) => setLocaliteSynop(e.target.value)}
            required
          >
            <option value="">--Choisissez Localité--</option>
            {villesList.map((ville) => (
              <option key={ville.id_ville} value={ville.id_ville}>
                {ville.nom_ville}
              </option>
            ))}
          </select>
        </div>
        <div className="button-group">
          <button type="submit" className="btn save-btn">OK</button>
        </div>
      </form>

{/* Tableau synoptique */}
{tableSynop && tableSynop.localite && Object.keys(tableSynop.comptes).length > 0 ? (
  <table className="tiers-table">
    <thead>
      <tr>
        <th>Code Loc</th>
        <th>Localité</th>
        {comptesList
          .filter((compte) => compte.id_compte !== 1 && compte.id_compte !== 2)  // Filtrer les comptes
          .map((compte) => (
            <th key={compte.id_compte}>{compte.code}</th>  // Affichage des comptes filtrés
          ))}
        <th>Total Ville</th>
      </tr>
    </thead>
    <tbody>
      {tableSynop.comptes && Object.keys(tableSynop.comptes).length > 0 ? (
        <>
          {/* Première ligne avec les données de la localité */}
          <tr>
            <td>{tableSynop.localite.code_ville}</td>
            <td>{tableSynop.localite.nom_ville}</td>
            {comptesList
              .filter((compte) => compte.id_compte !== 1 && compte.id_compte !== 2)
              .map((compte) => {
                const montant = tableSynop.comptes[compte.id_compte] || 0;  // Récupération du montant pour chaque compte
                return (
                  <td key={compte.id_compte}>{montant.toFixed(2)} Ar</td>  // Affichage du montant avec 2 décimales
                );
              })}
            <td>{tableSynop.total.toFixed(2)} Ar</td>  {/* Affichage du total de la ville */}
          </tr>
          {/* Ligne pour Total Compte */}
          <tr>
            <td colSpan="2">Total Compte</td>
            {comptesList
              .filter((compte) => compte.id_compte !== 1 && compte.id_compte !== 2)
              .map((compte) => {
                const totalCompte = tableSynop.comptes[compte.id_compte] || 0;  // Récupération du total par compte
                return (
                  <td key={`total-${compte.id_compte}`}>
                    {totalCompte.toFixed(2)} Ar
                  </td>
                );
              })}
            <td>{tableSynop.total.toFixed(2)} Ar</td>  {/* Total ville pour cette ligne */}
          </tr>
        </>
      ) : (
        // Message par défaut si aucune donnée n'est disponible
        <tr>
          <td colSpan={comptesList.length + 3} style={{ textAlign: 'center', fontStyle: "italic" }}>
            Aucune donnée disponible pour les paramètres sélectionnés.
          </td>
        </tr>
      )}
    </tbody>
  </table>
) : (
  <div style={{ textAlign: 'center', fontStyle: "italic" }}>
    Aucune donnée trouvée pour les critères spécifiés.
  </div>
)}




    </div>




        {/* Visualisation des statistiques */}
        <div className="form-container">
          <h2 className="div-h2">VISUALISATION DES STATISTIQUES</h2>
          <form onSubmit={handleVisualisationSubmit} className="form">
            <div className="form-group">
            <label htmlFor="compteVis">Compte:</label>
            <select
              id="compteVis"
              value={compteVis || ''}
              onChange={(e) => setCompteVis(e.target.value)}
              required
            >
              <option value="">--Choisissez compte--</option>
              {comptesList
                .filter((compte) => compte.id_compte !== 1 && compte.id_compte !== 2 &&  compte.id_type_compte == 1) // Filtrage des comptes
                .map((compte) => (
                  <option key={compte.id_compte} value={compte.id_compte}>
                    {compte.code}-{compte.libelle}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
          <label htmlFor="numFac">Choix Num Facture:</label>
          <select
            id="numFac"
            value={numFac.length > 0 ? numFac[0].id_recette_apmf_all || '' : ''}
            onChange={(e) => setNumFac(e)}
            required
          >
            <option value="">--Choisissez Numéro Facture--</option>
            {Array.isArray(numFac) && numFac.length > 0 ? (
              numFac.map((num) => (
                <option key={num.id_recette_apmf_all} value={num.id_recette_apmf_all}>
                  {num.num_facture}
                </option>
              ))
            ) : (
              <option value="">Pas de données disponibles</option>
            )}
          </select>
        </div>

            <div className="form-group">
              <label htmlFor="stat">Stat:</label>
              <input
                type="text"
                id="stat"
                value={stat}
                onChange={(e) => setStat(e.target.value)}
                required
                placeholder="Saisissez le stat"
              />
            </div>

            <div className="button-group">
              <button type="submit" className="btn save-btn">OK</button>
            </div>
          </form>

          {visualisationTable && (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>Stat</th>
                  <th>Nombre</th>
                  <th>Nature</th>
                  <th>Libellé</th>
                  <th>Année</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuiviRecetteApmf_Edition;
