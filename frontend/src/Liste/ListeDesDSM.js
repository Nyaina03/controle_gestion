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

function ListeDesDSM() {
    const [dsm, setDsm] = useState([]);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({ id_dsm: '', num_facture: '', mses_embarquees: '',mses_debarquees: '', passagers_nationaux: '', passagers_internationaux: ''});
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        fetch('http://localhost:8000/api/statistiqueFacturees/dsm/')
          .then(response => response.json())
          .then(data => setDsm(data))
          .catch(error => console.error('Error fetching Dsm:', error));
      }, []);



    const handleDeleteClick = (id) => {
        setConfirmDelete(true);
        setDeleteId(id);
    };

    const handleDeleteConfirm = () => {
        if (deleteId) {
            fetch(`http://localhost:8000/api/statistiqueFacturees/dsm/${deleteId}/`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        setDsm(dsm.filter(dsm => dsm.id_dsm !== deleteId));
                        setConfirmDelete(false);
                        setDeleteId(null);
                    }
                })
                .catch(error => console.error('Erreur :', error));
        }
    };

    const handleEditClick = (dsm) => {
        setEditData(dsm);
        setShowEditModal(true);
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        fetch(`http://localhost:8000/api/statistiqueFacturees/dsm/${editData.id_dsm}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editData),
        })
            .then(response => {
                if (response.ok) {
                    setDsm(dsm.map(d => d.id_dsm === editData.id_dsm ? editData : d));
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
                    <h2 className="div-h2">Liste des DSM</h2>
                    {error && <div className="error">{error}</div>}
                    <button className="add-button" onClick={() => navigate('/dsm')}>
                        <FontAwesomeIcon icon={faPlus} /> Ajouter DSM
                    </button>
                    <table className="tiers-table">
                        <thead>
                            <tr>
                                <th>Numéro Facture</th>
                                <th>MSES embarquées</th>
                                <th>MSES Débarquées</th>
                                <th>Passagers Nationaux</th>
                                <th>Passagers Internationaux</th>
                                <th>Modifier</th>
                                <th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dsm.map((dsm, index) => (
                                <tr key={dsm.id_dsm} className={index % 2 === 0 ? 'row-blue' : 'row-gray'}>
                                    <td>{dsm.num_facture}</td>
                                    <td>{dsm.mses_embarquees}</td>
                                    <td>{dsm.mses_debarquees}</td>
                                    <td>{dsm.passagers_nationaux}</td>
                                    <td>{dsm.passagers_internationaux}</td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            className="action-icon edit-icon"
                                            title="Modifier"
                                            onClick={() => handleEditClick(dsm)}
                                        />
                                    </td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="action-icon delete-icon"
                                            title="Supprimer"
                                            onClick={() => handleDeleteClick(dsm.id_dsm)}
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
                        message="Êtes-vous sûr de vouloir supprimer ce DSM ?"
                        onConfirm={handleDeleteConfirm}
                        onCancel={() => setConfirmDelete(false)}
                    />
                )}
                {/* Edit Modal */}
                {showEditModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Modifier DSM</h3>
                            <form onSubmit={handleEditSubmit}>
                                <div className="form-group">
                                    <label htmlFor="num_facture">Numéro facture:</label>
                                    <input
                                        type="text"
                                        id="num_facture"
                                        value={editData.num_facture}
                                        onChange={(e) => setEditData({ ...editData, num_facture: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mses_embarquees">MSES Embarquées:</label>
                                    <input
                                        type="number"
                                        id="mses_embarquees"
                                        value={editData.mses_embarquees}
                                        onChange={(e) => setEditData({ ...editData, mses_embarquees: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="mses_debarquees">MSES Debarquees:</label>
                                    <input
                                        type="number"
                                        id="mses_debarquees"
                                        value={editData.mses_debarquees}
                                        onChange={(e) => setEditData({ ...editData, mses_debarquees: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="passagers_nationaux">Passagers Nationaux:</label>
                                    <input
                                        type="number"
                                        id="passagers_nationaux"
                                        value={editData.passagers_nationaux}
                                        onChange={(e) => setEditData({ ...editData, passagers_nationaux: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="passagers_internationaux">Passagers Internationaux:</label>
                                    <input
                                        type="number"
                                        id="passagers_internationaux"
                                        value={editData.passagers_internationaux}
                                        onChange={(e) => setEditData({ ...editData, passagers_internationaux: e.target.value })}
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

export default ListeDesDSM;
