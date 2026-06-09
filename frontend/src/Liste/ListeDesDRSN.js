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

function ListeDesDRSN() {
    const [drsn, setDrsn] = useState([]);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({ id_drsn: '', num_facture: '',droit_de_port: '',droit_de_stationnement: ''});
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        fetch('http://localhost:8000/api/statistiqueFacturees/drsn/')
          .then(response => response.json())
          .then(data => setDrsn(data))
          .catch(error => console.error('Error fetching Drsn:', error));
      }, []);



    const handleDeleteClick = (id) => {
        setConfirmDelete(true);
        setDeleteId(id);
    };

    const handleDeleteConfirm = () => {
        if (deleteId) {
            fetch(`http://localhost:8000/api/statistiqueFacturees/drsn/${deleteId}/`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        setDrsn(drsn.filter(drsn => drsn.id_drsn !== deleteId));
                        setConfirmDelete(false);
                        setDeleteId(null);
                    }
                })
                .catch(error => console.error('Erreur :', error));
        }
    };

    const handleEditClick = (dos) => {
        setEditData(dos);
        setShowEditModal(true);
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        fetch(`http://localhost:8000/api/statistiqueFacturees/drsn/${editData.id_drsn}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editData),
        })
            .then(response => {
                if (response.ok) {
                    setDrsn(drsn.map(d => d.id_drsn === editData.id_drsn ? editData : d));
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
                    <h2 className="div-h2">Liste des DRSN</h2>
                    {error && <div className="error">{error}</div>}
                    <button className="add-button" onClick={() => navigate('/drsn')}>
                        <FontAwesomeIcon icon={faPlus} /> Ajouter DRSN
                    </button>
                    <table className="tiers-table">
                        <thead>
                            <tr>
                                <th>Numéro Facture</th>
                                <th>Droit de port</th>
                                <th>Droit de stationnement</th>
                                <th>Autres</th>
                                <th>Modifier</th>
                                <th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drsn.map((drsn, index) => (
                                <tr key={drsn.id_drsn} className={index % 2 === 0 ? 'row-blue' : 'row-gray'}>
                                    <td>{drsn.num_facture}</td>
                                    <td>{drsn.droit_de_port}</td>
                                    <td>{drsn.droit_de_stationnement}</td>
                                    <td>{drsn.autres}</td>
                                 
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            className="action-icon edit-icon"
                                            title="Modifier"
                                            onClick={() => handleEditClick(drsn)}
                                        />
                                    </td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="action-icon delete-icon"
                                            title="Supprimer"
                                            onClick={() => handleDeleteClick(drsn.id_drsn)}
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
                        message="Êtes-vous sûr de vouloir supprimer ce DRSN ?"
                        onConfirm={handleDeleteConfirm}
                        onCancel={() => setConfirmDelete(false)}
                    />
                )}
                {/* Edit Modal */}
                {showEditModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Modifier DRSN</h3>
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
                                    <label htmlFor="droit_de_port">Droit de port:</label>
                                    <input
                                        type="number"
                                        id="droit_de_port"
                                        value={editData.droit_de_port}
                                        onChange={(e) => setEditData({ ...editData, droit_de_port: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="droit_de_stationnement">Droit de stationnement:</label>
                                    <input
                                        type="number"
                                        id="droit_de_stationnement"
                                        value={editData.droit_de_stationnement}
                                        onChange={(e) => setEditData({ ...editData, droit_de_stationnement: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="autres">Autres:</label>
                                    <input
                                        type="number"
                                        id="autres"
                                        value={editData.autres}
                                        onChange={(e) => setEditData({ ...editData, autres: e.target.value })}
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

export default ListeDesDRSN;
