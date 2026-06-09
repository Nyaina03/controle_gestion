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

function ListeDesFactures() {
    const [factures, setFactures] = useState([]);
    const [villes, setVilles] = useState([]);
    const [comptes, setComptes] = useState([]);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({ id_budget: '', annee: '',code_programme: '',id_compte: '', montant: '',libelle :'', id_ville: '' });
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [tiers, setTiers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8000/api/recetteAllApmf/recetteAllApmf/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('La réponse du réseau n\'était pas correcte');
                }
                return response.json();
            })
            .then(data => setFactures(data))
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
        fetch('http://localhost:8000/api/tiers/tiers/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('La réponse du réseau n\'était pas correcte');
                }
                return response.json();
            })
            .then(data => setTiers(data))
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
            fetch(`http://localhost:8000/api/recetteAllApmf/recetteAllApmf/${deleteId}/`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        setFactures(factures.filter(facture => facture.id_recette_apmf_all!== deleteId));
                        setConfirmDelete(false);
                        setDeleteId(null);
                    }
                })
                .catch(error => console.error('Erreur :', error));
        }
    };

    const handleEditClick = (facture) => {
        setEditData(facture);
        setShowEditModal(true);
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        fetch(`http://localhost:8000/api/recetteAllApmf/recetteAllApmf/${editData.id_recette_apmf_all}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editData),
        })
            .then(response => {
                if (response.ok) {
                    setFactures(factures.map(f => f.id_recette_apmf_all === editData.id_recette_apmf_all ? editData : f));
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
                    <h2 className="div-h2">Liste des Factures</h2>
                    {error && <div className="error">{error}</div>}
                    <button className="add-button" onClick={() => navigate('/saisie_facture_allapmf')}>
                        <FontAwesomeIcon icon={faPlus} /> Ajouter Facture
                    </button>
                    <table className="tiers-table">
                        <thead>
                            <tr>
                                <th>Num Facture</th>
                                <th>Date</th>
                                <th>Libellé</th>
                                <th>Compte</th>
                                <th>Localité</th>
                                <th>Tiers</th>
                                <th>Montant HT</th>
                                <th>Montant TVA</th>
                                <th>Montant TTC</th>
                                <th>Modifier</th>
                                <th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {factures.map((facture, index) => (
                                <tr key={facture.id_recette_apmf_all} className={index % 2 === 0 ? 'row-blue' : 'row-gray'}>
                                    <td>{facture.num_facture}</td>
                                    <td>{facture.date_facture}</td>
                                    <td>{facture.libelle}</td>
                                    <td>{facture.code_compte}</td>
                                    <td>{facture.nom_ville}</td>
                                    <td>{facture.id_tiers}</td>
                                    <td>{facture.montant_ht}</td>
                                    <td>{facture.tva}</td>
                                    <td>{facture.montant_ttc}</td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            className="action-icon edit-icon"
                                            title="Modifier"
                                            onClick={() => handleEditClick(facture)}
                                        />
                                    </td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="action-icon delete-icon"
                                            title="Supprimer"
                                            onClick={() => handleDeleteClick(facture.id_recette_apmf_all)}
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
                        message="Êtes-vous sûr de vouloir supprimer cette facture ?"
                        onConfirm={handleDeleteConfirm}
                        onCancel={() => setConfirmDelete(false)}
                    />
                )}
                {/* Edit Modal */}
                {showEditModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Modifier Facture</h3>
                            <form onSubmit={handleEditSubmit}>
                                <div className="form-group">
                                    <label htmlFor="num_facture">Num Facture:</label>
                                    <input
                                        type="text"
                                        id="num_facture"
                                        value={editData.num_facture}
                                        onChange={(e) => setEditData({ ...editData, num_facture: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="date_facture">Date Facture:</label>
                                    <input
                                        type="date"
                                        id="date_facture"
                                        value={editData.date_facture}
                                        onChange={(e) => setEditData({ ...editData, date_facture: e.target.value })}
                                    />
                                </div>
                             
                              
                                {/* comptes (Liste déroulante) */}
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

                            {/* villes (Liste déroulante) */}
                                 <div className="form-group">
                                    <label htmlFor="ville">Ville:</label>
                                    <select
                                        id="ville"
                                        value={editData.id_ville}
                                        //onChange={(e) => setTypeCompte(e.target.value)}
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

                                 {/* tiers (Liste déroulante) */}
                                 <div className="form-group">
                                    <label htmlFor="tier">Tier:</label>
                                    <select
                                        id="tier"
                                        value={editData.id_tiers}
                                        //onChange={(e) => setTypeCompte(e.target.value)}
                                        onChange={(e) => setEditData( {...editData, id_tiers: e.target.value })}
                                        required // Validation automatique pour s'assurer qu'un type est sélectionné
                                    >
                                        <option value="">-- Sélectionnez un tiers --</option>
                                        {tiers.map((tier) => (
                                        <option key={tier.id_tiers} value={tier.id_tiers}>
                                            {tier.nom} {tier.prenoms}
                                        </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="montant_ht">Montant HT:</label>
                                    <input
                                        type="number"
                                        id="montant_ht"
                                        value={editData.montant_ht}
                                        onChange={(e) => setEditData({ ...editData, montant_ht: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="montant_tva">Montant TVA:</label>
                                    <input
                                        type="number"
                                        id="montant_tva"
                                        value={editData.montant_tva}
                                        onChange={(e) => setEditData({ ...editData, montant_tva: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="montant_ttc">Montant TTC:</label>
                                    <input
                                        type="number"
                                        id="montant_ttc"
                                        value={editData.montant_ttc}
                                        onChange={(e) => setEditData({ ...editData, montant_ttc: e.target.value })}
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

export default ListeDesFactures;
