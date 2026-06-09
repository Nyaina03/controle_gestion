import React, { useState, useEffect } from 'react';
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./css/FormPage.css"; // Réutilisation des styles existants
import ConfirmationOk from './ConfirmationOk';


function SaisieMarchandise() {
  const[importation_donnees, setImportationDonnees] = useState('');
  const[port_ou_localite, setPort] = useState('');
  const[date_operation, setDateOperation] = useState('');
  const[type_operation, setTypeOperation] = useState('');
  const[navire, setNavire] = useState('');
  const[navires, setNavires] = useState([]);
  const[provenance_ou_destination, setProvenance] = useState('');
  const[type_stat, setTypeStat] = useState('');
  const[quantite, setQuantite] = useState('');
  const[code_stat, setCodeStat] = useState('');
  const [codes, setCodes] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);
  const [localite, setLocalite] = useState('');
  const [localites, setLocalites] = useState([]);
  




  useEffect(() => {
    // Charger les localités
    fetch('http://localhost:8000/api/localites/villes/')
      .then(response => response.json())
      .then(data => setLocalites(data))
      .catch(error => console.error('Erreur lors du chargement des localités:', error));

    // Charger les comptes
    fetch('http://localhost:8000/api/statistiqueBrutes/stat/')
      .then(response => response.json())
      .then(data => setCodes(data))
      .catch(error => console.error('Erreur lors du chargement des codes stat:', error));

      fetch('http://localhost:8000/api/statistiqueBrutes/navires/')
      .then(response => response.json())
      .then(data => setNavires(data))
      .catch(error => console.error('Erreur lors du chargement des navires:', error));

      
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null); // Réinitialiser l'erreur avant la soumission
  
    const localiteInt = parseInt(port_ou_localite);
    const destinationInt = parseInt(provenance_ou_destination);
    const codeInt = parseInt(code_stat);

    // Préparer les données du budget
    const marchandiseData = {
      importation_donnees,
      port_ou_localite : localiteInt,
      date_operation ,
      type_operation ,
      navire,
      provenance_ou_destination :destinationInt,
      type_stat,
      quantite ,
      code_stat : codeInt,

    };
  
    // Envoi des données au serveur
    fetch('http://localhost:8000/api/statistiqueBrutes/marchandises/', {  // Ajustez l'URL de l'API
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(marchandiseData),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errData => {
            console.error('Erreur API:', errData);
            throw new Error(`Erreur API: ${errData.detail || response.statusText}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Réponse:', data);
        if (data.id_marchandise) {
          setShowConfirmation(true);
        } else {
          throw new Error("Erreur lors de l'ajout du marchandise.");
        }
      })
      .catch(error => {
        console.error("Erreur lors de l'ajout du marchandise:", error);
        setError("Une erreur est survenue. Veuillez réessayer.");
      });
  };

  const handleOk = () => {
    setShowConfirmation(false); // Fermer la fenêtre de confirmation
  };


  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Saisie des Marchandises</h2>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="importation_donnees">Importation de données :</label>
              <input
                type="text"
                id="importation_donnees"
                name="importation_donnees"
                value={importation_donnees}
                onChange={(e) => setImportationDonnees(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="port_ou_localit">Port/localité :</label>
              <select
                id="localite-select"
                value={port_ou_localite}
                onChange={(e) => setPort(e.target.value)}
                required
              >
                <option value="">--Choisissez une localité--</option>
                {localites.map(localite => (
                  <option key={localite.id_ville} value={localite.id_ville}>
                    {localite.nom_ville}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date_operation">Date opération :</label>
              <input
                type="date"
                id="date_operation"
                name="date_operation"
                value={date_operation}
                onChange={(e) => setDateOperation(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="type_operation">Type opération (EMB/DEB) :</label>
              <select
                id="type_operation"
                name="type_operation"
                value={type_operation}
                onChange={(e) => setTypeOperation(e.target.value)}
                required
              >
                <option value="">-- Sélectionner --</option>
                <option value="EMB">EMB</option>
                <option value="DEB">DEB</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="navire">Navire (nom) :</label>
              <select
                id="navire-select"
                value={navire}
                onChange={(e) => setNavire(e.target.value)}
                required
              >
                <option value="">--Choisissez navire--</option>
                {navires.map(navire => (
                  <option key={navire.id_navire} value={navire.id_navire}>
                    {navire.navire}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="provenance_ou_destination">
                Provenance/destination :
              </label>
              <select
                id="localite-select"
                value={provenance_ou_destination}
                onChange={(e) => setProvenance(e.target.value)}
                required
              >
                <option value="">--Choisissez une localité--</option>
                {localites.map(localite => (
                  <option key={localite.id_ville} value={localite.id_ville}>
                    {localite.nom_ville}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="type_stat">Type STAT (MSES/Passagers) :</label>
              <select
                id="type_stat"
                name="type_stat"
                value={type_stat}
                onChange={(e) => setTypeStat(e.target.value)}
                required
              >
                <option value="">-- Sélectionner --</option>
                <option value="MSES">MSES</option>
                <option value="Passagers">Passagers</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="quantite">Quantité (tonnage ou nombre) :</label>
              <input
                type="number"
                id="quantite"
                name="quantite"
                value={quantite}
                onChange={(e) => setQuantite(e.target.value)}
                required
              
              />
            </div>

            <div className="form-group">
              <label htmlFor="code_stat">Code STAT (à ajouter par CG) :</label>
              <select
                id="localite-select"
                value={code_stat}
                onChange={(e) => setCodeStat(e.target.value)}
                required
              >
                <option value="">--Choisissez stat--</option>
                {codes.map(stat => (
                  <option key={stat.id_stat} value={stat.id_stat}>
                    {stat.code_stat}
                  </option>
                ))}
              </select>
            </div>

            {/* Bouton Enregistrer */}
            <div className="button-group">
              <button type="submit" className="btn save-btn">
                Enregistrer
              </button>
            </div>
          </form>

          {/* Message de confirmation */}
          {error && <p className="error-message">{error}</p>}
          {showConfirmation && <ConfirmationOk message="Marchandise ajouté avec succès!" onClose={handleOk} />}
        </div>
      </div>
    </div>
  );
}

export default SaisieMarchandise;
