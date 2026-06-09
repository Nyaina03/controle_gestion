import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Sidebar.css';
import '../css/EtatsAEtablir.css';
import '../css/ConfirmationModal.css';
import Sidebar from "../Sidebar";
import Header from "../Header";
import ConfirmationModal from '../ConfirmationModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function ListeDesComptes() {
    const [comptes, setComptes] = useState([]);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({ id_compte: '', code: '',libelle: '',id_type_compte: ''});
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [type_compte, setTypeCompte] = useState('');
    const [typeComptesList, setTypeComptesList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8000/api/type_compte/list')
          .then(response => response.json())
          .then(data => setTypeComptesList(data))
          .catch(error => console.error('Error fetching type comptes:', error));
      }, []);

    useEffect(() => {
        fetch('http://localhost:8000/api/comptes/comptes/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('La réponse du réseau n\'était pas correcte');
                }
                return response.json();
            })
            .then(data => setComptes(data))
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
            fetch(`http://localhost:8000/api/comptes/comptes/${deleteId}/`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        setComptes(comptes.filter(compte => compte.id_compte !== deleteId));
                        setConfirmDelete(false);
                        setDeleteId(null);
                    }
                })
                .catch(error => console.error('Erreur :', error));
        }
    };

    const handleEditClick = (compte) => {
        setEditData(compte);
        setShowEditModal(true);
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        fetch(`http://localhost:8000/api/comptes/comptes/${editData.id_compte}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editData),
        })
            .then(response => {
                if (response.ok) {
                    setComptes(comptes.map(c => c.id_compte === editData.id_compte ? editData : c));
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
                    <h2 className="div-h2">Liste des Comptes</h2>
                    {error && <div className="error">{error}</div>}
                    <button className="add-button" onClick={() => navigate('/saisie_plan_comptable')}>
                        <FontAwesomeIcon icon={faPlus} /> Ajouter Compte
                    </button>
                    <table className="tiers-table">
                        <thead>
                            <tr>
                                <th>Compte</th>
                                <th>Libellé</th>
                                <th>Type</th>
                                <th>Modifier</th>
                                <th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comptes.map((compte, index) => (
                                <tr key={compte.id_compte} className={index % 2 === 0 ? 'row-blue' : 'row-gray'}>
                                    <td>{compte.code}</td>
                                    <td>{compte.libelle}</td>
                                    <td>{compte.type_compte}</td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            className="action-icon edit-icon"
                                            title="Modifier"
                                            onClick={() => handleEditClick(compte)}
                                        />
                                    </td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="action-icon delete-icon"
                                            title="Supprimer"
                                            onClick={() => handleDeleteClick(compte.id_compte)}
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
                        message="Êtes-vous sûr de vouloir supprimer ce compte ?"
                        onConfirm={handleDeleteConfirm}
                        onCancel={() => setConfirmDelete(false)}
                    />
                )}
                {/* Edit Modal */}
                {showEditModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Modifier Compte</h3>
                            <form onSubmit={handleEditSubmit}>
                                <div className="form-group">
                                    <label htmlFor="compte">Compte:</label>
                                    <input
                                        type="number"
                                        id="code"
                                        value={editData.code}
                                        onChange={(e) => setEditData({ ...editData, code: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="libelle">Libellé:</label>
                                    <input
                                        type="text"
                                        id="libelle"
                                        value={editData.libelle}
                                        onChange={(e) => setEditData({ ...editData, libelle: e.target.value })}
                                    />
                                </div>
                                      {/* type_compte (Liste déroulante) */}
                                <div className="form-group">
                                <label htmlFor="type_compte">Type:</label>
                                <select
                                    id="type_compte"
                                    value={editData.id_type_compte}
                                    //onChange={(e) => setTypeCompte(e.target.value)}
                                    onChange={(e) => setEditData( {...editData, id_type_compte: e.target.value })}
                                    required // Validation automatique pour s'assurer qu'un type est sélectionné
                                >
                                    <option value="">-- Sélectionnez un type --</option>
                                    {typeComptesList.map((type) => (
                                    <option key={type.id_type_compte} value={type.id_type_compte}>
                                        {type.type_compte}
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
            </div>
        </div>
    );
}

export default ListeDesComptes;
