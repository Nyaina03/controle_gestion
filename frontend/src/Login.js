import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import './css/Login.css';
import ConfirmationOk from './ConfirmationOk';

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [error, setError] = useState(null);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8000/api/utilisateur/utilisateur/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mail: email, mdp: password }),
        });

        const data = await response.json();
        if (response.ok) {
            if (data.statut === 1) {
                navigate('/admin/dashboard'); // Redirection pour l'administrateur
            } else if (data.statut === 5) {
                navigate('/dashboard'); // Redirection pour le simple utilisateur
            }
        } else {
            setError(data.error); // Afficher l'erreur dans le frontend
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img src="http://localhost:8000/static/image/logo.png" alt="Logo" className="logo" />
                <h2>Connexion</h2>
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
                    <div className="show-password">
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={togglePasswordVisibility}
                        />
                        <label>Afficher le mot de passe</label>
                    </div>
                    <button type="submit" className="login-button">
                        SE CONNECTER
                    </button>

                    {error && <div className="error-message">{error}</div>} {/* Affichage de l'erreur */}
                    <div className="login-links">
                        <br />
                        <a href="#" onClick={() => navigate('/inscription')}>Vous n'avez pas de compte ? Inscrivez-vous</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
