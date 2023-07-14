import React, { useContext, useState } from 'react';
import Field from '../components/forms/Field';
import AuthContext from '../contexts/AuthContext';
import AuthAPI from '../services/authApi';

const LoginPage = ({ history }) => {
    // console.log(history)
    const { setIsAuthenticated } = useContext(AuthContext)
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState("");

    //gestion des champs
    const handleChange = ({ currentTarget }) => {
        const { value, name } = currentTarget;
        setCredentials({ ...credentials, [name]: value })
    }

    //gestion du submit
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            history.replace("/customers");
        } catch (error) {
            setError("Aucun compte possede cette adresse");
        }
        // console.log(credentials);
    }
    return (
        <>
            <h1>connexion</h1>
            <form onSubmit={handleSubmit}>
                    <Field className="form-control" label={"Adresse Email"} name="username" value={credentials.username} onChange={handleChange} error={error} placeholder="Adresse email de connexion" />
                    <Field type="password" className="form-control" label={"Mot de passe"} name="password" value={credentials.password} onChange={handleChange} placeholder="Mot de passe de connexion" />
                <div className="form-group mt-5">
                    <button type="submit" className="btn btn-success">Connexion</button>
                </div>
            </form>
        </>
    );
}

export default LoginPage;