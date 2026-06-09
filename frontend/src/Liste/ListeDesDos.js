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

function ListeDesDos() {
    const [dos, setDos] = useState([]);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({ id_compte: '', code: '',libelle: '',id_type_compte: ''});
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();
    const [directions, setDirections] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/dos/dos/')
          .then(response => response.json())
          .then(data => setDos(data))
          .catch(error => console.error('Error fetching Dos:', error));
      }, []);



    const handleDeleteClick = (id) => {
        setConfirmDelete(true);
        setDeleteId(id);
    };

    const handleDeleteConfirm = () => {
        if (deleteId) {
            fetch(`http://localhost:8000/api/dos/dos/${deleteId}/`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        setDos(dos.filter(dos => dos.id_dos !== deleteId));
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
        fetch(`http://localhost:8000/api/dos/dos/${editData.id_dos}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editData),
        })
            .then(response => {
                if (response.ok) {
                    setDos(dos.map(d => d.id_dos === editData.id_dos ? editData : d));
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
                    <h2 className="div-h2">Liste des DOS</h2>
                    {error && <div className="error">{error}</div>}
                    <button className="add-button" onClick={() => navigate('/saisie_ref_dos')}>
                        <FontAwesomeIcon icon={faPlus} /> Ajouter DOS
                    </button>
                    <table className="tiers-table">
                        <thead>
                            <tr>
                                <th>Libellé</th>
                                <th>Ref Dos</th>
                                <th>Nodifier</th>
                                <th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dos.map((dos, index) => (
                                <tr key={dos.id_dos} className={index % 2 === 0 ? 'row-blue' : 'row-gray'}>
                                    <td>{dos.libelle}</td>
                                    <td>{dos.ref_dos}</td>
                                 
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            className="action-icon edit-icon"
                                            title="Modifier"
                                            onClick={() => handleEditClick(dos)}
                                        />
                                    </td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="action-icon delete-icon"
                                            title="Supprimer"
                                            onClick={() => handleDeleteClick(dos.id_dos)}
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
                        message="Êtes-vous sûr de vouloir supprimer ce DOS ?"
                        onConfirm={handleDeleteConfirm}
                        onCancel={() => setConfirmDelete(false)}
                    />
                )}
                {/* Edit Modal */}
                {showEditModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Modifier Dos</h3>
                            <form onSubmit={handleEditSubmit}>
                                <div className="form-group">
                                    <label htmlFor="libelle">Libellé:</label>
                                    <input
                                        type="text"
                                        id="libelle"
                                        value={editData.libelle}
                                        onChange={(e) => setEditData({ ...editData, libelle: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="ref_dos">Ref Dos:</label>
                                    <input
                                        type="text"
                                        id="ref_dos"
                                        value={editData.ref_dos}
                                        onChange={(e) => setEditData({ ...editData, ref_dos: e.target.value })}
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

export default ListeDesDos;
