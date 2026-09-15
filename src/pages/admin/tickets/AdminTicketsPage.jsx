import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../../../services/ticketService';
import { LoadingState } from '../../../components/ui/Spinner';
import { ErrorState, EmptyState } from '../../../components/ui/States';
import { Table } from '../../../components/ui/Table';
import { StatusBadge, PriorityBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Form';
import { SearchBar, Pagination } from '../../../components/ui/SearchBar';
import { formatDate } from '../../../utils/formatters';
import { TICKET_STATUSES, TICKET_PRIORITIES } from '../../../utils/ticketUtils';

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await ticketService.getAllTickets({ status, priority, search, page });
      setTickets(res.data || []);
    } catch (err) {
      setError('Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [status, priority, search, page]);

  if (error) return <ErrorState message={error} retry={fetchTickets} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-dark">Tickets</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search tickets..." />
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {Object.keys(TICKET_STATUSES).map(k => (
            <option key={k} value={k}>{TICKET_STATUSES[k]}</option>
          ))}
        </Select>
        <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All Priorities</option>
          {Object.keys(TICKET_PRIORITIES).map(k => (
            <option key={k} value={k}>{TICKET_PRIORITIES[k]}</option>
          ))}
        </Select>
      </div>

      {loading && <LoadingState text="Loading..." />}

      {!loading && tickets.length === 0 ? (
        <EmptyState message="No tickets found matching your criteria." />
      ) : (
        !loading && (
          <div className="bg-white border border-brand-border rounded-lg shadow-sm overflow-hidden">
            <Table>
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Customer</th>
                  <th>Printer</th>
                  <th>Issue</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Technician</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(ticket => (
                  <tr key={ticket.id}>
                    <td>{ticket.ticket_number}</td>
                    <td>{ticket.customer?.full_name || ticket.contact_name || 'Guest'}</td>
                    <td>{ticket.printer?.brand} {ticket.printer?.model}</td>
                    <td className="truncate max-w-[150px]">{ticket.problem_category}</td>
                    <td><StatusBadge status={ticket.status} /></td>
                    <td><PriorityBadge priority={ticket.priority} /></td>
                    <td>{ticket.assigned_technician?.full_name || 'Unassigned'}</td>
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
            <div className="p-4 border-t border-brand-border">
              <Pagination currentPage={page} onPageChange={setPage} hasNext={tickets.length === 20} />
            </div>
          </div>
        )
      )}
    </div>
  );
}
