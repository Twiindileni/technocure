import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { partsService } from '../../../services/partsService';
import { LoadingState } from '../../../components/ui/Spinner';
import { ErrorState, EmptyState } from '../../../components/ui/States';
import { Table } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Form';
import { Badge } from '../../../components/ui/Badge';
import { formatDate } from '../../../utils/formatters';

export default function AdminPartRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  
  const [selectedReq, setSelectedReq] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await partsService.getPartRequests({ status: statusFilter });
      setRequests(res.data || []);
    } catch (err) {
      setError('Failed to load part requests.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const openModal = (req) => {
    setSelectedReq(req);
    setNewStatus(req.status);
  };

  const handleUpdate = async () => {
    try {
      await partsService.updatePartRequestStatus(selectedReq.id, newStatus);
      toast.success('Status updated');
      setSelectedReq(null);
      fetchRequests();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (error) return <ErrorState message={error} retry={fetchRequests} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-dark">Part Requests</h1>
      
      <div className="mb-6 max-w-xs">
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} label="Filter by Status">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="ordered">Ordered</option>
          <option value="received">Received</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </div>

      {loading ? <LoadingState text="Loading..." /> : requests.length === 0 ? <EmptyState message="No part requests found." /> : (
        <div className="bg-white border border-brand-border rounded-lg shadow-sm overflow-hidden">
          <Table>
            <thead>
              <tr>
                <th>Request #</th>
                <th>Customer</th>
                <th>Part Name</th>
                <th>Printer</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id}>
                  <td>{req.id.substring(0,8)}</td>
                  <td>{req.customer?.full_name || req.full_name || 'Guest'}</td>
                  <td>{req.requested_part || req.part_name}</td>
                  <td>{req.printer_brand} {req.printer_model}</td>
                  <td>
                    <Badge variant={req.status === 'fulfilled' ? 'success' : req.status === 'pending' ? 'warning' : 'primary'}>
                      {req.status}
                    </Badge>
                  </td>
                  <td>{formatDate(req.created_at)}</td>
                  <td>
                    <Button size="sm" onClick={() => openModal(req)}>View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {selectedReq && (
        <Modal open={!!selectedReq} onClose={() => setSelectedReq(null)} title="Part Request Details">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-brand-gray">Customer</p>
                <p className="font-semibold">{selectedReq.customer?.name}</p>
              </div>
              <div>
                <p className="text-brand-gray">Printer</p>
                <p className="font-semibold">{selectedReq.printer?.brand} {selectedReq.printer?.model}</p>
              </div>
              <div>
                <p className="text-brand-gray">Part Requested</p>
                <p className="font-semibold">{selectedReq.part_name}</p>
              </div>
              <div>
                <p className="text-brand-gray">Date Requested</p>
                <p className="font-semibold">{formatDate(selectedReq.created_at)}</p>
              </div>
            </div>
            
            <Select label="Update Status" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="ordered">Ordered</option>
              <option value="received">Received</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="cancelled">Cancelled</option>
            </Select>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={() => setSelectedReq(null)}>Cancel</Button>
              <Button onClick={handleUpdate}>Save Changes</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
