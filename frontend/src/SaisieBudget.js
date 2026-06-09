import React, { useState, useEffect } from 'react';
import './css/Sidebar.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from "./Sidebar";
import Header from "./Header";
import './css/FormPage.css';
import ConfirmationOk from './ConfirmationOk';


function SaisieBudget() {
  const [annee, setAnnee] = useState('');
  const [compte, setCompte] = useState('');
  const [montant, setMontant] = useState('');
  const [libelle, setLibelle] = useState('');
  const [localite, setLocalite] = useState('');
  const [localites, setLocalites] = useState([]);
  const [comptes, setComptes] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Charger les localités et comptes depuis l'API
  useEffect(() => {
    // Charger les localités
    fetch('http://localhost:8000/api/localites/villes/')
      .then(response => response.json())
      .then(data => setLocalites(data))
      .catch(error => console.error('Erreur lors du chargement des localités:', error));

    // Charger les comptes
    fetch('http://localhost:8000/api/comptes/comptes/')
      .then(response => response.json())
      .then(data => setComptes(data))
      .catch(error => console.error('Erreur lors du chargement des comptes:', error));
  }, []);

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
  const idCompteInt = parseInt(compte, 10);  // Convertir en entier
  const idVilleInt = parseInt(localite, 10);  // Convertir en entier

  // Vérifier que les conversions en entier sont valides
  if (isNaN(idCompteInt) || isNaN(idVilleInt)) {
    setError("Les données de compte ou de localité sont invalides.");
    return;  // Empêche l'envoi du formulaire si les conversions échouent
  }

  // Préparer les données du budget
  const budgetData = {
    annee,
    code_programme: '022', // Valeur statique
    id_compte: idCompteInt,  // Utiliser l'entier ici
    montant: montantFloat,
    libelle,
    id_ville: idVilleInt,  // Utiliser l'entier ici
  };

  // Envoi des données au serveur
  fetch('http://localhost:8000/api/budget/budget/', {  // Ajustez l'URL de l'API
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(budgetData),
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
      if (data.id_budget) {
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


  const handleOk = () => {
    setShowConfirmation(false); // Fermer la fenêtre de confirmation
    {navigate('/liste_budgets')};
  };

  // Calculer l'année actuelle
  const currentYear = new Date().getFullYear();

  // Générer une liste des années futures à partir de l'année actuelle (par exemple, sur 10 ans)
  const years = [];
  for (let i = 0; i <= 10; i++) {
    years.push(currentYear + i);
  }

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <div className="div-h2">
            <h2>Saisie du Budget</h2>
          </div>
          <form onSubmit={handleSubmit} className="form">
            {/* Sélection de l'année */}
            <div className="form-group">
              <label htmlFor="annee">Choix de l'année :</label>
              <input
                id="annee"
                type="number"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                required
              />
            </div>

            {/* Code programme */}
            <div className="form-group">
              <label htmlFor="code-programme">Code Programme:</label>
              <input
                id="code-programme"
                type="text"
                value="022"
                readOnly
              />
            </div>

            {/* Sélection du compte */}
            <div className="form-group">
              <label htmlFor="compte-select">Compte:</label>
              <select
                id="compte-select"
                value={compte}
                onChange={(e) => setCompte(e.target.value)}
                required
              >
                <option value="">--Choisissez un compte--</option>
                {comptes
                  .filter(compte => compte.id_type_compte === 1 && compte.id_compte !==1 && compte.id_compte !==2)  // Filtre les comptes avec id_type_compte = 1
                  .map(compte => (
                    <option key={compte.id_compte} value={compte.id_compte}>
                      {compte.code} - {compte.libelle}
                    </option>
                  ))}
              </select>
            </div>

            {/* Montant à saisir */}
            <div className="form-group">
              <label htmlFor="montant">Montant:</label>
              <input
                id="montant"
                type="number"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                required
                placeholder="Entrez le montant"
              />
            </div>

            {/* Libellé à saisir */}
            <div className="form-group">
              <label htmlFor="libelle">Libellé:</label>
              <input
                id="libelle"
                type="text"
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}
                required
                placeholder="Entrez le libellé"
              />
            </div>

            {/* Sélection de la localité */}
            <div className="form-group">
              <label htmlFor="localite-select">Localité:</label>
              <select
                id="localite-select"
                value={localite}
                onChange={(e) => setLocalite(e.target.value)}
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

            <div className="button-group">
              <button type="submit" className="btn save-btn">Enregistrer</button>
            </div>
          </form>
          
          {error && <p className="error-message">{error}</p>}
          {showConfirmation  && <ConfirmationOk message="Budget ajouté avec succès!" onClose={handleOk} />}
          
        </div>
      </div>
    </div>
  );
}

export default SaisieBudget;
