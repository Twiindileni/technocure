import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Printer, Package, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { productService } from "../../services/productService";
import { storageService } from "../../services/storageService";
import { useCart } from "../../context/CartContext";
import { LoadingState } from "../../components/ui/Spinner";
import { EmptyState } from "../../components/ui/States";
import { Badge } from "../../components/ui/Badge";
import { SearchBar, Pagination } from "../../components/ui/SearchBar";
import { formatCurrency } from "../../utils/formatters";

const CATEGORIES = ["All","Inkjet","Laser","Multifunction","Office","Business","Label","Other"];

function StockBadge({ qty }) {
  if (qty === 0)  return <Badge color="red">Out of Stock</Badge>;
  if (qty < 5)    return <Badge color="yellow">Low Stock</Badge>;
  return <Badge color="green">In Stock</Badge>;
}

function ProductCard({ printer }) {
  const { addItem } = useCart();
  const img = printer.printer_images?.[0];
  return (
    <div className="card overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="aspect-video bg-brand-bg flex items-center justify-center border-b border-brand-border relative">
        {img ? <img src={storageService.getPublicUrl('products', img.storage_path)} alt={printer.name} className="w-full h-full object-contain p-4" />
             : <Printer className="w-16 h-16 text-gray-300" />}
        {printer.category && <span className="absolute top-2 left-2 text-xs bg-brand-dark text-white px-2 py-0.5 rounded font-medium">{printer.category}</span>}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs text-brand-gray font-medium uppercase tracking-wide mb-1">{printer.brand}</p>
        <h3 className="font-semibold text-brand-dark leading-tight mb-2 flex-1">{printer.name}</h3>
        <p className="text-xs text-brand-gray mb-3 line-clamp-2">{printer.description}</p>
        <div className="flex items-center justify-between mb-4">
          <p className="text-lg font-bold text-brand-primary">{formatCurrency(printer.price)}</p>
          <StockBadge qty={printer.stock_quantity} />
        </div>
        <div className="flex gap-2">
          <Link to={"/shop/printers/" + printer.id} className="btn-secondary text-xs flex-1 text-center">View Details</Link>
          <button disabled={printer.stock_quantity === 0}
            onClick={() => { addItem({ id: printer.id, name: printer.name, price: printer.price, type: "printer" }); toast.success("Added to quote list"); }}
            className="btn-primary text-xs flex-1 disabled:opacity-40 disabled:cursor-not-allowed">
            <ShoppingCart className="w-3.5 h-3.5 mr-1" />Add to Quote
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PrintersPage() {
  const [printers, setPrinters] = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [category, setCategory] = useState("");
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);

  useEffect(() => {
    setLoading(true);
    productService.getPrinters({ category: category || undefined, search: search || undefined, page })
      .then(r => { setPrinters(r.data); setTotal(r.total); })
      .catch(() => toast.error("Failed to load printers"))
      .finally(() => setLoading(false));
  }, [category, search, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="text-sm text-brand-gray mb-1"><Link to="/" className="hover:text-brand-primary">Home</Link> / Shop / Printers</p>
        <h1 className="text-2xl font-bold text-brand-dark">Printer Shop</h1>
        <p className="text-brand-gray mt-1">Browse our range of HP, Canon, Brother, Epson and Kyocera printers.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => { setCategory(c === "All" ? "" : c); setPage(1); }}
              className={"px-3 py-1.5 rounded-full text-xs font-medium border transition-colors " +
                ((c === "All" && !category) || c === category
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-white text-brand-gray border-brand-border hover:border-brand-primary hover:text-brand-primary")}>
              {c}
            </button>
          ))}
        </div>
        <div className="sm:ml-auto">
          <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search printers..." className="w-64" />
        </div>
      </div>

      {loading ? <LoadingState message="Loading printers..." /> : printers.length === 0 ? (
        <EmptyState icon={<Printer className="w-12 h-12" />} title="No printers found" description="Try a different category or search term." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {printers.map(p => <ProductCard key={p.id} printer={p} />)}
          </div>
          <Pagination page={page} total={total} pageSize={12} onChange={setPage} />
        </>
      )}

      <div className="mt-12 bg-brand-primary-light rounded-xl p-7 text-center border border-brand-primary/20">
        <h3 className="font-bold text-brand-dark mb-2">Can't find what you're looking for?</h3>
        <p className="text-brand-gray text-sm mb-4">Request a custom quote for any printer or configuration.</p>
        <Link to="/quotes/new" className="btn-primary">Request a Quote</Link>
      </div>
    </div>
  );
}
