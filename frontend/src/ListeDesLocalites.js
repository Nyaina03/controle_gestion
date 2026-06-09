import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Sidebar.css';
import './css/EtatsAEtablir.css';
import './css/ConfirmationModal.css';
import Sidebar from "./Sidebar";
import Header from "./Header";
import ConfirmationModal from './ConfirmationModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function ListeDesLocalites() {
    const [villes, setVilles] = useState([]);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({ id_ville: '', nom_ville: '', code_ville: '' });
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8000/api/localites/villes/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('La réponse du réseau n\'était pas correcte');
                }
                return response.json();
            })
            .then(data => setVilles(data))
            .catch(error => {
                console.error('Erreur :', error);
                setError(error.message);
            });
    }, []);

    const handleDeleteClick = (id) => {
        setConfirmDelete(true);
        setDeleteId(id);
    };

    const handleDeleteConfirm = () => {
        if (deleteId) {
            fetch(`http://localhost:8000/api/localites/villes/${deleteId}/`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        setVilles(villes.filter(ville => ville.id_ville !== deleteId));
                        setConfirmDelete(false);
                        setDeleteId(null);
                    }
                })
                .catch(error => console.error('Erreur :', error));
        }
    };

    const handleEditClick = (ville) => {
        setEditData(ville);
        setShowEditModal(true);
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        fetch(`http://localhost:8000/api/localites/villes/${editData.id_ville}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editData),
        })
            .then(response => {
                if (response.ok) {
                    setVilles(villes.map(v => v.id_ville === editData.id_ville ? editData : v));
                    setShowEditModal(false);
                } else {
                    throw new Error('Erreur lors de la modification');
                }
            })
            .catch(error => console.error('Erreur :', error));
    };

    return (
        <div className="dashboard-page">
            <Sidebar />
            <div className="main-content">
                <Header />
                <div className="form-container">
                    <h2 className="div-h2">Liste des Localités</h2>
                    {error && <div className="error">{error}</div>}
                    <button className="add-button" onClick={() => navigate('/saisie_nouvelle_localite')}>
                        <FontAwesomeIcon icon={faPlus} /> Ajouter Localité
                    </button>
                    <table className="tiers-table">
                        <thead>
                            <tr>
                                <th>Code Loc</th>
                                <th>Nom Localité</th>
                                <th>Type Localité</th>
                                <th>Modifier</th>
                                <th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {villes.map((ville, index) => (
                                <tr key={ville.id_ville} className={index % 2 === 0 ? 'row-blue' : 'row-gray'}>
                                    <td>{ville.code_ville}</td>
                                    <td>{ville.nom_ville}</td>
                                    <td>{ville.type_ville}</td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            className="action-icon edit-icon"
                                            title="Modifier"
                                            onClick={() => handleEditClick(ville)}
                                        />
                                    </td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="action-icon delete-icon"
                                            title="Supprimer"
                                            onClick={() => handleDeleteClick(ville.id_ville)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Confirmation Modal */}
                {confirmDelete && (
                    <ConfirmationModal
                        message="Êtes-vous sûr de vouloir supprimer cette localité ?"
                        onConfirm={handleDeleteConfirm}
                        onCancel={() => setConfirmDelete(false)}
                    />
                )}
                {/* Edit Modal */}
                {showEditModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Modifier Localité</h3>
                            <form onSubmit={handleEditSubmit}>
                                <div className="form-group">
                                    <label htmlFor="nom_ville">Nom de la Ville:</label>
                                    <input
                                        type="text"
                                        id="nom_ville"
                                        value={editData.nom_ville}
                                        onChange={(e) => setEditData({ ...editData, nom_ville: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="code_ville">Code de la Ville:</label>
                                    <input
                                        type="text"
                                        id="code_ville"
                                        value={editData.code_ville}
                                        onChange={(e) => setEditData({ ...editData, code_ville: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="type_ville">Type:</label>
                                    <input
                                        type="text"
                                        id="type_ville"
                                        value={editData.type_ville}
                                        onChange={(e) => setEditData({ ...editData, type_ville: e.target.value })}
                                    />
                                </div>
                                <div className="button-group">
                                    <button type="submit">Enregistrer</button>
                                    <button type="button" onClick={() => setShowEditModal(false)}>Annuler</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ListeDesLocalites;
