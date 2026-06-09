import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './css/ImportDonneeSiig.css';

const ImportDonneeSiig = () => {
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [ptaCode, setPtaCode] = useState('');
  const [nonEssentialColumns, setNonEssentialColumns] = useState([]);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [idTypeOperation, setIdTypeOperation] = useState('');
  const [codeProgramme, setCodeProgramme] = useState('');
  const [idCompte, setIdCompte] = useState('');

  // Handle file upload
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
  
    if (!file) {
      alert('Veuillez télécharger un fichier.');
      return;
    }
  
    console.log('Fichier sélectionné:', file); // Vérifiez que le fichier est bien sélectionné
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('http://localhost:8000/api/realisationBudget/import_depenses/', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
      console.log('Réponse API:', result); // Log de la réponse complète
  
      if (response.ok) {
        alert('Importation réussie');
      } else {
        alert(`Erreur: ${result.error || 'Erreur inconnue'}\nDétails: ${result.details}`);
      }
    } catch (error) {
      console.error('Erreur de communication avec l\'API:', error);
      alert('Une erreur est survenue lors de l\'importation.');
    }
  };
  
  
  

  // Define missing functions here
  const handleAddColumn = () => {
    setShowAddColumn(true); // Show the form to add a new column
  };

  const handleAddColumnSubmit = () => {
    if (ptaCode) {
      setColumns([...columns, { name: `Column ${columns.length + 1}`, code: ptaCode }]);
      setPtaCode('');
      setShowAddColumn(false);
    }
  };

  const handleDeleteColumn = (index) => {
    const updatedColumns = columns.filter((_, i) => i !== index);
    setColumns(updatedColumns);
  };

  return (
    <div className="form-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="form-container">
          <div className="div-h2">
            <h2>Importation de données SIIG</h2>
          </div>
          <div className="count">
            <form>
              <div className="form-group">
                <label htmlFor="file-upload">Télécharger le fichier:</label>
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}  // Utilisation de handleFileChange pour récupérer le fichier
                  accept=".csv,.xls,.xlsx"
                />
              </div>
              {file && (
                <div className="file-info">
                  <p>Fichier téléchargé: {file.name}</p>
                </div>
              )}
              <div className="column-options">
                <button type="button" onClick={handleAddColumn}>
                  Ajouter une colonne
                </button>
                {showAddColumn && (
                  <div className="add-column-form">
                    <input
                      type="text"
                      placeholder="Code PTA"
                      value={ptaCode}
                      onChange={(e) => setPtaCode(e.target.value)}
                    />
                    <button type="button" onClick={handleAddColumnSubmit}>
                      Ajouter
                    </button>
                  </div>
                )}
                <h3>Colonnes Importées:</h3>
                <ul>
                  {columns.map((col, index) => (
                    <li key={index}>
                      {col.name} (Code PTA: {col.code})
                      <button type="button" onClick={() => handleDeleteColumn(index)}>
                        Supprimer
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="actions">
                <button type="button" onClick={handleFileUpload}>Importer</button> {/* Changez à un type button pour éviter l'envoi du formulaire */}
                <button type="button" className="cancel-button">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportDonneeSiig;
