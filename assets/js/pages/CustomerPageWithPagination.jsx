import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Pagination from '../components/Pagination';
import CustomersAPI from "../services/customersAPI";
import {toast} from 'react-toastify';

/**
 *
 * @type {number}
 */
const itemsPerPage = 10;
const CustomersPageWithPagination = (props) => {

    const [customers, setCustomers] = useState([]);
    const [totalItems, setTotalItems] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true)

    const fetchCustomers = async (currentPage) => {
        try {
            await CustomersAPI.getPaginated(currentPage)
                .then(
                    (data) => {
                        setCustomers(data.data['hydra:member'])
                        setLoading(false);
                        setTotalItems(data.data['hydra:totalItems'])
                    }
                )
        } catch (error) {
            // console.log(error)
            toast.error('Error at customers loading ❌')
        }
    }

    useEffect(() => {
        fetchCustomers(currentPage);
    }, [currentPage])

    const handleDelete = (id) => {
        const originalCustomers = [...customers];
        setCustomers(customers.filter(customer => customer.id !== id))
        axios.delete(`http://localhost:8000/api/customers/${id}`)
            .then(response => console.log('delete ok'))
            .catch(error => {
                setCustomers(originalCustomers);
                // console.log(error)
            })
    }
    const handlePageChange = (page) => {
        setCurrentPage(page);
        setLoading(true)
    }
    return (
        <>
            <h1>Customers list (with Pagination)</h1>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th className={'text-center'}>Invoices</th>
                    <th className={'text-center'}>Total Amount</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {loading && (
                    <tr>
                        <td>Loading...</td>
                    </tr>
                )}
                {!loading &&
                    customers.map(customer =>
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td><a href="#">{customer.firstName} {customer.lastName}</a></td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td className={'text-center'}>{customer.invoices.length}</td>
                            <td className={'text-center'}>{customer.totalAmount.toLocaleString()}€</td>
                            <td>
                                <button
                                    onClick={() => handleDelete(customer.id)}
                                    disabled={customer.invoices.length > 0}
                                    className="btn btn-sm btn-danger">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={totalItems}
                onPageChanged={handlePageChange}
            />

        </>
    );
};

export default CustomersPageWithPagination;
