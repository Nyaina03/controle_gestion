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

function ListeDesBudgets() {
    const [budgets, setBudgets] = useState([]);
    const [villes, setVilles] = useState([]);
    const [comptes, setComptes] = useState([]);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({ id_budget: '', annee: '',code_programme: '',id_compte: '', montant: '',libelle :'', id_ville: '' });
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8000/api/budget/budget/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('La réponse du réseau n\'était pas correcte');
                }
                return response.json();
            })
            .then(data => setBudgets(data))
            .catch(error => {
                console.error('Erreur :', error);
                setError(error.message);
            });
    }, []);

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
            fetch(`http://localhost:8000/api/budget/budget/${deleteId}/`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        setBudgets(budgets.filter(budget => budget.id_budget !== deleteId));
                        setConfirmDelete(false);
                        setDeleteId(null);
                    }
                })
                .catch(error => console.error('Erreur :', error));
        }
    };

    const handleEditClick = (budget) => {
        setEditData(budget);
        setShowEditModal(true);
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        fetch(`http://localhost:8000/api/budget/budget/${editData.id_budget}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editData),
        })
            .then(response => {
                if (response.ok) {
                    setBudgets(budgets.map(b => b.id_budget === editData.id_budget ? editData : b));
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
                    <h2 className="div-h2">Liste des Budgets</h2>
                    {error && <div className="error">{error}</div>}
                    <button className="add-button" onClick={() => navigate('/saisie_budget')}>
                        <FontAwesomeIcon icon={faPlus} /> Ajouter Budget
                    </button>
                    <table className="tiers-table">
                        <thead>
                            <tr>
                                <th>Annee</th>
                                <th>Code Programme</th>
                                <th>Compte</th>
                                <th>Montant</th>
                                <th>Libellé</th>
                                <th>Localité</th>
                                <th>Modifier</th>
                                <th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budgets.map((budget, index) => (
                                <tr key={budget.id_budget} className={index % 2 === 0 ? 'row-blue' : 'row-gray'}>
                                    <td>{budget.annee}</td>
                                    <td>{budget.code_programme}</td>
                                    <td>{budget.code_compte}</td>
                                    <td>{budget.montant}</td>
                                    <td>{budget.libelle}</td>
                                    <td>{budget.nom_ville}</td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            className="action-icon edit-icon"
                                            title="Modifier"
                                            onClick={() => handleEditClick(budget)}
                                        />
                                    </td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="action-icon delete-icon"
                                            title="Supprimer"
                                            onClick={() => handleDeleteClick(budget.id_budget)}
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
                        message="Êtes-vous sûr de vouloir supprimer ce budget ?"
                        onConfirm={handleDeleteConfirm}
                        onCancel={() => setConfirmDelete(false)}
                    />
                )}
                {/* Edit Modal */}
                {showEditModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Modifier Budget</h3>
                            <form onSubmit={handleEditSubmit}>
                                <div className="form-group">
                                    <label htmlFor="annee">annee:</label>
                                    <input
                                        type="number"
                                        id="annee"
                                        value={editData.annee}
                                        onChange={(e) => setEditData({ ...editData, annee: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="code_programme">Code programme:</label>
                                    <input
                                        type="number"
                                        id="code_programme"
                                        value={editData.code_programme}
                                        onChange={(e) => setEditData({ ...editData, code_programme: e.target.value })}
                                    />
                                </div>
                              
                                {/* villes (Liste déroulante) */}
                                 <div className="form-group">
                                    <label htmlFor="compte">Compte:</label>
                                    <select
                                        id="compte"
                                        value={editData.id_compte}
                                        //onChange={(e) => setTypeCompte(e.target.value)}
                                        onChange={(e) => setEditData( {...editData, id_compte: e.target.value })}
                                        required // Validation automatique pour s'assurer qu'un type est sélectionné
                                    >
                                        <option value="">-- Sélectionnez un compte --</option>
                                        {comptes.map((compte) => (
                                        <option key={compte.id_compte} value={compte.id_compte}>
                                            {compte.code}
                                        </option>
                                        ))}
                                    </select>
                                    </div>
                                <div className="form-group">
                                    <label htmlFor="montant">Montant:</label>
                                    <input
                                        type="number"
                                        id="montant"
                                        value={editData.montant}
                                        onChange={(e) => setEditData({ ...editData, montant: e.target.value })}
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
                                        {villes.map((compte) => (
                                        <option key={compte.id_ville} value={compte.id_ville}>
                                            {compte.nom_ville}
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

export default ListeDesBudgets;
