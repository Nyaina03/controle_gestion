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

function ListeDesPTA() {
    const [ptas, setPta] = useState([]);
    const [error, setError] = useState(null);
    const [dos, setDos] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({ id_compte: '', code: '',libelle: '',id_type_compte: ''});
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();
    const [directions, setDirections] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/pta/pta/')
          .then(response => response.json())
          .then(data => setPta(data))
          .catch(error => console.error('Error fetching pta:', error));
      }, []);

      useEffect(() => {
        fetch('http://localhost:8000/api/direction/liste_direction/')
          .then(response => response.json())
          .then(data => setDirections(data))
          .catch(error => console.error('Error fetching directions:', error));
      }, []);

      useEffect(() => {
        // Charger les directions
        fetch('http://localhost:8000/api/dos/dos/')
          .then(response => response.json())
          .then(data => setDos(data))
          .catch(error => console.error('Erreur lors du chargement des dos:', error));
    
      }, []);

    const handleDeleteClick = (id) => {
        setConfirmDelete(true);
        setDeleteId(id);
    };

    const handleDeleteConfirm = () => {
        if (deleteId) {
            fetch(`http://localhost:8000/api/pta/delete_pta/${deleteId}/`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        setPta(ptas.filter(pta => pta.id_pta !== deleteId));
                        setConfirmDelete(false);
                        setDeleteId(null);
                    }
                })
                .catch(error => console.error('Erreur :', error));
        }
    };

    const handleEditClick = (ptas) => {
        setEditData(ptas);
        setShowEditModal(true);
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        fetch(`http://localhost:8000/api/pta/update_pta/${editData.id_pta}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editData),
        })
            .then(response => {
                if (response.ok) {
                    setPta(ptas.map(p => p.id_pta === editData.id_pta ? editData : p));
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
                    <h2 className="div-h2">Liste des PTA</h2>
                    {error && <div className="error">{error}</div>}
                    <button className="add-button" onClick={() => navigate('/saisie_pta')}>
                        <FontAwesomeIcon icon={faPlus} /> Ajouter PTA
                    </button>
                    <table className="tiers-table">
                        <thead>
                            <tr>
                                <th>Année</th>
                                <th>Code Stratégique</th>
                                <th>Code Activité</th>
                                <th>Libellé</th>
                                <th>Montant</th>
                                <th>Code Programme</th>
                                <th>Ref Dos</th>
                                <th>Direction</th>
                                <th>Modifier</th>
                                <th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ptas.map((pta, index) => (
                                <tr key={pta.id_pta} className={index % 2 === 0 ? 'row-blue' : 'row-gray'}>
                                    <td>{pta.annee}</td>
                                    <td>{pta.code_strategique}</td>
                                    <td>{pta.code_activite}</td>
                                    <td>{pta.libelle}</td>
                                    <td>{pta.montant}</td>
                                    <td>{pta.code_programme}</td>
                                    <td>{pta.reference_dos}</td>
                                    <td>{pta.nom_direction}</td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            className="action-icon edit-icon"
                                            title="Modifier"
                                            onClick={() => handleEditClick(pta)}
                                        />
                                    </td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="action-icon delete-icon"
                                            title="Supprimer"
                                            onClick={() => handleDeleteClick(pta.id_pta)}
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
                        message="Êtes-vous sûr de vouloir supprimer ce PTA ?"
                        onConfirm={handleDeleteConfirm}
                        onCancel={() => setConfirmDelete(false)}
                    />
                )}
                {/* Edit Modal */}
                {showEditModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Modifier PTA</h3>
                            <form onSubmit={handleEditSubmit}>
                                <div className="form-group">
                                    <label htmlFor="annee">Année:</label>
                                    <input
                                        type="number"
                                        id="annee"
                                        value={editData.annee}
                                        onChange={(e) => setEditData({ ...editData, annee: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="code_strategique">Code Stratégique:</label>
                                    <input
                                        type="text"
                                        id="code_strategique"
                                        value={editData.code_strategique}
                                        onChange={(e) => setEditData({ ...editData, code_strategique: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="code_activite">Code Activité:</label>
                                    <input
                                        type="text"
                                        id="code_activite"
                                        value={editData.code_activite}
                                        onChange={(e) => setEditData({ ...editData, code_activite: e.target.value })}
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
                                    <label htmlFor="code_programme">Code Programme:</label>
                                    <input
                                        type="number"
                                        id="code_programme"
                                        value={editData.code_programme}
                                        onChange={(e) => setEditData({ ...editData, code_programme: e.target.value })}
                                    />
                                </div>

                            <div className="form-group">
                                <label htmlFor="dos-select">Dos:</label>
                                <select
                                    id="dos-select"
                                    value={editData.id_dos}
                                    onChange={(e) => setEditData({ ...editData, id_dos: e.target.value})}
                                    required
                                >
                                    <option value="">--Choisissez une ref Dos--</option>
                                    {dos.map(d => (
                                    <option key={d.id_dos} value={d.id_dos}>
                                        {d.ref_dos}
                                    </option>
                                    ))}
                                </select>
                                </div>


                                             {/* type_compte (Liste déroulante) */}
                            <div className="form-group">
                                <label htmlFor="direction">Direction:</label>
                                <select
                                    id="direction"
                                    value={editData.id_direction}
                                    //onChange={(e) => setTypeCompte(e.target.value)}
                                    onChange={(e) => setEditData( {...editData, id_direction: e.target.value })}
                                    required // Validation automatique pour s'assurer qu'un type est sélectionné
                                >
                                    <option value="">-- Sélectionnez une direction --</option>
                                    {directions.map((direction) => (
                                    <option key={direction.id_direction} value={direction.id_direction}>
                                        {direction.nom_direction}
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

export default ListeDesPTA;
