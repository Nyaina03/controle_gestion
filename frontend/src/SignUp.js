import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import './css/Login.css';
import ConfirmationOk from './ConfirmationOk';


function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [error, setError] = useState(null);
  

    const handleOk = () => {
        setShowConfirmation(false); // Fermer la fenêtre de confirmation
      };
    

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas !");
            return;
        }
    
        const response = await fetch('http://localhost:8000/api/utilisateur/utilisateur/creer/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mail: email,
                mdp: password,
                statut: 5,  // Ajoutez le statut ici avec la valeur par défaut de 5
            }),
        });
    
        const data = await response.json();
        if (response.ok) {
            navigate('/login');
        } else {
            alert(data.error);
        }
    };
    
    
    

    return (
        <div className="login-container">
            <div className="login-box">
                <img src="http://localhost:8000/static/image/logo.png" alt="Logo" className="logo" />
                <h2>Inscription</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <span className="input-icon">
                            <FontAwesomeIcon icon={faEnvelope} /> {/* Icône email */}
                        </span>
                    </div>
                    <div className="input-group">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span className="input-icon">
                            <FontAwesomeIcon icon={faLock} /> {/* Icône mot de passe */}
                        </span>
                    </div>
                    <div className="input-group">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirmer le mot de passe"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <span className="input-icon">
                            <FontAwesomeIcon icon={faLock} /> {/* Icône mot de passe */}
                        </span>
                    </div>
                    <div className="show-password">
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={togglePasswordVisibility}
                        />
                        <label>Afficher le mot de passe</label>
                    </div>
                    <button type="submit" className="login-button">
                        S'INSCRIRE
                    </button>
                    {error && <p className="error-message">{error}</p>}
                    {showConfirmation && <ConfirmationOk message="Inscription réussie!" onClose={handleOk} />}
                    <div className="login-links">
                        <br />
                        <a href="#" onClick={() => navigate('/login')}>Vous avez déjà un compte ? Connectez-vous</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
