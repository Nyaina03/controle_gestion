import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Sidebar.css';
import './css/EtatsAEtablir.css'; // Réutilisation des styles existants pour les couleurs alternées
import Sidebar from "./Sidebar";
import Header from "./Header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from './ConfirmationModal'; // Modal de confirmation personnalisée

function ListeDesTiers() {
  const navigate = useNavigate();
  const [tiersData, setTiersData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    id_tiers: '',
    nom: '',
    prenoms: '',
    contact: '',
    raison_social: '',
    num_stat: '',
    nif: '',
    cin: '',
    localite: '',
    type_tiers: ''
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [tierToDelete, setTierToDelete] = useState(null);
  const [villes, setVilles] = useState([]);
  const [typeTiers, setTypeTiers] = useState([]);

  // Charger les données des tiers depuis l'API Django
useEffect(() => {
  fetch('http://localhost:8000/api/tiers/tiers/')
    .then(response => response.json())
    .then(data => {
      console.log('Data fetched:', data); // Check API response
      setTiersData(data);
    })
    .catch(error => console.error('Erreur lors de la chargement des tiers:', error));
}, []);

useEffect(() => {
  fetch('http://localhost:8000/api/type_tiers/list/')
    .then(response => response.json())
    .then(data => {
      console.log('Data fetched:', data); // Check API response
      setTypeTiers(data);
    })
    .catch(error => console.error('Erreur lors de la chargement des types de tiers:', error));
}, []);

useEffect(() => {
  fetch('http://localhost:8000/api/localites/villes/')
    .then(response => response.json())
    .then(data => {
      console.log('Data fetched:', data); // Check API response
      setVilles(data);
    })
    .catch(error => console.error('Erreur lors de la chargement des villes:', error));
}, []);


  const handleEditClick = (tier) => {
    setEditData(tier);
    setShowEditModal(true);
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    fetch(`http://localhost:8000/api/tiers/tiers/${editData.id_tiers}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la modification');
        }
        return response.json();
      })
      .then(updatedTier => {
        setTiersData(tiersData.map(t => (t.id_tiers === updatedTier.id_tiers ? updatedTier : t)));
        setShowEditModal(false);
      })
      .catch(error => console.error('Erreur :', error));
  };

  const handleDeleteClick = (id_tiers) => {
    setTierToDelete(id_tiers);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = () => {
    fetch(`http://localhost:8000/api/tiers/tiers/${tierToDelete}/`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression');
        }
        setTiersData(tiersData.filter(t => t.id_tiers !== tierToDelete));
        setShowDeleteConfirmation(false);
      })
      .catch(error => {
        console.error('Erreur lors de la suppression:', error);
        setShowDeleteConfirmation(false);
      });
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Liste des tiers</h2>

          {/* Bouton d'ajout */}
          <button className="add-button" onClick={() => navigate('/saisie_nouveau_tiers')}>
            <FontAwesomeIcon icon={faPlus} /> Ajouter Tiers
          </button>

          <table className="tiers-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prenoms</th>
                <th>Contact</th>
                <th>Raison Sociale</th>
                <th>NUM STAT</th>
                <th>NIF</th>
                <th>CIN</th>
                <th>Localité</th>
                <th>Type Tiers</th>
                <th>Modifier</th>
                <th>Supprimer</th>
              </tr>
            </thead>
              <tbody>
                {tiersData.map((tier, index) => (
                  <tr key={tier.id_tiers} className={index % 2 === 0 ? 'row-blue' : 'row-gray'}>
                         <td>{tier.id_tiers}</td>
                          <td>{tier.nom || 'Non spécifié'}</td> {/* Check for undefined */}
                          <td>{tier.prenoms || 'Non spécifié'}</td> {/* Check for undefined */}
                          <td>{tier.contact || 'Non spécifié'}</td> {/* Check for undefined */}
                          <td>{tier.raison_social || 'Non spécifié'}</td> {/* Check for undefined */}
                          <td>{tier.num_stat || 'Non spécifié'}</td> {/* Check for undefined */}
                          <td>{tier.nif || 'Non spécifié'}</td> {/* Check for undefined */}
                          <td>{tier.cin || 'Non spécifié'}</td> {/* Check for undefined */}
                          <td>{tier.nom_ville || 'Non spécifié'}</td> {/* Check for undefined */}
                          <td>{tier.type_tiers || 'Non spécifié'}</td> {/* Check for undefined */}


                    {/* Icône pour modifier */}
                    <td>
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="action-icon edit-icon"
                        title="Modifier"
                        onClick={() => handleEditClick(tier)}
                      />
                    </td>

                    {/* Icône pour supprimer */}
                    <td>
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="action-icon delete-icon"
                        title="Supprimer"
                        onClick={() => handleDeleteClick(tier.id_tiers)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
        </div>

        {/* Modal de modification */}
        {showEditModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Modifier Tiers</h3>
              <form onSubmit={handleEditSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nom">Nom:</label>
                    <input
                      type="text"
                      id="nom"
                      value={editData.nom}
                      onChange={(e) => setEditData({ ...editData, nom: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="prenoms">Prénoms:</label>
                    <input
                      type="text"
                      id="prenoms"
                      value={editData.prenoms}
                      onChange={(e) => setEditData({ ...editData, prenoms: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact">Contact:</label>
                    <input
                      type="text"
                      id="contact"
                      value={editData.contact}
                      onChange={(e) => setEditData({ ...editData, contact: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="raison_social">Raison Sociale:</label>
                    <input
                      type="text"
                      id="raison_social"
                      value={editData.raison_social}
                      onChange={(e) => setEditData({ ...editData, raison_social: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="num_stat">NUM STAT:</label>
                    <input
                      type="text"
                      id="num_stat"
                      value={editData.num_stat}
                      onChange={(e) => setEditData({ ...editData, num_stat: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nif">NIF:</label>
                    <input
                      type="text"
                      id="nif"
                      value={editData.nif}
                      onChange={(e) => setEditData({ ...editData, nif: e.target.value })}
                    />
                  </div>
                </div>
                
                  <div className="form-group">
                    <label htmlFor="cin">CIN:</label>
                    <input
                      type="text"
                      id="cin"
                      value={editData.cin}
                      onChange={(e) => setEditData({ ...editData, cin: e.target.value })}
                    />
                  </div>
                      {/* villes (Liste déroulante) */}
                      <div className="form-group">
                        <label htmlFor="ville">Ville:</label>
                            <select
                              id="ville"
                              value={editData.id_ville}
                              onChange={(e) => setEditData( {...editData, id_ville: e.target.value })}
                              required // Validation automatique pour s'assurer qu'un type est sélectionné
                            >
                              <option value="">-- Sélectionnez une ville --</option>
                                {villes.map((ville) => (
                              <option key={ville.id_ville} value={ville.id_ville}>
                                {ville.nom_ville}
                              </option>
                                ))}
                              </select>
                      </div>
                                {/* villes (Liste déroulante) */}
                      <div className="form-group">
                        <label htmlFor="typeTiers">Type de tiers:</label>
                          <select
                            id="typeTiers"
                            value={editData.id_type_tiers}
                            onChange={(e) => setEditData( {...editData, id_type_tiers: e.target.value })}
                            required // Validation automatique pour s'assurer qu'un type est sélectionné
                          >
                            <option value="">-- Sélectionnez un type --</option>
                                {typeTiers.map((type) => (
                            <option key={type.id_type_tiers} value={type.id_type_tiers}>
                                {type.type_tiers}
                            </option>
                            ))}
                            </select>
                      </div>

                <div className="button-group">
                  <button type="submit">Enregistrer</button>
                  <button type="button" onClick={() => setShowEditModal(false)}>Annuler</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        {showDeleteConfirmation && (
          <ConfirmationModal
            message="Êtes-vous sûr de vouloir supprimer ce tiers ?"
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
          />
        )}
      </div>
    </div>
  );
}

export default ListeDesTiers;
