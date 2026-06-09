import React, { useState, useEffect } from 'react';
import './css/FormPage.css'; // Assurez-vous que ce fichier existe pour le style
import Sidebar from './Sidebar';
import Header from './Header';
import ConfirmationOk from './ConfirmationOk';

function SaisieMarchesAttribues() {
  // Déclaration des états pour chaque champ
  const [annee, setAnnee] = useState('');
  const [comptes, setComptes] = useState([]);
  const [compte, setCompte] = useState('');
  const [num_marche, setNumMarche] = useState('');
  const [financement, setFinancement] = useState('');
  const [financements, setFinancements] = useState([]);
  const [type_depense, setDepense] = useState('');
  const [type_depenses, setDepenses] = useState([]);
  const [objet_marche, setObjetMarche] = useState('');
  const [attributaire, setAttributaire] = useState('');
  const [montant_ht, setMontantHt] = useState('');
  const [tva, setTva] = useState('');
  const [num_os, setNumOs] = useState('');
  const [date_os, setDateOs] = useState('');
  const [num_sur_registre, setNumSurRegistre] = useState('');
  const [delai_en_jour, setDelai] = useState('');
  const [date_signature, setDateSignature] = useState('');
  const [date_notification, setDateNotif] = useState('');
  const [observation, setObservation] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
  
    fetch('http://localhost:8000/api/financement/liste_financement/')
      .then(response => response.json())
      .then(data => setFinancements(data))
      .catch(error => console.error('Erreur lors du chargement des localités:', error));

      fetch('http://localhost:8000/api/typeDepense/liste_type_depense/')
      .then(response => response.json())
      .then(data => setDepenses(data))
      .catch(error => console.error('Erreur lors du chargement des financement:', error));
    
      // Charger les comptes
    fetch('http://localhost:8000/api/comptes/comptes/')
      .then(response => response.json())
      .then(data => setComptes(data))
      .catch(error => console.error('Erreur lors du chargement des comptes:', error));
  }, []);

  // Fonction de soumission du formulaire
  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null); // Réinitialiser l'erreur avant la soumission
  
    // Convertir le montant en nombre flottant
    const montantFloat = parseFloat(montant_ht.trim());
    if (isNaN(montantFloat)) {
      setError('Le montant est invalide.');
      return;  // Empêche l'envoi du formulaire si le montant est invalide
    }
  
    // Convertir id_compte et id_ville en entiers
    const idCompteInt = parseInt(compte, 10);  // Convertir en entier
    const idFinacementInt = parseInt(financement, 10);  // Convertir en entier
    const idTypeDepenseInt = parseInt(type_depense, 10);
    const tvaInt = parseInt(tva, 10);
    const delaiInt = parseInt(delai_en_jour, 10);
  
    // Vérifier que les conversions en entier sont valides
    if (isNaN(idCompteInt) || isNaN(idFinacementInt)  || isNaN(idTypeDepenseInt) || isNaN(delaiInt)) {
      setError("Les données de compte ou de financement ou de type depense sont invalides.");
      return;  // Empêche l'envoi du formulaire si les conversions échouent
    }
  
    // Préparer les données du budget
    const marchesData = {
      annee,
      id_compte: idCompteInt, 
      num_marche,
      id_financement  : idFinacementInt,
      id_type_depense : idTypeDepenseInt,
      objet_marche,
      attributaire,
      montant_ht: montantFloat,
      tva : tvaInt,
      num_os,
      date_os,
      num_sur_registre,
      delai_en_jour : delaiInt,
      date_signature,
      date_notification,
      observation,

    };
  
    // Envoi des données au serveur
    fetch('http://localhost:8000/api/marches/liste_marches/', {  // Ajustez l'URL de l'API
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(marchesData),
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
        if (data.id_marche) {
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
  };

  

  return (
    <div className="form-page">
      {/* Sidebar et Header */}
      <Sidebar />
      <div className="main-content">
        <Header />

        {/* Formulaire */}
        <div className="form-container">
            <div className="div-h2">
            <h2>Saisie Marchés</h2>
            </div>
          <form onSubmit={handleSubmit} className="form">
            {/* Champ Année */}
            <div className="form-group">
              <label htmlFor="annee">Année:</label>
              <input
                id="annee"
                type="number"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                required
              />
            </div>


            {/* Champ compte */}
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
                  //.filter(compte => compte.id_type_compte === 1 && compte.id_compte !==1 && compte.id_compte !==2)  // Filtre les comptes avec id_type_compte = 1
                  .map(compte => (
                    <option key={compte.id_compte} value={compte.id_compte}>
                      {compte.code} - {compte.libelle}
                    </option>
                  ))}
              </select>
            </div>

            {/* Champ num marché */}
            <div className="form-group">
              <label htmlFor="num_marche">Numéro Marché :</label>
              <input
                type="text"
                id="num_marche"
                value={num_marche}
                onChange={(e) => setNumMarche(e.target.value)}
                required
              />
            </div>

              {/* Champ financement */}
            <div className="form-group">
              <label htmlFor="financement">Financement :</label>
              <select
                id="financement"
                value={financement}
                onChange={(e) => setFinancement(e.target.value)}
                required
              >
                <option value="">Choisir financement</option>
                {financements.map((financement) => (
                  <option key={financement.id_financement} value={financement.id_financement}>
                    {financement.financement}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="depenses">Type de Dépenses :</label>
              <select
                id="depenses"
                value={type_depense}
                onChange={(e) => setDepense(e.target.value)}
                required
              >
                <option value="">Choisir type dépenses</option>
                {type_depenses.map((type_depense) => (
                  <option key={type_depense.id_type_depense} value={type_depense.id_type_depense}>
                    {type_depense.type_depense}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="obj_marche">Objet du  Marché :</label>
              <input
                type="text"
                id="obj_marche"
                value={objet_marche}
                onChange={(e) => setObjetMarche(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="attributaire">Attributaire :</label>
              <input
                type="text"
                id="attributaire"
                value={attributaire}
                onChange={(e) => setAttributaire(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="montant_ht">Montant HT :</label>
              <input
                type="number"
                id="montant_ht"
                value={montant_ht}
                onChange={(e) => setMontantHt(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tva">TVA :</label>
              <input
                type="number"
                id="tva"
                value={tva}
                onChange={(e) => setTva(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="num_os">Numero Os :</label>
              <input
                type="text"
                id="num_os"
                value={num_os}
                onChange={(e) => setNumOs(e.target.value)}
                required
              />
            </div>

            
            <div className="form-group">
              <label htmlFor="date_os">Date Os :</label>
              <input
                type="date"
                id="date_os"
                value={date_os}
                onChange={(e) => setDateOs(e.target.value)}
                required
              />
            </div>

            
            <div className="form-group">
              <label htmlFor="num_sur_registre">Numero sur Registre :</label>
              <input
                type="text"
                id="num_sur_registre"
                value={num_sur_registre}
                onChange={(e) => setNumSurRegistre(e.target.value)}
                required
              />
            </div>

            
            <div className="form-group">
              <label htmlFor="delai">Delai en jour :</label>
              <input
                type="number"
                id="delai"
                value={delai_en_jour}
                onChange={(e) => setDelai(e.target.value)}
                required
              />
            </div>

            
            <div className="form-group">
              <label htmlFor="date_signature">Date Signature :</label>
              <input
                type="date"
                id="date_signature"
                value={date_signature}
                onChange={(e) => setDateSignature(e.target.value)}
                required
              />
            </div>

            
            <div className="form-group">
              <label htmlFor="date_notif">Date Notification :</label>
              <input
                type="date"
                id="date_notif"
                value={date_notification}
                onChange={(e) => setDateNotif(e.target.value)}
                required
              />
            </div>

            
            <div className="form-group">
              <label htmlFor="observation">Observations :</label>
              <input
                type="text"
                id="observation"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                required
              />
            </div>



            {/* Bouton de soumission */}
            <div className="button-group">
              <button type="submit" className="btn save-btn">
                Enregistrer
              </button>
            </div>
          </form>

          {error && <p className="error-message">{error}</p>}
          {showConfirmation && <ConfirmationOk message="Marche ajouté avec succès!" onClose={handleOk} />}
        </div>
      </div>
    </div>
  );
}

export default SaisieMarchesAttribues;
