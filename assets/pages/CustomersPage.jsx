import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import customersApi from '../services/customersApi';

const CustomersPage = (props) => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');

    //permet de recuperer les customers
    const fetchCustomers = async () => {
        try {
           const data = await customersApi.findAll()
            setCustomers(data);
    
        } catch (error) {
            console.log(error.response)
        }
    }
    //au chargement du composant
    useEffect(  () => {
        fetchCustomers();
    }, [])
    //gestion de suppresion d'un customers

    const handleDelete = async id => {
        const originalCustomers = [...customers];

        // approche optimiste
        setCustomers(customers.filter(customer => customer.id !== id));

        // approche suppresion pesimiste
        try {
            await customersApi.delete(id)

        } catch (error) {
            setCustomers(originalCustomers);
            // console.log(error.response);
        };
    }
    //gestio de la recherce
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }

    // gestion de page
    const handlePageChange = page => {
        setCurrentPage(page);   
    }
    const itemsPerPage = 8;
    const filteredCustomers = customers.filter(c =>
        c.firstname.toLowerCase().includes(search.toLowerCase()) ||
        c.lastname.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    );

    const paginatedCustomers = filteredCustomers.length > itemsPerPage ? Pagination.getData(
        filteredCustomers, currentPage, itemsPerPage) : filteredCustomers;

    return (
        <>
        <div className="mb-2 d-flex justify-content-between align-items-center">
            <h1>Listes des clients</h1>
            <Link to="/customers/new" className='btn btn-primary'>Cree un client</Link>
        </div>
            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder='Rechercher...' />
            </div>
            <table className="table table-hover mt-5">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th className='text-center'>Entreprise</th>
                        <th className='text-center'>Factures</th>
                        <th>Montant total</th>
                        <th>-</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedCustomers.map(customer => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td><a href="#">{customer.firstname} {customer.lastname}</a></td>
                            <td>{customer.email}</td>
                            <td className='text-center'>{customer.company}</td>
                            <td className='text-center'>{customer.invoices.length}</td>
                            <td>1500</td>
                            <td><button disabled={customer.invoices.length > 0} onClick={() => handleDelete(customer.id)} className="btn btn-danger sm">Supprimer</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {itemsPerPage < filteredCustomers.length && (
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={filteredCustomers.length}
                    onPageChanged={handlePageChange} />
            )};
        </>
    );
}


export default CustomersPage;
