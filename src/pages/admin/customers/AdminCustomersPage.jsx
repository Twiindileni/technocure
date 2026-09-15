import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { customerService } from '../../../services/customerService';
import { LoadingState } from '../../../components/ui/Spinner';
import { ErrorState, EmptyState } from '../../../components/ui/States';
import { Table } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { SearchBar } from '../../../components/ui/SearchBar';
import { formatDate } from '../../../utils/formatters';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await customerService.getCustomers({ search });
      setCustomers(res.data || []);
    } catch (err) {
      setError('Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  if (error) return <ErrorState message={error} retry={fetchCustomers} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-dark">Customers</h1>
      
      <div className="mb-6 max-w-md">
        <SearchBar value={search} onChange={setSearch} placeholder="Search customers..." />
      </div>

      {loading ? <LoadingState text="Loading..." /> : customers.length === 0 ? <EmptyState message="No customers found." /> : (
        <div className="bg-white border border-brand-border rounded-lg shadow-sm overflow-hidden">
          <Table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id}>
                  <td>{customer.full_name || 'Unknown'}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone || '-'}</td>
                  <td>{customer.company || '-'}</td>
                  <td>{formatDate(customer.created_at)}</td>
                  <td>
                    <Link to={`/admin/customers/${customer.id}`}>
                      <Button size="sm">View</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
