import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, ShoppingCart, Search } from "lucide-react";
import toast from "react-hot-toast";
import { partsService } from "../../services/partsService";
import { storageService } from "../../services/storageService";
import { useCart } from "../../context/CartContext";
import { LoadingState } from "../../components/ui/Spinner";
import { EmptyState } from "../../components/ui/States";
import { Badge } from "../../components/ui/Badge";
import { SearchBar, Pagination } from "../../components/ui/SearchBar";
import { formatCurrency } from "../../utils/formatters";

function StockBadge({ qty }) {
  if (qty === 0)  return <Badge color="red">Out of Stock</Badge>;
  if (qty < 5)    return <Badge color="yellow">Low Stock</Badge>;
  return <Badge color="green">In Stock</Badge>;
}

function PartCard({ part }) {
  const { addItem } = useCart();
  const img = part.part_images?.[0];
  const compatible = part.part_compatibility?.slice(0, 2) || [];
  return (
    <div className="card overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="aspect-video bg-brand-bg flex items-center justify-center border-b border-brand-border relative">
        {img ? <img src={storageService.getPublicUrl('parts', img.storage_path)} alt={part.name} className="w-full h-full object-contain p-4" />
             : <Package className="w-14 h-14 text-gray-300" />}
        {part.part_number && <span className="absolute top-2 right-2 text-[10px] bg-brand-dark text-white px-1.5 py-0.5 rounded font-mono">{part.part_number}</span>}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs text-brand-gray font-medium uppercase tracking-wide mb-1">{part.brand}</p>
        <h3 className="font-semibold text-brand-dark leading-tight mb-2 flex-1">{part.name}</h3>
        {compatible.length > 0 && <p className="text-xs text-brand-gray mb-3">Compatible: {compatible.map(c => c.printer_brand + " " + c.printer_model).join(", ")}{part.part_compatibility?.length > 2 ? " +" + (part.part_compatibility.length - 2) + " more" : ""}</p>}
        <div className="flex items-center justify-between mb-4">
          <p className="text-lg font-bold text-brand-primary">{formatCurrency(part.price)}</p>
          <StockBadge qty={part.stock_quantity} />
        </div>
        <div className="flex gap-2">
          <Link to={"/shop/parts/" + part.id} className="btn-secondary text-xs flex-1 text-center">View Part</Link>
          <button disabled={part.stock_quantity === 0}
            onClick={() => { addItem({ id: part.id, name: part.name, price: part.price, type: "part" }); toast.success("Added to quote list"); }}
            className="btn-primary text-xs flex-1 disabled:opacity-40 disabled:cursor-not-allowed">
            <ShoppingCart className="w-3.5 h-3.5 mr-1" />Add to Quote
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PartsPage() {
  const [parts, setParts]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);

  useEffect(() => {
    setLoading(true);
    partsService.getParts({ search: search || undefined, page })
      .then(r => { setParts(r.data); setTotal(r.total); })
      .catch(() => toast.error("Failed to load parts"))
      .finally(() => setLoading(false));
  }, [search, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="text-sm text-brand-gray mb-1"><Link to="/" className="hover:text-brand-primary">Home</Link> / Shop / Parts</p>
        <h1 className="text-2xl font-bold text-brand-dark">Printer Parts</h1>
        <p className="text-brand-gray mt-1">Genuine replacement parts for all major printer brands.</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search parts..." className="w-72" />
      </div>

      {loading ? <LoadingState message="Loading parts..." /> : parts.length === 0 ? (
        <EmptyState icon={<Package className="w-12 h-12" />} title="No parts found" description="Try a different search term." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {parts.map(p => <PartCard key={p.id} part={p} />)}
          </div>
          <Pagination page={page} total={total} pageSize={12} onChange={setPage} />
        </>
      )}

      <div className="mt-12 bg-brand-dark rounded-xl p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Can't find the part you need?</h3>
        <p className="text-gray-400 mb-6">Tell us what you're looking for and our team will source it for you.</p>
        <Link to="/parts/request" className="btn-primary">Request a Part</Link>
      </div>
    </div>
  );
}
