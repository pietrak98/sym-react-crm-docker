import React, {useEffect, useState} from 'react';
import Pagination from '../components/Pagination';
import moment from 'moment-js';
import InvoicesAPI from "../services/invoicesAPI";
import {Link} from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

/**
 *
 * @type {{CANCELLED: string, PAID: string, SENT: string}}
 */
const STATUS_CLASSES = {
    PAID: 'success',
    SENT: 'primary',
    CANCELLED: 'danger'
}

/**
 *
 * @type {{CANCELLED: string, PAID: string, SENT: string}}
 */
const STATUS_LABELS = {
    PAID: 'Paid',
    SENT: 'Sent',
    CANCELLED: 'Cancelled'
}

/**
 *
 * @type {number}
 */
const itemsPerPage = 10;

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const InvoicesPage = (props) => {
    const [ invoices, setInvoices ] = useState([]);
    const [totalItems, setTotalItems] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [ loading, setLoading ] = useState(true)

    // Manage invoices fetch in API
    const fetchInvoices = async (currentPage) => {
        try {
            await InvoicesAPI.getPaginated(currentPage)
                .then(
                    (data) => {
                        setInvoices(data.data['hydra:member'])
                        setLoading(false);
                        setTotalItems(data.data['hydra:totalItems'])
                    }
                )
        } catch (error) {
            // console.log(error)
            toast.error('Error at invoices loading ❌')
        }

    }
    // Manage DateTime format in UI
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    // Manage data fetching at page loading
    useEffect(() => {
        fetchInvoices(currentPage)
    }, [currentPage])

    // Manage page changes
    const handlePageChange = (page) => {
        setCurrentPage(page);
        setLoading(true);
    }

    // Manage searchbar
    const handleSearch = ({ currentTarget }) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }

    // Manage one invoice deletion
    const handleDelete = async (id) => {
        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(invoice => invoice.id !== id))
        try {
           await InvoicesAPI.delete(id)
            toast.success('Invoice deleted ✅')
        }catch (error) {
            setInvoices(originalInvoices);
            toast.error('The invoice could not be deleted ❌')
            // console.log(error)
        }
    }

    return (
        <>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h1>Invoices list</h1>
                <Link to={'invoices/new'} className='btn btn-primary'>Create new invoice</Link>
            </div>

            <div className="form-group">
                <input
                    type="text"
                    onChange={handleSearch}
                    value={search}
                    className="form-control"
                    placeholder="search..."
                />
            </div>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Number</th>
                    <th>Customer</th>
                    <th className="text-center">Sending date</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Amount</th>
                </tr>
                </thead>
                <tbody>
                    {!loading &&
                        invoices.map( invoice =>
                            <tr key={invoice.id}>
                                <td>{invoice.chrono}</td>
                                <td>
                                    <Link to={`/customers/${invoice.customer.id}`}>
                                        {invoice.customer.firstName} {invoice.customer.lastName.toUpperCase()}
                                    </Link>
                                </td>
                                <td className="text-center">{formatDate(invoice.sentAt)}</td>
                                <td className="text-center">
                                    <span className={`badge badge-${STATUS_CLASSES[invoice.status]}`}>
                                        {STATUS_LABELS[invoice.status]}
                                    </span>
                                </td>
                                <td className="text-center">
                                    {invoice.amount.toLocaleString()} €
                                </td>
                                <td>
                                    <Link to={`/invoices/${invoice.id}`} className="btn btn-sm btn-primary mr-1">
                                        Edit
                                    </Link>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )
                    ||
                        <tr>
                            <td>
                                <TableLoader/>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChanged={handlePageChange}
                length={totalItems}
            />
        </>
    );
};

export default InvoicesPage;
