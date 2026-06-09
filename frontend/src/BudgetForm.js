// src/BudgetForm.js
import React from 'react';
import '.css/styles.css';  // Assurez-vous que ce fichier CSS existe

function BudgetForm() {
  return (
    <div>
      <h1>Formulaire avec des Couleurs Personnalisées</h1>
      <form>
        <label htmlFor="field-white">Champ Blanc:</label><br />
        <input type="text" id="field-white" className="input-white" placeholder="Saisissez un texte ici" /><br /><br />

        <label htmlFor="field-blue">Champ Bleu:</label><br />
        <input type="text" id="field-blue" className="input-blue" placeholder="Saisissez un texte ici" /><br /><br />

        <label htmlFor="field-red">Champ Rouge:</label><br />
        <input type="text" id="field-red" className="input-red" placeholder="Saisissez un texte ici" /><br /><br />

        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
}

export default BudgetForm;
