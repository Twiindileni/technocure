import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { quoteService } from '../../../services/quoteService';
import { LoadingState } from '../../../components/ui/Spinner';
import { ErrorState, EmptyState } from '../../../components/ui/States';
import { Table } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Select, Textarea } from '../../../components/ui/Form';
import { Badge } from '../../../components/ui/Badge';
import { formatDate, formatCurrency } from '../../../utils/formatters';

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const res = await quoteService.getQuotes({ status: statusFilter });
      setQuotes(res.data || []);
    } catch (err) {
      setError('Failed to load quotes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [statusFilter]);

  const openQuoteModal = (quote) => {
    setSelectedQuote(quote);
    setNewStatus(quote.status);
    setAdminNotes(quote.notes || '');
  };

  const handleUpdateQuote = async () => {
    try {
      await quoteService.updateQuote(selectedQuote.id, { status: newStatus, notes: adminNotes });
      toast.success('Quote updated');
      setSelectedQuote(null);
      fetchQuotes();
    } catch (err) {
      toast.error('Failed to update quote: ' + (err.message || 'Unknown error'));
      console.error(err);
    }
  };

  if (error) return <ErrorState message={error} retry={fetchQuotes} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-dark">Quote Requests</h1>
      
      <div className="mb-6 max-w-xs">
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} label="Filter by Status">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewing">Reviewing</option>
          <option value="quoted">Quoted</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </Select>
      </div>

      {loading ? <LoadingState text="Loading..." /> : quotes.length === 0 ? <EmptyState message="No quotes found." /> : (
        <div className="bg-white border border-brand-border rounded-lg shadow-sm overflow-hidden">
          <Table>
            <thead>
              <tr>
                <th>Quote #</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map(quote => (
                <tr key={quote.id}>
                  <td>{quote.id.substring(0,8)}</td>
                  <td>{quote.customer?.full_name || quote.full_name || 'Guest'}</td>
                  <td className="capitalize">{quote.quote_type}</td>
                  <td>
                    <Badge variant={quote.status === 'accepted' ? 'success' : quote.status === 'pending' ? 'warning' : 'primary'}>
                      {quote.status}
                    </Badge>
                  </td>
                  <td>{formatDate(quote.created_at)}</td>
                  <td>{quote.total_amount ? formatCurrency(quote.total_amount) : '-'}</td>
                  <td>
                    <Button size="sm" onClick={() => openQuoteModal(quote)}>View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {selectedQuote && (
        <Modal open={!!selectedQuote} onClose={() => setSelectedQuote(null)} title="Quote Details">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-brand-gray">Customer</p>
                <p className="font-semibold">{selectedQuote.customer?.name} ({selectedQuote.customer?.email})</p>
              </div>
              <div>
                <p className="text-brand-gray">Date Requested</p>
                <p className="font-semibold">{formatDate(selectedQuote.created_at)}</p>
              </div>
            </div>
            
            <div className="border-t border-brand-border pt-4">
              <p className="text-brand-gray text-sm mb-2">Request Details</p>
              <div className="bg-brand-bg p-3 rounded">
                {selectedQuote.details}
              </div>
            </div>

            <div className="border-t border-brand-border pt-4 space-y-4">
              <Select label="Status" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="Reviewing">Reviewing</option>
                <option value="Quoted">Quoted</option>
                <option value="Accepted">Accepted</option>
                <option value="Declined">Declined</option>
                <option value="Completed">Completed</option>
              </Select>
              
              <Textarea 
                label="Admin Notes" 
                value={adminNotes} 
                onChange={e => setAdminNotes(e.target.value)} 
                rows={3} 
                placeholder="Internal notes..."
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={() => setSelectedQuote(null)}>Cancel</Button>
              <Button onClick={handleUpdateQuote}>Save Changes</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
