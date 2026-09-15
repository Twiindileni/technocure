import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { customerService } from '../../../services/customerService';
import { supabase } from '../../../lib/supabase';
import { LoadingState } from '../../../components/ui/Spinner';
import { ErrorState } from '../../../components/ui/States';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Table } from '../../../components/ui/Table';
import { StatusBadge, PriorityBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { formatDate } from '../../../utils/formatters';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const custData = await customerService.getCustomer(id);
      setCustomer(custData);
      
      const { data: ticketsData, error: ticketsErr } = await supabase
        .from('tickets')
        .select('*, printer:printers(*)')
        .eq('customer_id', id)
        .order('created_at', { ascending: false });
        
      if (ticketsErr) throw ticketsErr;
      setTickets(ticketsData || []);
    } catch (err) {
      setError('Failed to load customer details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [id]);

  if (loading) return <LoadingState text="Loading customer..." />;
  if (error) return <ErrorState message={error} retry={fetchCustomerData} />;
  if (!customer) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-dark">Customer Details</h1>
      
      <Card>
        <CardHeader title="Profile Information" />
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-brand-gray">Full Name</p>
            <p className="font-semibold text-brand-dark">{customer.full_name || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-sm text-brand-gray">Email</p>
            <p className="font-semibold text-brand-dark">{customer.email}</p>
          </div>
          <div>
            <p className="text-sm text-brand-gray">Phone</p>
            <p className="font-semibold text-brand-dark">{customer.phone || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-brand-gray">Company</p>
            <p className="font-semibold text-brand-dark">{customer.company || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-brand-gray">Address</p>
            <p className="font-semibold text-brand-dark">{customer.address || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-brand-gray">Joined</p>
            <p className="font-semibold text-brand-dark">{formatDate(customer.created_at)}</p>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Customer Tickets" />
        {tickets.length === 0 ? (
          <div className="p-6 text-center text-brand-gray">No tickets found for this customer.</div>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Ticket #</th>
                <th>Printer</th>
                <th>Issue</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id}>
                  <td>{ticket.ticket_number}</td>
                  <td>{ticket.printer?.brand} {ticket.printer?.model}</td>
                  <td className="truncate max-w-[150px]">{ticket.problem_category}</td>
                  <td><StatusBadge status={ticket.status} /></td>
                  <td><PriorityBadge priority={ticket.priority} /></td>
                  <td>{formatDate(ticket.created_at)}</td>
                  <td>
                    <Link to={`/admin/tickets/${ticket.id}`}>
                      <Button size="sm">View</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
