import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './css/ListPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function ListPage() {
  const data = [
    { id: 1, name: "Item 1", description: "Description 1" },
    { id: 2, name: "Item 2", description: "Description 2" },
    { id: 3, name: "Item 3", description: "Description 3" },
    { id: 4, name: "Item 4", description: "Description 4" },
    { id: 5, name: "Item 5", description: "Description 5" },
  ];

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="table-container">
          <h2 className="table-title">Liste des éléments</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Description</th>
                <th>Modifier</th> {/* Nouvelle colonne pour Modifier */}
                <th>Supprimer</th> {/* Nouvelle colonne pour Supprimer */}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>
                    {/* Icône pour modifier */}
                    <FontAwesomeIcon icon={faEdit} className="action-icon edit-icon" title="Modifier" />
                  </td>
                  <td>
                    {/* Icône pour supprimer */}
                    <FontAwesomeIcon icon={faTrash} className="action-icon delete-icon" title="Supprimer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ListPage;
