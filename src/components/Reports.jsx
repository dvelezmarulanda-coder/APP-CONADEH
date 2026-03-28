import React, { useMemo, useState } from 'react';
import { FileText, Printer, Download, DollarSign, Users, BookOpen, TrendingUp } from 'lucide-react';

// ── SVG Bar Chart ──────────────────────────────────────────────────────────
const BarChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  const W = 500, H = 180, PAD = 40, barW = Math.min(50, (W - PAD * 2) / data.length - 12);

  return (
    <svg viewBox={`0 0 ${W} ${H + 40}`} className="w-full">
      {/* Y gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
        const y = PAD + (1 - ratio) * H;
        return (
          <g key={ratio}>
            <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={PAD - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#94a3b8" fontWeight="bold">
              {ratio === 0 ? '0' : `${((max * ratio) / 1000000).toFixed(1)}M`}
            </text>
          </g>
        );
      })}

      {data.map((d, i) => {
        const slotW = (W - PAD * 2) / data.length;
        const x = PAD + slotW * i + slotW / 2 - barW / 2;
        const barH = (d.value / max) * H;
        const y = PAD + H - barH;
        const colors = ['#1d4ed8', '#059669', '#7c3aed', '#d97706', '#db2777', '#0891b2'];
        const color = colors[i % colors.length];
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barW} height={barH} rx="6" fill={color} opacity="0.85" />
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize="9" fill={color} fontWeight="900">
              ${(d.value / 1000000).toFixed(1)}M
            </text>
            <text x={x + barW / 2} y={PAD + H + 16} textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">
              {d.label.length > 12 ? d.label.slice(0, 12) + '…' : d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ── SVG Donut Chart ────────────────────────────────────────────────────────
const DonutChart = ({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const colors = ['#1d4ed8', '#059669', '#7c3aed', '#d97706', '#db2777', '#0891b2'];
  let cumAngle = -Math.PI / 2;
  const R = 70, r = 42, cx = 90, cy = 90;

  const slices = data.map((d, i) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(cumAngle);
    const y1 = cy + R * Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = cx + R * Math.cos(cumAngle);
    const y2 = cy + R * Math.sin(cumAngle);
    const xi1 = cx + r * Math.cos(cumAngle - angle);
    const yi1 = cy + r * Math.sin(cumAngle - angle);
    const xi2 = cx + r * Math.cos(cumAngle);
    const yi2 = cy + r * Math.sin(cumAngle);
    const large = angle > Math.PI ? 1 : 0;
    return { path: `M${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} L${xi2},${yi2} A${r},${r} 0 ${large},0 ${xi1},${yi1} Z`, color: colors[i % colors.length], label: d.label, value: d.value };
  });

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 180 180" className="w-40 h-40 shrink-0">
        {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} opacity="0.9" />)}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fill="#1e293b" fontWeight="900">{total}</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="bold">alumnos</text>
      </svg>
      <div className="space-y-2 flex-1">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-[10px] font-bold text-slate-600 truncate flex-1">{s.label}</span>
            <span className="text-[10px] font-black text-slate-800">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Export Modal ─────────────────────────────────────────────────────────────
const ExportModal = ({ courses, onClose, onExport }) => {
  const [selectedCourse, setSelectedCourse] = useState('all');

  return (
    <div className="fixed inset-0 bg-blue-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-sm shadow-2xl p-6 sm:p-10 text-center animate-in zoom-in duration-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-700" />
        <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
          <Download size={36} className="text-blue-700" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Exportar Alumnos</h2>
        <p className="text-slate-400 font-bold text-sm mb-8">Selecciona el grupo de estudiantes que deseas descargar.</p>

        <div className="space-y-4 mb-8">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block text-left pl-2">Filtrar por Programa</label>
          <select
            className="w-full p-4 bg-slate-100 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-700 font-bold text-slate-700 text-sm"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="all">TODOS LOS PROGRAMAS</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3.5 bg-slate-100 rounded-2xl font-black text-slate-600 hover:bg-slate-200 transition-all text-sm">Cancelar</button>
          <button
            onClick={() => onExport(selectedCourse)}
            className="flex-1 py-3.5 bg-blue-700 text-white rounded-2xl font-black hover:bg-blue-800 transition-all text-sm shadow-lg shadow-blue-100"
          >
            Descargar CSV
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Reports Tab ────────────────────────────────────────────────────────────
const Reports = ({ transactions, students, courses }) => {
  const [dateFilter, setDateFilter] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);

  const { recaudoHoy, recaudoAyer } = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 864e5).toISOString().split('T')[0];
    let hoy = 0, ayer = 0;
    transactions.forEach(t => {
      if (t.date.startsWith(today)) hoy += t.amount;
      else if (t.date.startsWith(yesterday)) ayer += t.amount;
    });
    return { recaudoHoy: hoy, recaudoAyer: ayer };
  }, [transactions]);

  const filteredTx = useMemo(() => {
    if (!dateFilter) return transactions;
    return transactions.filter(t => t.date.startsWith(dateFilter));
  }, [transactions, dateFilter]);

  const handleExport = (courseId) => {
    let list = students;
    let fileName = "listado-alumnos-CONADEH.csv";

    if (courseId !== 'all') {
      const id = parseInt(courseId);
      list = students.filter(s => s.courseId === id);
      const courseName = courses.find(c => c.id === id)?.name || "curso";
      fileName = `listado-${courseName.toLowerCase().replace(/\s+/g, '-')}.csv`;
    }

    const headers = ["Nombre", "Apellido", "Correo Electrónico"];
    const rows = list.map(s => {
      const nameParts = s.name.trim().split(' ');
      const firstName = nameParts[0] || 'N/A';
      const lastName = nameParts.slice(1).join(' ') || 'N/A';
      return [
        firstName,
        lastName,
        s.email || 'N/A'
      ];
    });

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white p-5 md:p-7 rounded-[2rem] shadow-xl shadow-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><DollarSign size={20} /></div>
            <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest leading-none">Cierre de <br /> Hoy</p>
          </div>
          <h3 className="text-2xl md:text-3xl font-black">$ {recaudoHoy.toLocaleString('es-CO')}</h3>
          <p className="text-blue-300 text-[10px] font-bold mt-1">Recaudo del día</p>
        </div>
        <div className="bg-gradient-to-br from-slate-700 to-slate-900 text-white p-5 md:p-7 rounded-[2rem] shadow-xl shadow-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><CalendarClock size={20} /></div>
            <p className="text-slate-200 text-[10px] font-black uppercase tracking-widest leading-none">Cierre de <br /> Ayer</p>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-100">$ {recaudoAyer.toLocaleString('es-CO')}</h3>
          <p className="text-slate-400 text-[10px] font-bold mt-1">Caja anterior</p>
        </div>
        <div className="bg-white p-5 md:p-7 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center"><Users size={20} className="text-emerald-600" /></div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">Total <br /> Alumnos</p>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-800">{students.length}</h3>
          <p className="text-emerald-500 text-[10px] font-bold mt-1">{students.filter(s => s.status === 'Al día').length} activos</p>
        </div>
        <div className="bg-white p-5 md:p-7 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center"><TrendingUp size={20} className="text-violet-600" /></div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">Total <br /> Recaudado</p>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-800">$ {transactions.reduce((s, t) => s + t.amount, 0).toLocaleString('es-CO')}</h3>
          <p className="text-slate-400 text-[10px] font-bold mt-1">Acumulado histórico</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-5 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="font-black text-sm uppercase text-slate-400 tracking-widest mb-6 flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-600" /> Ingresos por Programa
          </h3>
          {revenueByCourseBars.length > 0
            ? <BarChart data={revenueByCourseBars} />
            : <p className="text-slate-400 text-sm text-center py-10 font-bold">Sin transacciones registradas</p>}
        </div>
        <div className="bg-white p-5 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="font-black text-sm uppercase text-slate-400 tracking-widest mb-6 flex items-center gap-2">
            <Users size={16} className="text-emerald-600" /> Distribución de Alumnos
          </h3>
          <DonutChart data={studentsByCourseDonuts} />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 md:p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="font-black text-lg text-slate-800">Registro de Transacciones</h3>
          <div className="flex items-center gap-3">
            <input
              type="date"
              className="bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 border-none outline-none focus:ring-2 focus:ring-blue-500"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              placeholder="Filtrar por fecha"
            />
            <button onClick={() => window.print()} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-black text-xs uppercase hover:bg-black transition-all">
              <Printer size={15} /> Imprimir
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">ID</th>
                <th className="px-8 py-4">Estudiante</th>
                <th className="px-8 py-4">Programa</th>
                <th className="px-8 py-4">Método</th>
                <th className="px-8 py-4">Fecha</th>
                <th className="px-8 py-4 text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTx.map(tx => (
                <tr key={tx.id} className="hover:bg-blue-50/20 transition-colors">
                  <td className="px-8 py-4 font-mono text-[10px] font-black text-blue-700">{tx.id}</td>
                  <td className="px-8 py-4 font-bold text-sm text-slate-700">{tx.student}</td>
                  <td className="px-8 py-4 text-xs text-slate-500 font-bold">{tx.course}</td>
                  <td className="px-8 py-4">
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black uppercase text-slate-600">{tx.method}</span>
                  </td>
                  <td className="px-8 py-4 text-[10px] text-slate-400 font-bold">
                    {tx.date.includes('T') ? new Date(tx.date).toLocaleString() : tx.date}
                  </td>
                  <td className="px-8 py-4 text-right font-black text-emerald-600">+$ {tx.amount.toLocaleString('es-CO')}</td>
                </tr>
              ))}
              {filteredTx.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400 font-bold text-sm">No hay transacciones para esta fecha.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button onClick={() => window.print()} className="bg-slate-900 text-white p-5 md:p-7 rounded-[2.5rem] flex items-center gap-4 hover:bg-black transition-all shadow-xl">
          <Printer size={28} /> <span className="font-black text-sm uppercase tracking-widest">Imprimir Reporte Financiero</span>
        </button>
        <button
          onClick={() => setShowExportModal(true)}
          className="bg-blue-700 text-white p-5 md:p-7 rounded-[2.5rem] flex items-center gap-4 hover:bg-blue-800 transition-all shadow-xl shadow-blue-100"
        >
          <Download size={28} /> <span className="font-black text-sm uppercase tracking-widest">Exportar Listado Alumnos</span>
        </button>
      </div>

      {showExportModal && (
        <ExportModal
          courses={courses}
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
        />
      )}
    </div>
  );
};

export default Reports;
