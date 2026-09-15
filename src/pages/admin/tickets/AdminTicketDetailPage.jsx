import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ticketService } from '../../../services/ticketService';
import { customerService } from '../../../services/customerService';
import { LoadingState } from '../../../components/ui/Spinner';
import { ErrorState } from '../../../components/ui/States';
import { Card, CardHeader } from '../../../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Select, Input, Textarea } from '../../../components/ui/Form';
import { TicketTimeline } from '../../../components/tickets/TicketTimeline';
import { formatDate } from '../../../utils/formatters';
import { TICKET_STATUSES } from '../../../utils/ticketUtils';

export default function AdminTicketDetailPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newNote, setNewNote] = useState('');
  const [noteVisible, setNoteVisible] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const [ticketData, staffData] = await Promise.all([
        ticketService.getTicket(id),
        customerService.getStaff()
      ]);
      setTicket(ticketData);
      setTechnicians(staffData.filter(s => s.role === 'technician' || s.role === 'admin'));
      reset({
        diagnosis: ticketData.diagnosis || '',
        work_performed: ticketData.work_performed || '',
        parts_used: ticketData.parts_used || '',
        labour_hours: ticketData.labour_hours || '',
        final_cost: ticketData.final_cost || '',
        scheduled_date: ticketData.scheduled_date ? ticketData.scheduled_date.slice(0, 16) : ''
      });
    } catch (err) {
      setError('Failed to load ticket details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id, reset]);

  const handleStatusChange = async (e) => {
    try {
      await ticketService.updateTicket(id, { status: e.target.value });
      toast.success('Status updated');
      fetchTicket();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleTechChange = async (e) => {
    try {
      await ticketService.updateTicket(id, { assigned_technician_id: e.target.value || null });
      toast.success('Technician assigned');
      fetchTicket();
    } catch (err) {
      toast.error('Failed to assign technician');
    }
  };

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
      toast.success('Work details updated');
      fetchTicket();
    } catch (err) {
      toast.error('Failed to update work details');
    }
  };

  if (loading) return <LoadingState text="Loading ticket..." />;
  if (error) return <ErrorState message={error} retry={fetchTicket} />;
  if (!ticket) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-brand-border">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Ticket {ticket.ticket_number}</h1>
          <p className="text-sm text-brand-gray">Created: {formatDate(ticket.created_at)}</p>
        </div>
        <div className="flex gap-4 items-center">
          <Select value={ticket.status} onChange={handleStatusChange} className="w-48">
            {Object.keys(TICKET_STATUSES).map(k => (
              <option key={k} value={k}>{TICKET_STATUSES[k]}</option>
            ))}
          </Select>
          <Select value={ticket.assigned_technician_id || ''} onChange={handleTechChange} className="w-48">
            <option value="">Unassigned</option>
            {technicians.map(t => (
              <option key={t.id} value={t.id}>{t.full_name}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader title="Customer Info" />
              <div className="p-4 space-y-2">
                <p><strong>Name:</strong> {ticket.customer?.full_name || ticket.contact_name || 'Guest'}</p>
                <p><strong>Company:</strong> {ticket.customer?.company || '-'}</p>
                <p><strong>Email:</strong> {ticket.customer?.email || ticket.contact_email}</p>
                <p><strong>Phone:</strong> {ticket.customer?.phone || ticket.contact_phone}</p>
              </div>
            </Card>
            <Card>
              <CardHeader title="Printer Info" />
              <div className="p-4 space-y-2">
                <p><strong>Brand:</strong> {ticket.printer?.brand}</p>
                <p><strong>Model:</strong> {ticket.printer?.model}</p>
                <p><strong>Serial:</strong> {ticket.serial_number || '-'}</p>
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader title="Problem Details" />
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <PriorityBadge priority={ticket.priority} />
                <span className="font-semibold">{ticket.problem_category}</span>
              </div>
              <p className="text-brand-dark">{ticket.description}</p>
            </div>
          </Card>

          <Card>
            <CardHeader title="Notes" />
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                {ticket.ticket_notes?.map(note => (
                  <div key={note.id} className={`p-3 rounded border ${note.is_customer_visible ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                    <p className="text-xs text-brand-gray mb-1">
                      {formatDate(note.created_at)} - {note.author?.name} 
                      {note.is_customer_visible && <span className="ml-2 text-blue-600 font-semibold">(Visible to Customer)</span>}
                    </p>
                    <p>{note.content}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t pt-4">
                <Textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add a note..." rows={3} className="mb-2" />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-brand-dark">
                    <input type="checkbox" checked={noteVisible} onChange={e => setNoteVisible(e.target.checked)} className="rounded text-brand-primary focus:ring-brand-primary" />
                    Customer Visible
                  </label>
                  <Button onClick={handleAddNote}>Add Note</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Technician Work" />
            <form onSubmit={handleSubmit(onSubmitWork)} className="p-4 space-y-4">
              <Textarea label="Diagnosis" {...register('diagnosis')} rows={3} />
              <Textarea label="Work Performed" {...register('work_performed')} rows={3} />
              <Textarea label="Parts Used" {...register('parts_used')} rows={2} />
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" step="0.5" label="Labour Hours" {...register('labour_hours')} />
                <Input type="number" step="0.01" label="Final Cost ($)" {...register('final_cost')} />
              </div>
              <Input type="datetime-local" label="Scheduled Date" {...register('scheduled_date')} />
              <Button type="submit" className="w-full">Save Work Details</Button>
            </form>
          </Card>

          <Card>
            <CardHeader title="Timeline" />
            <div className="p-4">
              <TicketTimeline ticketId={id} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
