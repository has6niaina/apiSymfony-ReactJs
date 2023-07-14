import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import axios from 'axios';

const CustomerPage = (props) => {
    const [customer, setCustomer] = useState({
        lastName: 'Tako',
        firstName: "Belou",
        email: "",
        company: ""
    })
    const handleChange = ({currentTarget}) => {
        const {name,value} = currentTarget;
        setCustomer({...customer, [name]: value})
    }
    const handleSubmit =  async event => {
        event.preventDefault();

        try {
           const response = await axios.post("http://127.0.0.1:8000/api/customers", customer)
           console.log(response.data);
        } catch (error) {
            console.log(error.response)
        }

        // console.log(customer);
    }

    const [errors, setErrors] = useState({
        lastName: 'Le nom est obligatoire',
        firstName: "Le prenom est obligatoire",
        email: "L'adresse email est obligatoire",
        company: "Le nom du company est obligatoire"
    })
    return (
        <>
            <h1>Creation client </h1>
            <form onSubmit={handleSubmit}>
                <Field name="lastName" value={customer.lastName} error={errors.lastName} onChange={handleChange} label="Nom de famille" placeholder="Nom de famille du client" />
                <Field name="firstName" value={customer.firstName} error={errors.firstName} onChange={handleChange} label="prenom " placeholder="Prenom du client" />
                <Field name="email" value={customer.email} error={errors.email} onChange={handleChange} type="email" label="Email du client" placeholder="Adresse email du client" />
                <Field name="company" value={customer.company} error={errors.company} onChange={handleChange} type="text" label="Entreprise du client" placeholder="Entreprise du client" />

                <div className="form-group">
                    <button type='submit' className="btn btn-success">Enregistrer</button>
                    <Link to="/customers" className="btn btn-link">Retourner</Link>
                </div>
            </form>
        </>
    );
}

export default CustomerPage;