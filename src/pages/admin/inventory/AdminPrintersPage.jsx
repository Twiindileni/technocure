import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { productService } from '../../../services/productService';
import { storageService } from '../../../services/storageService';
import { LoadingState } from '../../../components/ui/Spinner';
import { ErrorState, EmptyState } from '../../../components/ui/States';
import { Table } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input, Select, Textarea } from '../../../components/ui/Form';
import { FileUpload } from '../../../components/ui/FileUpload';
import { formatCurrency } from '../../../utils/formatters';

export default function AdminPrintersPage() {
  const [printers, setPrinters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchPrinters = async () => {
    try {
      setLoading(true);
      const res = await productService.getPrinters({ limit: 100 });
      setPrinters(res.data || []);
    } catch (err) {
      setError('Failed to load printers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrinters();
  }, []);

  const openModal = (printer = null) => {
    setSelectedImage(null);
    if (printer) {
      setEditingId(printer.id);
      Object.keys(printer).forEach(key => {
        if (key !== 'printer_images') setValue(key, printer[key]);
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
        model: data.model,
        category: data.category,
        warranty: data.warranty,
        description: data.description,
        price: parseFloat(data.price),
        stock_quantity: parseInt(data.stock_quantity, 10),
      };

      let printerId = editingId;
      if (editingId) {
        await productService.updatePrinter(editingId, payload);
        toast.success('Printer updated');
      } else {
        const newPrinter = await productService.createPrinter(payload);
        printerId = newPrinter.id;
        toast.success('Printer added');
      }
      
      if (selectedImage) {
        const ext = selectedImage.name.split('.').pop();
        const fileName = `${printerId}-${Date.now()}.${ext}`;
        const { path } = await storageService.upload('products', fileName, selectedImage);
        await productService.addPrinterImage(printerId, path, true);
        toast.success('Image uploaded');
      }

      setIsModalOpen(false);
      fetchPrinters();
    } catch (err) {
      console.error(err);
      toast.error('Operation failed: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this printer?')) {
      try {
        await productService.deletePrinter(id);
        toast.success('Printer deleted');
        fetchPrinters();
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  if (error) return <ErrorState message={error} retry={fetchPrinters} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand-dark">Printers Inventory</h1>
        <Button onClick={() => openModal()}>Add Printer</Button>
      </div>

      {loading ? <LoadingState text="Loading..." /> : printers.length === 0 ? <EmptyState message="No printers found." /> : (
        <div className="bg-white border border-brand-border rounded-lg shadow-sm overflow-hidden">
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {printers.map(printer => (
                <tr key={printer.id}>
                  <td>{printer.name}</td>
                  <td>{printer.brand}</td>
                  <td className="capitalize">{printer.category}</td>
                  <td>{formatCurrency(printer.price)}</td>
                  <td className={printer.stock_quantity === 0 ? 'text-red-500 font-bold' : printer.stock_quantity < 5 ? 'text-yellow-600 font-bold' : ''}>
                    {printer.stock_quantity}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openModal(printer)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(printer.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Printer' : 'Add Printer'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Name" {...register('name', { required: true })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Brand" {...register('brand', { required: true })} />
            <Input label="Model" {...register('model', { required: true })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Category" 
              options={[
                { value: 'Laser', label: 'Laser' },
                { value: 'Inkjet', label: 'Inkjet' },
                { value: 'Multifunction', label: 'Multifunction' },
                { value: 'Office', label: 'Office' },
                { value: 'Business', label: 'Business' },
                { value: 'Label', label: 'Label' },
                { value: 'Other', label: 'Other' }
              ]}
              {...register('category', { required: true })} 
            />
            <Input label="Warranty" {...register('warranty')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input type="number" step="0.01" label="Price" {...register('price', { required: true })} />
            <Input type="number" label="Stock" {...register('stock_quantity', { required: true })} />
          </div>
          <Textarea label="Description" {...register('description')} rows={3} />
          
          <div className="pt-2">
            <FileUpload 
              label="Printer Image (Optional)" 
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
