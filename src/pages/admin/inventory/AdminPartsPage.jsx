import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { partsService } from '../../../services/partsService';
import { storageService } from '../../../services/storageService';
import { LoadingState } from '../../../components/ui/Spinner';
import { ErrorState, EmptyState } from '../../../components/ui/States';
import { Table } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input, Textarea } from '../../../components/ui/Form';
import { FileUpload } from '../../../components/ui/FileUpload';
import { formatCurrency } from '../../../utils/formatters';

export default function AdminPartsPage() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchParts = async () => {
    try {
      setLoading(true);
      const res = await partsService.getParts({ limit: 100 });
      setParts(res.data || []);
    } catch (err) {
      setError('Failed to load parts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  const openModal = (part = null) => {
    setSelectedImage(null);
    if (part) {
      setEditingId(part.id);
      Object.keys(part).forEach(key => {
        if (key !== 'part_images') setValue(key, part[key]);
      });
    } else {
      setEditingId(null);
      reset({});
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        brand: data.brand,
        part_number: data.part_number,
        description: data.description,
        price: parseFloat(data.price),
        stock_quantity: parseInt(data.stock_quantity, 10),
      };

      let partId = editingId;
      if (editingId) {
        await partsService.updatePart(editingId, payload);
        toast.success('Part updated');
      } else {
        const newPart = await partsService.createPart(payload);
        partId = newPart.id;
        toast.success('Part added');
      }

      if (selectedImage) {
        const ext = selectedImage.name.split('.').pop();
        const fileName = `${partId}-${Date.now()}.${ext}`;
        const { path } = await storageService.upload('parts', fileName, selectedImage);
        await partsService.addPartImage(partId, path, true);
        toast.success('Image uploaded');
      }

      setIsModalOpen(false);
      fetchParts();
    } catch (err) {
      console.error(err);
      toast.error('Operation failed: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      try {
        await partsService.deletePart(id);
        toast.success('Part deleted');
        fetchParts();
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  if (error) return <ErrorState message={error} retry={fetchParts} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand-dark">Parts Inventory</h1>
        <Button onClick={() => openModal()}>Add Part</Button>
      </div>

      {loading ? <LoadingState text="Loading..." /> : parts.length === 0 ? <EmptyState message="No parts found." /> : (
        <div className="bg-white border border-brand-border rounded-lg shadow-sm overflow-hidden">
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>Part Number</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {parts.map(part => (
                <tr key={part.id}>
                  <td>{part.name}</td>
                  <td>{part.brand}</td>
                  <td>{part.part_number}</td>
                  <td>{formatCurrency(part.price)}</td>
                  <td className={part.stock_quantity === 0 ? 'text-red-500 font-bold' : part.stock_quantity < 5 ? 'text-yellow-600 font-bold' : ''}>
                    {part.stock_quantity}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openModal(part)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(part.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Part' : 'Add Part'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Name" {...register('name', { required: true })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Brand" {...register('brand', { required: true })} />
            <Input label="Part Number" {...register('part_number', { required: true })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input type="number" step="0.01" label="Price" {...register('price', { required: true })} />
            <Input type="number" label="Stock" {...register('stock_quantity', { required: true })} />
          </div>
          <Textarea label="Description" {...register('description')} rows={3} />
          
          <div className="pt-2">
            <FileUpload 
              label="Part Image (Optional)" 
              accept="image/*"
              onChange={file => setSelectedImage(file)}
              files={selectedImage ? [selectedImage] : []}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
