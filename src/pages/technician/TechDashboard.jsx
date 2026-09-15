import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ticketService } from '../../services/ticketService';
import { LoadingState } from '../../components/ui/Spinner';
import { ErrorState } from '../../components/ui/States';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export default function TechDashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await ticketService.getTechnicianTickets(user.id);
        setTickets(data);
      } catch (err) {
        setError('Failed to load your jobs.');
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchTickets();
  }, [user]);

  if (loading) return <LoadingState text="Loading your jobs..." />;
  if (error) return <ErrorState message={error} />;

  // Simple categorization
  const todayJobs = tickets.filter(t => t.status === 'in_progress' || t.status === 'scheduled');
  const awaitingParts = tickets.filter(t => t.status === 'awaiting_parts');
  const otherJobs = tickets.filter(t => t.status !== 'in_progress' && t.status !== 'scheduled' && t.status !== 'awaiting_parts' && t.status !== 'completed' && t.status !== 'closed');

  const TicketCard = ({ ticket }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-brand-border space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-brand-dark">{ticket.ticket_number}</h3>
          <p className="text-sm text-brand-gray">{ticket.customer?.full_name || ticket.contact_name || 'Guest'}</p>
        </div>
        <PriorityBadge priority={ticket.priority} />
      </div>
      <p className="text-sm"><strong>Printer:</strong> {ticket.printer?.brand} {ticket.printer?.model}</p>
      <div className="flex justify-between items-center pt-2">
        <StatusBadge status={ticket.status} />
        <Link to={`/technician/tickets/${ticket.id}`}>
          <Button size="sm">Open</Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-dark">My Jobs</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4 text-brand-dark border-b pb-2">Active & Scheduled</h2>
          <div className="space-y-4">
            {todayJobs.length === 0 ? <p className="text-brand-gray text-sm italic">No active jobs.</p> : todayJobs.map(t => <TicketCard key={t.id} ticket={t} />)}
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4 text-brand-dark border-b pb-2">Awaiting Parts</h2>
          <div className="space-y-4">
            {awaitingParts.length === 0 ? <p className="text-brand-gray text-sm italic">No jobs waiting for parts.</p> : awaitingParts.map(t => <TicketCard key={t.id} ticket={t} />)}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 text-brand-dark border-b pb-2">Other Open Jobs</h2>
          <div className="space-y-4">
            {otherJobs.length === 0 ? <p className="text-brand-gray text-sm italic">No other open jobs.</p> : otherJobs.map(t => <TicketCard key={t.id} ticket={t} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
