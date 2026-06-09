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

function ListeDesAAM() {
    const [aam, setAam] = useState([]);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({ id_aam_marin: '', num_facture: '', aptitude: '', base: '', f1: '', f2: '', f3: '', f4: '', f5: '', f6: '', f7: '', f8: '', f9: '', f10: ''});
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        fetch('http://localhost:8000/api/statistiqueFacturees/aam_marins/')
          .then(response => response.json())
          .then(data => setAam(data))
          .catch(error => console.error('Error fetching Aam marin:', error));
      }, []);



    const handleDeleteClick = (id) => {
        setConfirmDelete(true);
        setDeleteId(id);
    };

    const handleDeleteConfirm = () => {
        if (deleteId) {
            fetch(`http://localhost:8000/api/statistiqueFacturees/aam_marins/${deleteId}/`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        setAam(aam.filter(aam => aam.id_aam_marin !== deleteId));
                        setConfirmDelete(false);
                        setDeleteId(null);
                    }
                })
                .catch(error => console.error('Erreur :', error));
        }
    };

    const handleEditClick = (aam) => {
        setEditData(aam);
        setShowEditModal(true);
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        fetch(`http://localhost:8000/api/statistiqueFacturees/aam_marins/${editData.id_aam_marin}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editData),
        })
            .then(response => {
                if (response.ok) {
                    setAam(aam.map(a => a.id_aam_marin === editData.id_aam_marin ? editData : a));
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
                    <h2 className="div-h2">Liste des AAM Marins</h2>
                    {error && <div className="error">{error}</div>}
                    <button className="add-button" onClick={() => navigate('/aam_marins')}>
                        <FontAwesomeIcon icon={faPlus} /> Ajouter AAM Marin
                    </button>
                    <table className="tiers-table">
                        <thead>
                            <tr>
                                <th>Numéro Facture</th>
                                <th>Aptitude</th>
                                <th>Base</th>
                                <th>f1</th>
                                <th>f2</th>
                                <th>f3</th>
                                <th>f4</th>
                                <th>f5</th>
                                <th>f6</th>
                                <th>f7</th>
                                <th>f8</th>
                                <th>f9</th>
                                <th>f10</th>
                                <th>Modifier</th>
                                <th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {aam.map((aam, index) => (
                                <tr key={aam.id_aam_marin} className={index % 2 === 0 ? 'row-blue' : 'row-gray'}>
                                    <td>{aam.num_facture}</td>
                                    <td>{aam.aptitude}</td>
                                    <td>{aam.base}</td>
                                    <td>{aam.f1}</td>
                                    <td>{aam.f2}</td>
                                    <td>{aam.f3}</td>
                                    <td>{aam.f4}</td>
                                    <td>{aam.f5}</td>
                                    <td>{aam.f6}</td>
                                    <td>{aam.f7}</td>
                                    <td>{aam.f8}</td>
                                    <td>{aam.f9}</td>
                                    <td>{aam.f10}</td>
                                 
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            className="action-icon edit-icon"
                                            title="Modifier"
                                            onClick={() => handleEditClick(aam)}
                                        />
                                    </td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="action-icon delete-icon"
                                            title="Supprimer"
                                            onClick={() => handleDeleteClick(aam.id_aam_marin)}
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
                        message="Êtes-vous sûr de vouloir supprimer ce AAM Marin ?"
                        onConfirm={handleDeleteConfirm}
                        onCancel={() => setConfirmDelete(false)}
                    />
                )}
                {/* Edit Modal */}
                {showEditModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Modifier AAM Marin</h3>
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
                                    <label htmlFor="aptitude">Aptitude:</label>
                                    <input
                                        type="number"
                                        id="aptitude"
                                        value={editData.aptitude}
                                        onChange={(e) => setEditData({ ...editData, aptitude: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="base">Base:</label>
                                    <input
                                        type="number"
                                        id="base"
                                        value={editData.base}
                                        onChange={(e) => setEditData({ ...editData, base: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="f1">F1:</label>
                                    <input
                                        type="number"
                                        id="f1"
                                        value={editData.f1}
                                        onChange={(e) => setEditData({ ...editData, f1: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="f2">F2:</label>
                                    <input
                                        type="number"
                                        id="f2"
                                        value={editData.f2}
                                        onChange={(e) => setEditData({ ...editData, f2: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="f3">F3:</label>
                                    <input
                                        type="number"
                                        id="f3"
                                        value={editData.f3}
                                        onChange={(e) => setEditData({ ...editData, f3: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="f4">F4:</label>
                                    <input
                                        type="number"
                                        id="f4"
                                        value={editData.f4}
                                        onChange={(e) => setEditData({ ...editData, f4: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="f5">F5:</label>
                                    <input
                                        type="number"
                                        id="f5"
                                        value={editData.f5}
                                        onChange={(e) => setEditData({ ...editData, f5: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="f6">F6:</label>
                                    <input
                                        type="number"
                                        id="f6"
                                        value={editData.f6}
                                        onChange={(e) => setEditData({ ...editData, f6: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="f7">F7:</label>
                                    <input
                                        type="number"
                                        id="f7"
                                        value={editData.f7}
                                        onChange={(e) => setEditData({ ...editData, f7: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="f8">F8:</label>
                                    <input
                                        type="number"
                                        id="f8"
                                        value={editData.f8}
                                        onChange={(e) => setEditData({ ...editData, f8: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="f9">F9:</label>
                                    <input
                                        type="number"
                                        id="f9"
                                        value={editData.f9}
                                        onChange={(e) => setEditData({ ...editData, f9: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="f10">F10:</label>
                                    <input
                                        type="number"
                                        id="f10"
                                        value={editData.f10}
                                        onChange={(e) => setEditData({ ...editData, f10: e.target.value })}
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

export default ListeDesAAM;
