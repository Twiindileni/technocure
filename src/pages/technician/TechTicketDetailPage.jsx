import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ticketService } from '../../services/ticketService';
import { LoadingState } from '../../components/ui/Spinner';
import { ErrorState } from '../../components/ui/States';
import { Card, CardHeader } from '../../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select, Input, Textarea } from '../../components/ui/Form';
import { TicketTimeline } from '../../components/tickets/TicketTimeline';
import { TICKET_STATUSES } from '../../utils/ticketUtils';

export default function TechTicketDetailPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newNote, setNewNote] = useState('');
  const [noteVisible, setNoteVisible] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const fetchTicket = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTicket(id);
      setTicket(data);
      reset({
        diagnosis: data.diagnosis || '',
        work_performed: data.work_performed || '',
        parts_used: data.parts_used || '',
        labour_hours: data.labour_hours || '',
        status: data.status
      });
    } catch (err) {
      setError('Failed to load ticket details.');
    } finally {
      setLoading(false);
    }
  }, [id, reset]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      await ticketService.addNote(id, { content: newNote, is_customer_visible: noteVisible });
      toast.success('Note added');
      setNewNote('');
      setNoteVisible(false);
      fetchTicket();
    } catch (err) {
      toast.error('Failed to add note');
    }
  };

  const onSubmitWork = async (data) => {
    try {
      await ticketService.updateTicket(id, data);
      toast.success('Ticket updated');
      fetchTicket();
    } catch (err) {
      toast.error('Failed to update ticket');
    }
  };

  if (loading) return <LoadingState text="Loading ticket..." />;
  if (error) return <ErrorState message={error} retry={fetchTicket} />;
  if (!ticket) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-brand-border">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Ticket {ticket.ticket_number}</h1>
          <div className="flex gap-2 mt-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Information" />
            <div className="p-4 space-y-4">
              <div>
                <h3 className="font-semibold text-brand-dark mb-1">Customer</h3>
                <p>{ticket.customer?.full_name || ticket.contact_name || 'Guest'} - {ticket.customer?.phone || ticket.contact_phone || 'No phone'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-brand-dark mb-1">Printer</h3>
                <p>{ticket.printer?.brand} {ticket.printer?.model}</p>
                <p className="text-sm text-brand-gray">Serial: {ticket.serial_number || '-'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-brand-dark mb-1">Problem: {ticket.problem_category}</h3>
                <p className="bg-brand-bg p-3 rounded text-sm">{ticket.description}</p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Add Note" />
            <div className="p-4">
              <Textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Type a note..." rows={3} className="mb-2" />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-brand-dark">
                  <input type="checkbox" checked={noteVisible} onChange={e => setNoteVisible(e.target.checked)} className="rounded text-brand-primary focus:ring-brand-primary" />
                  Customer Visible
                </label>
                <Button onClick={handleAddNote} disabled={!newNote.trim()}>Add Note</Button>
              </div>
            </div>
          </Card>
          
          <Card>
            <CardHeader title="Timeline" />
            <div className="p-4">
              <TicketTimeline ticketId={id} />
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader title="Work Details" />
            <form onSubmit={handleSubmit(onSubmitWork)} className="p-4 space-y-4">
              <Select label="Status" {...register('status')}>
                {Object.keys(TICKET_STATUSES).map(k => (
                  <option key={k} value={k}>{TICKET_STATUSES[k]}</option>
                ))}
              </Select>
              <Textarea label="Diagnosis" {...register('diagnosis')} rows={3} placeholder="What did you find?" />
              <Textarea label="Work Performed" {...register('work_performed')} rows={4} placeholder="What did you do?" />
              <Textarea label="Parts Used" {...register('parts_used')} rows={2} placeholder="Any parts replaced?" />
              <div className="w-1/2">
                <Input type="number" step="0.5" label="Labour Hours" {...register('labour_hours')} />
              </div>
              <Button type="submit" className="w-full">Save Changes</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
