import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header"
import "./css/FormPage.css";
import "./css/Alerte.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from './ConfirmationModal'; // Modal de confirmation personnalisée
import { useNavigate } from 'react-router-dom';

const GestionTaches = () => {
  const [taches, setTaches] = useState([]);
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [newTache, setNewTache] = useState({
    titre: "",
    descriptions: "",
    date_debut: "",
    date_limite: "",
    statut: "Non commencé",
  });

  const [editData, setEditData] = useState(null); // Corrected to hold the task being edited
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [tacheToDelete, setTacheToDelete] = useState(null);

  const handleEditClick = (tache) => {
    setEditData(tache);
    setShowEditModal(true);
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    fetch(`http://localhost:8000/api/taches/taches/${editData.id_tache}/`, {
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
      .then(updatedTache => {
        setTaches(taches.map(t => (t.id === updatedTache.id ? updatedTache : t)));
        setShowEditModal(false);
      })
      .catch(error => console.error('Erreur :', error));
  };

  const handleDeleteClick = (id_tache) => {
    setTacheToDelete(id_tache);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = () => {
    fetch(`http://localhost:8000/api/taches/taches/${tacheToDelete}/`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression');
        }
        setTaches(taches.filter(t => t.id_tache !== tacheToDelete));
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

  useEffect(() => {
    fetch("http://localhost:8000/api/taches/taches/")
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des tâches");
        }
        return response.json();
      })
      .then(data => setTaches(data))
      .catch(error => console.error("Erreur:", error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost:8000/api/taches/taches/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTache),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur lors de l’ajout de la tâche");
        }
        return response.json();
      })
      .then(data => {
        setTaches([...taches, data]);
        setNewTache({
          titre: "",
          descriptions: "",
          date_debut: "",
          date_limite: "",
          statut: "Non commencé",
        });
      })
      .catch(error => console.error("Erreur:", error));
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <h2 className="div-h2">Gestion des Tâches</h2>

          {/* Formulaire d'ajout de tâche */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="titre">Titre :</label>
              <input
                type="text"
                id="titre"
                placeholder="Titre de la tâche"
                value={newTache.titre}
                onChange={(e) => setNewTache({ ...newTache, titre: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description :</label>
              <textarea
                id="description"
                placeholder="Description"
                value={newTache.descriptions}
                onChange={(e) =>
                  setNewTache({ ...newTache, descriptions: e.target.value })
                }
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="date_debut">Date de début :</label>
              <input
                type="date"
                id="date_debut"
                value={newTache.date_debut}
                onChange={(e) =>
                  setNewTache({ ...newTache, date_debut: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date_limite">Date limite :</label>
              <input
                type="date"
                id="date_limite"
                value={newTache.date_limite}
                onChange={(e) =>
                  setNewTache({ ...newTache, date_limite: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="statut">Statut :</label>
              <select
                id="statut"
                value={newTache.statut}
                onChange={(e) => setNewTache({ ...newTache, statut: e.target.value })}
              >
                <option value="Non commencé">Non commencé</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
              </select>
            </div>

            <div className="button-group">
              <button type="submit" className="btn save-btn">
                Ajouter la tâche
              </button>
            </div>
          </form>

          {/* Liste des tâches */}
          {taches.length > 0 ? (
            <table className="tiers-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Description</th>
                  <th>Date de début</th>
                  <th>Date limite</th>
                  <th>Statut</th>
                  <th>Modifier</th>
                  <th>Supprimer</th>
                </tr>
              </thead>
              <tbody>
                {taches.map((tache, index) => {
                  const dateLimite = new Date(tache.date_limite);
                  const today = new Date();
                  const diffInTime = dateLimite - today;
                  const diffInDays = Math.ceil(diffInTime /(1000*3600*24));
                  const isUrgent = diffInDays >= 0 && diffInDays <= 5;
                  return(
                  <tr key={index} className={isUrgent ? "ligne-urgente" : ""}>
                    <td>{tache.titre}</td>
                    <td>{tache.descriptions}</td>
                    <td>{tache.date_debut}</td>
                    <td>{dateLimite.toLocaleDateString()}</td>
                    <td>{tache.statut}</td>
                    
                    {/* Icône pour modifier */}
                    <td>
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="action-icon edit-icon"
                        title="Modifier"
                        onClick={() => handleEditClick(tache)}
                      />
                    </td>

                    {/* Icône pour supprimer */}
                    <td>
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="action-icon delete-icon"
                        title="Supprimer"
                        onClick={() => handleDeleteClick(tache.id_tache)}
                      />
                    </td>
                  </tr>
                  );
})}
              </tbody>
            </table>
          ) : (
            <p className="error-message">Aucune tâche disponible.</p>
          )}
        </div>

        {/* Modal de modification */}
        {showEditModal && editData && (
          <div className="modal">
            <div className="modal-content">
              <h3>Modifier Tâche</h3>
              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label htmlFor="edit-titre">Titre :</label>
                  <input
                    type="text"
                    id="edit-titre"
                    placeholder="Titre de la tâche"
                    value={editData.titre}
                    onChange={(e) => setEditData({ ...editData, titre: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-description">Description :</label>
                  <textarea
                    id="edit-description"
                    placeholder="Description"
                    value={editData.descriptions}
                    onChange={(e) =>
                      setEditData({ ...editData, descriptions: e.target.value })
                    }
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-date-debut">Date de début :</label>
                  <input
                    type="date"
                    id="edit-date-debut"
                    value={editData.date_debut}
                    onChange={(e) =>
                      setEditData({ ...editData, date_debut: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-date-limite">Date limite :</label>
                  <input
                    type="date"
                    id="edit-date-limite"
                    value={editData.date_limite}
                    onChange={(e) =>
                      setEditData({ ...editData, date_limite: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-statut">Statut :</label>
                  <select
                    id="edit-statut"
                    value={editData.statut}
                    onChange={(e) =>
                      setEditData({ ...editData, statut: e.target.value })
                    }
                  >
                    <option value="Non commencé">Non commencé</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                  </select>
                </div>

                <div className="button-group">
                  <button type="submit" className="btn save-btn">
                    Enregistrer les modifications
                  </button>
                  <button
                    type="button"
                    className="btn cancel-btn"
                    onClick={() => setShowEditModal(false)}
                  >
                    Annuler
                  </button>
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
};

export default GestionTaches;
