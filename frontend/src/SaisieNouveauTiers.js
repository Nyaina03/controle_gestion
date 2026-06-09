import React, { useState, useEffect } from 'react';
import './css/Sidebar.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from "./Sidebar";
import Header from "./Header";
import './css/FormPage.css';
import ConfirmationOk from './ConfirmationOk';

function SaisieNouveauTiers() {
  const [typeTiers, setTypeTiers] = useState(''); // 'individu' ou 'societe'
  const [formData, setFormData] = useState({
    nom: '',
    prenoms: '',
    contact: '',
    id_ville: '',
    cin: '',
    raison_social: '',
    num_stat: '',
    nif: '',
    id_type_tiers: 1, // Par défaut à 'Client'
  });
  const [typesTiers, setTypesTiers] = useState([]); // Liste des types de tiers
  const [localites, setLocalites] = useState([]); // Liste des localités
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Charger les localités depuis l'API Django
  useEffect(() => {
    fetch('http://localhost:8000/api/localites/villes/')
      .then(response => response.json())
      .then(data => setLocalites(data))
      .catch(error => {
        console.error('Erreur lors du chargement des localités:', error);
      });
  }, []);

  // Charger les types de tiers depuis l'API Django
useEffect(() => {
  fetch('http://localhost:8000/api/type_tiers/list/')
    .then(response => response.json())
    .then(data => {
      console.log("Données types de tiers:", data);  // Vérifiez les données
      setTypesTiers(data);
    })
    .catch(error => console.error('Erreur lors du chargement des types de tiers:', error));
}, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleTypeChange = (type) => {
    setTypeTiers(type);
    setFormData((prevData) => ({
      ...prevData,
      nom: '',
      prenoms: '',
      contact: '',
      id_ville: '',
      cin: '',
      raison_social: type === 'societe' ? '' : prevData.raison_social,
      num_stat: type === 'societe' ? '' : prevData.num_stat,
      nif: type === 'societe' ? '' : prevData.nif,
      id_type_tiers: type === 'individu' ? 1 : 2, // Par défaut 'Client' pour individu, 'Fournisseur' pour société
    }));
  };
const handleSubmit = (e) => {
  e.preventDefault();
  setError(null); // Réinitialiser l'erreur avant la soumission

  fetch('http://localhost:8000/api/tiers/tiers/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errData) => {
          console.error('Erreur API:', errData);
          throw new Error(`Erreur API: ${errData.detail || response.statusText}`);
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log('Réponse:', data);
      if (data.id_tiers) {
        setShowConfirmation(true);
        setSubmittedData(data);
      } else {
        throw new Error("Erreur lors de l'ajout des données.");
      }
    })
    .catch((error) => {
      console.error("Erreur lors de l'ajout du Tiers:", error);
      setError("Une erreur est survenue. Veuillez réessayer.");
    });
};

const handleOk = () => {
  setShowConfirmation(false); // Fermer la fenêtre de confirmation
  {navigate('/liste_des_tiers')};
};

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <div className="div-h2">
            <h2>Saisie Nouveau Tiers</h2>
          </div>

          <div className="form-group">
            <label className="type-label">Type de tiers :</label>
            <div className="custom-radio-container">
              <div className="custom-radio-group">
                <div className="custom-radio">
                  <input
                    type="radio"
                    id="individu"
                    value="individu"
                    checked={typeTiers === 'individu'}
                    onChange={() => handleTypeChange('individu')}
                  />
                  <label className="custom-radio-label" htmlFor="individu">Individu</label>
                </div>
                <div className="custom-radio">
                  <input
                    type="radio"
                    id="societe"
                    value="societe"
                    checked={typeTiers === 'societe'}
                    onChange={() => handleTypeChange('societe')}
                  />
                  <label className="custom-radio-label" htmlFor="societe">Société</label>
                </div>
              </div>
            </div>
          </div>

         
          {(typeTiers === 'individu' || typeTiers === 'societe') && (
  <form onSubmit={handleSubmit} className="form">
    {/* Formulaire dynamique selon le type de tiers */}
    {typeTiers === 'individu' ? (
      <>
        <div className="form-group">
          <label htmlFor="nom">Nom:</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleInputChange}
            required
            placeholder="Entrez le nom"
          />
        </div>
        <div className="form-group">
          <label htmlFor="prenoms">Prénoms:</label>
          <input
            type="text"
            id="prenoms"
            name="prenoms"
            value={formData.prenoms}
            onChange={handleInputChange}
            required
            placeholder="Entrez les prénoms"
          />
        </div>
      </>
    ) : (
      <>
        <div className="form-group">
          <label htmlFor="nom">Nom du représentant:</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleInputChange}
            required
            placeholder="Entrez le nom du représentant"
          />
        </div>
        <div className="form-group">
          <label htmlFor="prenoms">Prénoms du représentant:</label>
          <input
            type="text"
            id="prenoms"
            name="prenoms"
            value={formData.prenoms}
            onChange={handleInputChange}
            required
            placeholder="Entrez les prénoms du représentant"
          />
        </div>
      </>
    )}

    <div className="form-group">
      <label htmlFor="contact">Contact:</label>
      <input
        type="text"
        id="contact"
        name="contact"
        value={formData.contact}
        onChange={handleInputChange}
        required
        placeholder="Entrez le contact"
      />
    </div>
    <div className="form-group">
      <label htmlFor="id_ville">Localité:</label>
      <select
        id="id_ville"
        name="id_ville"
        value={formData.id_ville}
        onChange={handleInputChange}
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
    {/* Formulaire spécifique à chaque type de tiers */}
    {typeTiers === 'individu' ? (
      <>
        <div className="form-group">
          <label htmlFor="cin">CIN:</label>
          <input
            type="text"
            id="cin"
            name="cin"
            value={formData.cin}
            onChange={handleInputChange}
            required
            placeholder="Entrez le CIN"
          />
        </div>
      </>
    ) : (
      <>
        <div className="form-group">
          <label htmlFor="raison_social">Raison Sociale:</label>
          <input
            type="text"
            id="raison_social"
            name="raison_social"
            value={formData.raison_social}
            onChange={handleInputChange}
            required
            placeholder="Entrez la raison sociale"
          />
        </div>
        <div className="form-group">
          <label htmlFor="num_stat">Numéro Statut:</label>
          <input
            type="text"
            id="num_stat"
            name="num_stat"
            value={formData.num_stat}
            onChange={handleInputChange}
            required
            placeholder="Entrez le numéro de statut"
          />
        </div>
        <div className="form-group">
          <label htmlFor="nif">NIF:</label>
          <input
            type="text"
            id="nif"
            name="nif"
            value={formData.nif}
            onChange={handleInputChange}
            required
            placeholder="Entrez le NIF"
          />
        </div>
      </>
    )}

    {/* Liste déroulante pour le type de tiers */}
    <div className="form-group">
      <label htmlFor="id_type_tiers">Type de tiers:</label>
       <select
      id="id_type_tiers"
      name="id_type_tiers"
      value={formData.id_type_tiers}
      onChange={handleInputChange}
      required
    >
      {typesTiers.length > 0 ? (
        typesTiers.map(type => (
          <option key={type.id_type_tiers} value={type.id_type_tiers}>
            {type.type_tiers}
          </option>
        ))
      ) : (
        <option value="">Aucun type de tiers disponible</option>  // Message en cas de liste vide
      )}
    </select>

    </div>

    <div className="button-group">
      <button type="submit" className="btn save-btn">Enregistrer</button>
    </div>
  </form>
)}


          {error && <p className="error-message">{error}</p>}
          {showConfirmation && <ConfirmationOk message="Tiers ajouté avec succès!" onClose={handleOk} />}
        </div>
      </div>
    </div>
  );
}

export default SaisieNouveauTiers;
