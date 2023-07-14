import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import moment from 'moment';
import invoicesAPI from '../services/invoicesAPI';

const InvoicesPage = (props) => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');

    const fetchInvoices = async () => {
        try {
            const data = await invoicesAPI.findAll();
            setInvoices(data);
        }
        catch (error) {
            console.log(error.response);
        }
    }

    useEffect(() => {
        fetchInvoices();
    }, []);
    const STATUS_CLASSES = {
        PAID: "success",
        SENT: "info",
        CANCELLED: "danger"
    }
    const STATUS_LABELS = {
        PAID: "payée",
        SENT: "Envoyée",
        CANCELLED: "Annulée"
    }

    //gestio de la recherce
    const handleSearch = ({ currentTarget }) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }

    // gestion de page
    const handlePageChange = page => {
        setCurrentPage(page);
    }
    const itemsPerPage = 8;
    //gestion de la recherche
    const filteredInvoices = invoices.filter( 
        i =>
            i.customer.firstname.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.lastname.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().includes(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    );

    //gestion de pagination
    const paginatedInvoices = Pagination.getData(
        filteredInvoices,
        currentPage,
        itemsPerPage);

    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    const handleDelete = async id => {
        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(invoice=> invoice.id !== id));

        try {
            await invoicesAPI.delete(id);
        } catch (error) {
            console.log(error.response);
            setInvoices(originalInvoices);
        }
    }

    return (
        <>
            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder='Rechercher...' />
            </div>

            <h1>Liste des factures</h1>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Numeros</th>
                        <th>Client</th>
                        <th className='text-center'>Date d'envoie</th>
                        <th className='text-center'>Status</th>
                        <th className='text-center'>Montant</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedInvoices.map(invoice => (
                        <tr key={invoice.id}>
                            <td>{invoice.chrono}</td>
                            <td><a href="#">{invoice.customer.firstname} {invoice.customer.lastname}</a></td>
                            <td className='text-center'>{formatDate(invoice.sentAt)}</td>
                            <td className='text-center'>
                                <span className={"badge bg-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                            </td>
                            <td className='text-center'>{invoice.amount.toLocaleString()} MGA</td>
                            <td>
                                <button className="ntn btn-sm btn-primary mr-2">Modifier</button>&nbsp;
                                <button className="ntn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChanged={handlePageChange}
                length={filteredInvoices.length} />
        </>
    );
}

export default InvoicesPage;