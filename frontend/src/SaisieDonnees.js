import React, { useState, useEffect } from 'react';
import './css/FormPage.css'; // Assurez-vous que ce fichier existe pour le style
import Sidebar from './Sidebar';
import Header from './Header';
import ConfirmationOk from './ConfirmationOk';

function SaisieDonnees() {
  // Déclaration des états pour chaque champ
  const [annee, setAnnee] = useState('');
  const [demandeur, setDemandeur] = useState([]);
  const [selectedDemandeur, setSelectedDemandeur] = useState('');
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState('');
  const [quantite, setQuantite] = useState('');
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Charger les localités
    fetch('http://localhost:8000/api/creationArticle/creation_article/')
      .then(response => response.json())
      .then(data => setArticles(data))
      .catch(error => console.error('Erreur lors du chargement des articles:', error));


    fetch('http://localhost:8000/api/direction/liste_direction/')
      .then(response => response.json())
      .then(data => setDemandeur(data))
      .catch(error => console.error('Erreur lors du chargement des directions:', error));

  }, []);

  // Fonction de soumission du formulaire
  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null); // Réinitialiser les erreurs avant la soumission
    console.log('Formulaire soumis', { annee, demandeur, selectedArticle, quantite });


    const besoinParServiceData = {
      annee ,
      id_demandeur: selectedDemandeur, // Un entier, pas un tableau
      id_creation_article: parseInt(selectedArticle), // Convertir en entier
      quantite: parseInt(quantite) // Convertir en entier
    };
  
    fetch('http://localhost:8000/api/elaborationBudget/besoin_par_service/', { // Corrigez l'URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(besoinParServiceData),
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
        setShowConfirmation(true); // Affiche une confirmation si succès
      })
      .catch((error) => {
        console.error('Erreur lors de l\'ajout du besoin:', error);
        setError('Une erreur est survenue. Veuillez réessayer.');
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
            <h2>Saisie données</h2>
            </div>
          <form onSubmit={handleSubmit} className="form">
            {/* Champ Année */}
            <div className="form-group">
              <label htmlFor="annee">Année :</label>
              <input
                id="annee"
                type="number"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                required
                placeholder="Entrez le l année"
              />
            </div>

            {/* Champ Demandeur */}
            <div className="form-group">
              <label htmlFor="demandeur-select">Demandeur (Nom du service/direction) :</label>
              <select
                id="demandeur-select"
                value={selectedDemandeur}
                onChange={(e) => setSelectedDemandeur(parseInt(e.target.value))} // Convertir en entier
                required
              >
                <option value="">--Choisissez un demandeur--</option>
                {demandeur.map((d) => (
                  <option key={d.id_direction} value={d.id_direction}> {/* Envoyer uniquement l'id_direction */}
                    {d.nom_direction}
                  </option>
                ))}
              </select>

            </div>

            {/* Champ Code Article */}
          <div className="form-group">
            <label htmlFor="article-select">Article:</label>
            <select
              id="article-select"
              value={selectedArticle}
              onChange={(e) => setSelectedArticle(e.target.value)}
              required
            >
              <option value="">--Choisissez un article--</option>
              {articles.map((article) => (
                <option key={article.id_creation_article} value={article.id_creation_article}>
                  {article.id_creation_article} - {article.article}
                </option>
              ))}
            </select>
          </div>

            {/* Champ Quantité */}
            <div className="form-group">
              <label htmlFor="quantite">Quantité :</label>
              <input
                type="number"
                id="quantite"
                value={quantite}
                onChange={(e) => setQuantite(e.target.value)}
                required
                min="1"
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
          {showConfirmation && <ConfirmationOk message="Besoin ajouté avec succès!" onClose={handleOk} />}
        </div>
      </div>
    </div>
  );
}

export default SaisieDonnees;
