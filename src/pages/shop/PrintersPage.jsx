import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Printer, ShoppingCart } from "lucide-react";
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
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-colors flex flex-col">
      <div className="aspect-video bg-white/5 flex items-center justify-center border-b border-white/10 relative">
        {img ? <img src={storageService.getPublicUrl('products', img.storage_path)} alt={printer.name} className="w-full h-full object-contain p-4" />
             : <Printer className="w-16 h-16 text-gray-500" />}
        {printer.category && <span className="absolute top-2 left-2 text-[10px] bg-[#F07878] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">{printer.category}</span>}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{printer.brand}</p>
        <h3 className="font-medium text-gray-100 leading-tight mb-2 flex-1">{printer.name}</h3>
        <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed">{printer.description}</p>
        <div className="flex items-center justify-between mb-5">
          <p className="text-lg font-semibold text-white">{formatCurrency(printer.price)}</p>
          <StockBadge qty={printer.stock_quantity} />
        </div>
        <div className="flex gap-2">
          <Link to={"/shop/printers/" + printer.id} className="text-center text-xs py-2 px-3 border border-white/20 rounded text-gray-300 hover:bg-white/10 transition-colors flex-1 font-medium">Details</Link>
          <button disabled={printer.stock_quantity === 0}
            onClick={() => { addItem({ id: printer.id, name: printer.name, price: printer.price, type: "printer" }); toast.success("Added to quote list"); }}
            className="flex-1 bg-[#F07878] hover:bg-[#d86a6a] text-white text-xs font-medium py-2 px-3 rounded flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            <ShoppingCart className="w-3.5 h-3.5 mr-1" />Add
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
    async function load() {
      setLoading(true);
      try {
        const { data, count } = await productService.getPrinters({
          category: category === "All" ? "" : category,
          search,
          page,
          limit: 12
        });
        setPrinters(data);
        setTotal(count);
      } catch (err) {
        toast.error("Failed to load printers");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category, search, page]);

  return (
    <div className="flex-1 w-full flex flex-col pt-8 pb-12 z-20 overflow-y-auto pr-4 scrollbar-hide">
      
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-3xl font-light tracking-wide text-gray-100 mb-2">Printers</h1>
          <p className="text-gray-400 text-sm font-light">Explore our range of professional and home office printers.</p>
        </div>
        <div className="w-full sm:w-64">
          <SearchBar onSearch={s => { setSearch(s); setPage(1); }} placeholder="Search printers..." />
        </div>
      </div>

      <div className="mb-8 flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => { setCategory(c === "All" ? "" : c); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
              (category === c || (!category && c === "All"))
                ? "bg-[#F07878] text-white border-[#F07878]" 
                : "bg-transparent text-gray-400 border-white/20 hover:border-[#F07878] hover:text-[#F07878]"
            }`}>
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState message="Loading printers..." />
      ) : printers.length === 0 ? (
        <EmptyState title="No printers found" message="Try adjusting your search or category filter." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            {printers.map(p => <ProductCard key={p.id} printer={p} />)}
          </div>
          <Pagination page={page} total={total} limit={12} onChange={setPage} />
        </>
      )}
    </div>
  );
}
