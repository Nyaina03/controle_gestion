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

function ListeDesDM() {
    const [dm, setDm] = useState([]);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({ id_dm: '', num_facture: '', mses_embarquees: '',mses_debarquees: ''});
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        fetch('http://localhost:8000/api/statistiqueFacturees/dm/')
          .then(response => response.json())
          .then(data => setDm(data))
          .catch(error => console.error('Error fetching Dm:', error));
      }, []);



    const handleDeleteClick = (id) => {
        setConfirmDelete(true);
        setDeleteId(id);
    };

    const handleDeleteConfirm = () => {
        if (deleteId) {
            fetch(`http://localhost:8000/api/statistiqueFacturees/dm/${deleteId}/`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        setDm(dm.filter(dm => dm.id_dm !== deleteId));
                        setConfirmDelete(false);
                        setDeleteId(null);
                    }
                })
                .catch(error => console.error('Erreur :', error));
        }
    };

    const handleEditClick = (dm) => {
        setEditData(dm);
        setShowEditModal(true);
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        fetch(`http://localhost:8000/api/statistiqueFacturees/dm/${editData.id_dm}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editData),
        })
            .then(response => {
                if (response.ok) {
                    setDm(dm.map(d => d.id_dm === editData.id_dm ? editData : d));
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
                    <h2 className="div-h2">Liste des DM</h2>
                    {error && <div className="error">{error}</div>}
                    <button className="add-button" onClick={() => navigate('/dm')}>
                        <FontAwesomeIcon icon={faPlus} /> Ajouter DM
                    </button>
                    <table className="tiers-table">
                        <thead>
                            <tr>
                                <th>Numéro Facture</th>
                                <th>MSES embarquées</th>
                                <th>MSES Débarquées</th>
                                <th>Modifier</th>
                                <th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dm.map((dm, index) => (
                                <tr key={dm.id_dm} className={index % 2 === 0 ? 'row-blue' : 'row-gray'}>
                                    <td>{dm.num_facture}</td>
                                    <td>{dm.mses_embarquees}</td>
                                    <td>{dm.mses_debarquees}</td>
                                    
                                 
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            className="action-icon edit-icon"
                                            title="Modifier"
                                            onClick={() => handleEditClick(dm)}
                                        />
                                    </td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="action-icon delete-icon"
                                            title="Supprimer"
                                            onClick={() => handleDeleteClick(dm.id_dm)}
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
                        message="Êtes-vous sûr de vouloir supprimer ce DM ?"
                        onConfirm={handleDeleteConfirm}
                        onCancel={() => setConfirmDelete(false)}
                    />
                )}
                {/* Edit Modal */}
                {showEditModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Modifier DM</h3>
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

export default ListeDesDM;
