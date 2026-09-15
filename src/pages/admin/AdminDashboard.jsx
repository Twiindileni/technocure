import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { Spinner, LoadingState } from '../../components/ui/Spinner';
import { ErrorState } from '../../components/ui/States';
import { StatCard, Card, CardHeader } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../utils/formatters';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, ticketsData] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getRecentTickets()
        ]);
        setStats(statsData);
        setRecentTickets(ticketsData);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingState text="Loading dashboard..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-dark">Dashboard</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Tickets" value={stats?.totalTickets || 0} />
        <StatCard title="Open Tickets" value={stats?.openTickets || 0} />
        <StatCard title="In Progress" value={stats?.inProgressTickets || 0} />
        <StatCard title="Pending Quotes" value={stats?.pendingQuotes || 0} />
      </div>

      <div className="flex gap-4">
        <Link to="/admin/tickets"><Button variant="outline">Manage Tickets</Button></Link>
        <Link to="/admin/inventory/printers"><Button variant="outline">Manage Inventory</Button></Link>
        <Link to="/admin/customers"><Button variant="outline">View Customers</Button></Link>
      </div>

      <Card>
        <CardHeader title="Recent Tickets" />
        <Table>
          <thead>
            <tr>
              <th>Ticket #</th>
              <th>Customer</th>
              <th>Printer</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {recentTickets.map(ticket => (
              <tr key={ticket.id}>
                <td>{ticket.ticket_number}</td>
                <td>{ticket.customer?.full_name || ticket.contact_name || 'Guest'}</td>
                <td>{ticket.printer?.brand} {ticket.printer?.model}</td>
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
            {recentTickets.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4">No recent tickets</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
