import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Package, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { partsService } from "../../services/partsService";
import { storageService } from "../../services/storageService";
import { useCart } from "../../context/CartContext";
import { LoadingState } from "../../components/ui/Spinner";
import { Badge } from "../../components/ui/Badge";
import { formatCurrency } from "../../utils/formatters";

export default function PartDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [part, setPart]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    partsService.getPart(id)
      .then(setPart)
      .catch(() => toast.error("Failed to load part"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingState />;
  if (!part) return <div className="p-10 text-center text-brand-gray">Part not found.</div>;

  const imgs = part.part_images || [];
  const compat = part.part_compatibility || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <p className="text-sm text-brand-gray mb-6"><Link to="/" className="hover:text-brand-primary">Home</Link> / <Link to="/shop/parts" className="hover:text-brand-primary">Parts</Link> / {part.name}</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="aspect-square bg-brand-bg border border-brand-border rounded-xl flex items-center justify-center">
          {imgs[0] ? <img src={storageService.getPublicUrl('parts', imgs[0].storage_path)} alt={part.name} className="w-full h-full object-contain p-8" /> : <Package className="w-24 h-24 text-gray-300" />}
        </div>
        <div>
          {part.brand && <Badge color="gray" className="mb-2">{part.brand}</Badge>}
          <h1 className="text-2xl font-bold text-brand-dark mt-2 mb-1">{part.name}</h1>
          {part.part_number && <p className="text-sm text-brand-gray font-mono mb-4">Part #: {part.part_number}</p>}
          <p className="text-3xl font-extrabold text-brand-primary mb-1">{formatCurrency(part.price)}</p>
          <p className="text-sm mb-5">{part.stock_quantity === 0 ? <span className="text-red-600 font-medium">Out of Stock</span> : <span className="text-green-600 font-medium">In Stock ({part.stock_quantity})</span>}</p>
          <p className="text-brand-gray leading-relaxed mb-6">{part.description}</p>
          {compat.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-brand-dark mb-2">Compatible With:</p>
              <div className="flex flex-wrap gap-2">{compat.map(c => <span key={c.id} className="text-xs bg-brand-bg border border-brand-border rounded px-2 py-1">{c.printer_brand} {c.printer_model}</span>)}</div>
            </div>
          )}
          <div className="flex flex-col gap-3">
            <button disabled={part.stock_quantity === 0}
              onClick={() => { addItem({ id: part.id, name: part.name, price: part.price, type: "part" }); toast.success("Added!"); }}
              className="btn-primary py-3 disabled:opacity-40 justify-center"><ShoppingCart className="w-4 h-4 mr-2" />Add to Quote List</button>
            <Link to="/quotes/new" className="btn-outline py-2 text-center">Request a Quote</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
