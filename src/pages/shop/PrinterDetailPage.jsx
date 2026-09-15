import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Printer, ShoppingCart, Ticket } from "lucide-react";
import toast from "react-hot-toast";
import { productService } from "../../services/productService";
import { storageService } from "../../services/storageService";
import { useCart } from "../../context/CartContext";
import { LoadingState } from "../../components/ui/Spinner";
import { Badge } from "../../components/ui/Badge";
import { formatCurrency } from "../../utils/formatters";

export default function PrinterDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [printer, setPrinter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx]   = useState(0);

  useEffect(() => {
    productService.getPrinter(id)
      .then(setPrinter)
      .catch(() => toast.error("Failed to load printer"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingState message="Loading printer..." />;
  if (!printer) return <div className="p-10 text-center text-brand-gray">Printer not found.</div>;

  const imgs = printer.printer_images || [];
  const specs = printer.specifications || {};

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <p className="text-sm text-brand-gray mb-6"><Link to="/" className="hover:text-brand-primary">Home</Link> / <Link to="/shop/printers" className="hover:text-brand-primary">Printers</Link> / {printer.name}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <div className="aspect-square bg-brand-bg border border-brand-border rounded-xl flex items-center justify-center mb-3 overflow-hidden">
            {imgs[imgIdx] ? <img src={storageService.getPublicUrl('products', imgs[imgIdx].storage_path)} alt={printer.name} className="w-full h-full object-contain p-8" />
              : <Printer className="w-24 h-24 text-gray-300" />}
          </div>
          {imgs.length > 1 && (
            <div className="flex gap-2">
              {imgs.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={"w-16 h-16 rounded border-2 overflow-hidden transition-colors " + (i === imgIdx ? "border-brand-primary" : "border-brand-border")}>
                  <img src={storageService.getPublicUrl('products', img.storage_path)} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            {printer.brand && <Badge color="gray">{printer.brand}</Badge>}
            {printer.category && <Badge color="blue">{printer.category}</Badge>}
          </div>
          <h1 className="text-2xl font-bold text-brand-dark mb-1">{printer.name}</h1>
          {printer.model && <p className="text-brand-gray text-sm mb-4">Model: {printer.model}</p>}
          <p className="text-3xl font-extrabold text-brand-primary mb-2">{formatCurrency(printer.price)}</p>
          <p className="text-sm text-brand-gray mb-5">
            {printer.stock_quantity === 0 ? <span className="text-red-600 font-medium">Out of Stock</span> : printer.stock_quantity < 5 ? <span className="text-amber-600 font-medium">Low Stock — {printer.stock_quantity} left</span> : <span className="text-green-600 font-medium">In Stock</span>}
          </p>
          <p className="text-brand-gray leading-relaxed mb-6">{printer.description}</p>

          {printer.features?.length > 0 && (
            <ul className="mb-6 space-y-1.5">
              {printer.features.map(f => <li key={f} className="flex items-center gap-2 text-sm text-brand-dark"><span className="w-1.5 h-1.5 rounded-full bg-brand-primary flex-shrink-0" />{f}</li>)}
            </ul>
          )}

          {printer.warranty && <p className="text-sm text-brand-gray mb-6">Warranty: <span className="font-medium text-brand-dark">{printer.warranty}</span></p>}

          <div className="flex flex-col gap-3">
            <button disabled={printer.stock_quantity === 0}
              onClick={() => { addItem({ id: printer.id, name: printer.name, price: printer.price, type: "printer" }); toast.success("Added to quote list!"); }}
              className="btn-primary py-3 disabled:opacity-40 disabled:cursor-not-allowed justify-center">
              <ShoppingCart className="w-5 h-5 mr-2" />Add to Quote List
            </button>
            <Link to="/quotes/new" className="btn-outline py-3 justify-center text-center">Request a Quote</Link>
            <Link to="/tickets/new" className="btn-ghost py-2 justify-center text-sm text-center">
              <Ticket className="w-4 h-4 mr-1.5" />Log a service ticket for this model
            </Link>
          </div>
        </div>
      </div>

      {Object.keys(specs).length > 0 && (
        <div className="mt-12 card overflow-hidden">
          <div className="bg-brand-bg px-6 py-3 border-b border-brand-border"><h2 className="font-semibold text-brand-dark">Specifications</h2></div>
          <table className="w-full text-sm">
            <tbody>{Object.entries(specs).map(([k, v]) => <tr key={k} className="border-b border-brand-border"><td className="px-6 py-3 text-brand-gray w-1/3">{k}</td><td className="px-6 py-3 text-brand-dark font-medium">{String(v)}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
