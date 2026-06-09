import React, { useState, useEffect } from 'react';
import Header from './Header';  // Assurez-vous que ce chemin est correct
import Sidebar from './Sidebar'; // Assurez-vous que ce chemin est correct
import './css/FormPage.css';  // CSS pour styliser le composant
import ConfirmationOk from './ConfirmationOk';
import { useNavigate } from 'react-router-dom';

function SaisiePta() {
  const [annee, setAnnee] = useState('');
  const [code_strategique, setCodeStrategique] = useState('');
  const [code_activite, setCodeActivite]  = useState('');
  const [libelle, setLibelle] = useState('');
  const [montant, setMontant] = useState('');
  const [direction, setDirection] = useState('');
  const [directions, setDirections] = useState([]);
  const [code_programme, setCodeProgramme] = useState('');
  const [ref_dos, setRefDos] = useState('');
  const [dos, setDos] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    // Charger les directions
    fetch('http://localhost:8000/api/direction/liste_direction/')
      .then(response => response.json())
      .then(data => setDirections(data))
      .catch(error => console.error('Erreur lors du chargement des directions:', error));

  }, []);

  useEffect(() => {
    // Charger les directions
    fetch('http://localhost:8000/api/dos/dos/')
      .then(response => response.json())
      .then(data => setDos(data))
      .catch(error => console.error('Erreur lors du chargement des dos:', error));

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
    const idDirectionInt = parseInt(direction, 10);  // Convertir en entier// Convertir en entier
    const idDosInt = parseInt(ref_dos, 10);
    // Vérifier que les conversions en entier sont valides
    if (isNaN(idDirectionInt)) {
      setError("Les données de direction  sont invalides.");
      return;  // Empêche l'envoi du formulaire si les conversions échouent
    }

    if (isNaN(idDosInt)) {
      setError("Les données de dos  sont invalides.");
      return;  // Empêche l'envoi du formulaire si les conversions échouent
    }
  
    // Préparer les données du budget
    const ptaData = {
      annee,
      code_strategique,
      code_activite,
      libelle,
      montant : montantFloat,
      id_direction : idDirectionInt,
      code_programme,
      ref_dos : idDosInt,
    };
  
    // Envoi des données au serveur
    fetch('http://localhost:8000/api/pta/pta/', {  // Ajustez l'URL de l'API
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ptaData),
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
        if (data.id_pta) {
          setShowConfirmation(true);
        } else {
          throw new Error("Erreur lors de l'ajout du pta.");
        }
      })
      .catch(error => {
        console.error("Erreur lors de l'ajout du pta", error);
        setError("Une erreur est survenue. Veuillez réessayer.");
      });
  };

  
  const handleOk = () => {
    setShowConfirmation(false); // Fermer la fenêtre de confirmation
    {navigate('/liste_pta')};
  };

  

  return (
    <div className="form-page">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="form-container">
          <div className="div-h2">
            <h2>Saisie du PTA</h2>
          </div>
          <form onSubmit={handleSubmit} className="saisie-pta-form">
            <div className="form-group">
              <label>Année</label>
              <input 
                type="number" 
                name="annee" 
                value={annee} 
                onChange={(e) => setAnnee(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label>Code Stratégie</label>
              <input 
                type="text" 
                name="code_strategique" 
                value={code_strategique} 
                onChange={(e) => setCodeStrategique(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label>Code Activité</label>
              <input 
                type="text" 
                name="code_activite" 
                value={code_activite} 
                onChange={(e) => setCodeActivite(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label>Libellé</label>
              <input 
                type="text" 
                name="libelle" 
                value={libelle} 
                onChange={(e) => setLibelle(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label>Montant</label>
              <input 
                type="number" 
                name="montant" 
                value={montant} 
                onChange={(e) => setMontant(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="direction-select">Direction:</label>
              <select
                id="direction-select"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                required
              >
                <option value="">--Choisissez une direction--</option>
                {directions.map(direction => (
                  <option key={direction.id_direction} value={direction.id_direction}>
                    {direction.nom_direction}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dos-select">Dos:</label>
              <select
                id="dos-select"
                value={ref_dos}
                onChange={(e) => setRefDos(e.target.value)}
                required
              >
                <option value="">--Choisissez une ref Dos--</option>
                {dos.map(d => (
                  <option key={d.id_dos} value={d.id_dos}>
                    {d.ref_dos}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Code Programme</label>
              <select
                type="text" 
                name="code_programme" 
                value={code_programme}
                onChange={(e) => setCodeProgramme(e.target.value)}
                required 
            >
              <option value={""}> --choisissez-- </option>
              <option value={"22"}> 22 </option>
              <option value={"209"}> 209</option>
              </select>
            </div>



            <div className="button-group">
              <button type="submit" className="btn-submit">Enregistrer</button>
            </div>
          </form>

          {error && <p className="error-message">{error}</p>}
          {showConfirmation && <ConfirmationOk message="PTA ajouté avec succès!" onClose={handleOk} />}
        </div>
      </div>
    </div>
  );
}

export default SaisiePta;
