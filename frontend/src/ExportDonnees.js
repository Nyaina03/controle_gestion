import React, { useState, useEffect } from 'react';
import Header from './Header';  // Importer le Header
import Sidebar from './Sidebar'; // Importer le Sidebar
import './css/FormPage.css';
import ConfirmationOk from './ConfirmationOk';

const ExportDonnees = () => {

  const [annee, setAnnee] = useState('');
  const [num_engagement, setNumEng] = useState('');
  const [code_programme, setCodeProgramme] = useState([]);
  const [code_tiers, setCodeTiers] = useState('');
  const [id_compte, setCompte] = useState('');
  const [objet, setObjet] = useState('');
  const [date_eng, setDateEng] = useState('');
  const [grande_rubrique, setGrandeRubrique] = useState('');
  const [montant, setMontant] = useState('');
  const [etat, setEtat] = useState('vise');
  const [id_type_operation, setTypeOperation] = useState([]);
  const [selectedTypeOperation, setSelectedTypeOperation] = useState('');
  const [comptes, setComptes] = useState([]);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  

  const handleOk = () => {
    setShowConfirmation(false); // Fermer la fenêtre de confirmation
  };


  useEffect(() => {
    // Charger les localités
    fetch('http://localhost:8000/api/typeOperation/type_operations/')
      .then(response => response.json())
      .then(data => setTypeOperation(data))
      .catch(error => console.error('Erreur lors du chargement des types d opération:', error));

    // Charger les comptes
    fetch('http://localhost:8000/api/comptes/comptes/')
    .then(response => response.json())
    .then(data => setComptes(data))
    .catch(error => console.error('Erreur lors du chargement des comptes:', error));
}, []);
   



  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null); // Réinitialiser l'erreur avant la soumission
  
    // Convertir le montant en nombre flottant
    const montantFloat = parseFloat(montant.trim());
    if (isNaN(montantFloat)) {
      setError('Le montant est invalide.');
      return;  // Empêche l'envoi du formulaire si le montant est invalide
    }
  
    // Convertir id_compte et id_ville en entiers
    const idCompteInt = parseInt(id_compte, 10);   // Convertir en entier

  
    // Vérifier que les conversions en entier sont valides
    if (isNaN(idCompteInt)) {
      setError("Les données de compte ou de localité sont invalides.");
      return;  // Empêche l'envoi du formulaire si les conversions échouent
    }
  
    // Préparer les données du budget
    const SaisiData = {
      id_type_operation  : parseInt(selectedTypeOperation),
      annee ,
      num_engagement,
      code_programme,
      code_tiers,
      id_compte: idCompteInt,  
      objet ,
      date_eng ,
      grande_rubrique ,
      montant: montantFloat,
      etat ,
   
    };
  
    // Envoi des données au serveur
    fetch('http://localhost:8000/api/realisationBudget/depenses_siig/', {  // Ajustez l'URL de l'API
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(SaisiData),
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
        if (data.id_depense_siig) {
          setShowConfirmation(true);
        } else {
          throw new Error("Erreur lors de l'ajout du budget.");
        }
      })
      .catch(error => {
        console.error("Erreur lors de l'ajout du budget:", error);
        setError("Une erreur est survenue. Veuillez réessayer.");
      });
  };
  

  return (
    <div className="form-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
            <div className="div-h2">
                <h2>Saisie de Données</h2>
            </div>
          <form onSubmit={handleSubmit}>
            {/* Type d'Opération */}
            <div className="form-group">
              <label htmlFor="type-operation-select">Type Opération:</label>
              <select
                id="type-operation-select"
                value={selectedTypeOperation}
                onChange={(e) => setSelectedTypeOperation(e.target.value)}
                required
              >
                <option value="">--Choisissez un type d'opération--</option>
                {id_type_operation.map(type => (
                  <option key={type.id_type_operation} value={type.id_type_operation}>
                    {type.type_operation}
                  </option>
                ))}
              </select>
            </div>

            {/* Année */}
            <div className="form-group">
              <label htmlFor="annee">Année:</label>
              <input
                type="number"
                id="annee"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                required
              />
            </div>

            {/* Num ENG */}
            <div className="form-group">
              <label htmlFor="numEng">Num ENG:</label>
              <input
                type="text"
                id="numEng"
                value={num_engagement}
                onChange={(e) => setNumEng(e.target.value)}
                required
              />
            </div>

            {/* Programme */}
            <div className="form-group">
              <label htmlFor="code_programme">Programme:</label>
              <select
                id="code_programme"
                value={code_programme}
                onChange={(e) => setCodeProgramme(e.target.value)}
                required
              >
                <option value="">--code programme--</option>
                <option value="022">022</option>
                <option value="209">209</option>
              </select>
            </div>

            {/* Code Tiers */}
            <div className="form-group">
              <label htmlFor="code_tiers">Code Tiers (SIIG):</label>
              <input
                type="text"
                id="code_tiers"
                value={code_tiers}
                onChange={(e) => setCodeTiers(e.target.value)}
                required
              />
            </div>

            {/* Compte */}
            <div className="form-group">
              <label htmlFor="compte-select">Compte:</label>
              <select
                id="compte-select"
                value={id_compte}
                onChange={(e) => setCompte(e.target.value)}
                required
              >
                <option value="">--Choisissez un compte--</option>
                {comptes
                  .filter(compte => compte.id_type_compte === 1 )  // Filtre les comptes avec id_type_compte = 1
                  .map(compte => (
                    <option key={compte.id_compte} value={compte.id_compte}>
                      {compte.code} - {compte.libelle}
                    </option>
                  ))}
              </select>
            </div>

            {/* Objet */}
            <div className="form-group">
              <label htmlFor="objet">Objet:</label>
              <input
                type="text"
                id="objet"
                value={objet}
                onChange={(e) => setObjet(e.target.value)}
                required
              />
            </div>

            {/* Date ENG */}
            <div className="form-group">
              <label htmlFor="dateEng">Date ENG:</label>
              <input
                type="date"
                id="dateEng"
                value={date_eng}
                onChange={(e) => setDateEng(e.target.value)}
                required
              />
            </div>

            {/* Grande Rubrique */}
            <div className="form-group">
              <label htmlFor="grandeRubrique">Grande Rubrique:</label>
              <input
                type="text"
                id="grandeRubrique"
                value={grande_rubrique}
                onChange={(e) => setGrandeRubrique(e.target.value)}
                required
              />
            </div>

            {/* Montant */}
            <div className="form-group">
              <label htmlFor="montant">Montant:</label>
              <input
                type="number"
                id="montant"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                required
              />
            </div>

            {/* Etat */}
            <div className="form-group">
              <label htmlFor="etat">Etat:</label>
              <select
                id="etat"
                value={etat}
                onChange={(e) => setEtat(e.target.value)}
                required
              >
                <option value="">--Etat--</option>
                <option value="vise">Vise</option>
                <option value="liquide">Liquide</option>
              </select>
            </div>

            {/* Bouton Enregistrer */}
            <div className="button-group">
              <button type="submit" className="btn save-btn">Enregistrer</button>
            </div>
          </form>

          {error && <p className="error-message">{error}</p>}
          {showConfirmation && <ConfirmationOk message="Dépense ajouté avec succès!" onClose={handleOk} />}
        
        </div>
      </div>
    </div>
  );
};

export default ExportDonnees;
