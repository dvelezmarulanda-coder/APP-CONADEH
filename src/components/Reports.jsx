import React, { useMemo, useState } from 'react';
import { FileText, Printer, Download, DollarSign, Users, BookOpen, TrendingUp, CalendarClock, X, BookOpen as BookOpenIcon, AlertTriangle, Phone, ArrowUpRight } from 'lucide-react';

const COURSE_COLORS = [
  'bg-primary',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-cyan-500',
  'bg-rose-500',
];

const ExportModal = ({ courses, onClose, onExport }) => {
  const [selectedCourse, setSelectedCourse] = useState('all');
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-bg-card rounded-[3rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in duration-200 border border-transparent dark:border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-slate-800 dark:text-text-main tracking-tighter uppercase">Exportar Listado</h3>
          <button onClick={onClose} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400"><X size={20} /></button>
        </div>
        <p className="text-slate-400 text-sm font-bold mb-6">Selecciona el programa académico que deseas exportar a formato CSV.</p>
        <select 
          className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary font-bold text-slate-700 dark:text-text-main mb-8 uppercase tracking-widest text-xs"
          value={selectedCourse} 
          onChange={e => setSelectedCourse(e.target.value)}
        >
          <option value="all">Todos los Programas</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button 
          onClick={() => onExport(selectedCourse)}
          className="w-full bg-primary text-white py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-xl shadow-primary/20"
        >
          Descargar CSV
        </button>
      </div>
    </div>
  );
};

const Reports = ({ transactions, students, courses, onCloseDay }) => {
  const [dateFilter, setDateFilter] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const reportDate = dateFilter || new Date().toISOString().split('T')[0];

  const { recaudoHoy, recaudoCerradoHoy } = useMemo(() => {
    let hoy = 0;
    let cerrado = 0;
    const todayStr = new Date().toISOString().split('T')[0];
    transactions.forEach(t => {
      if (t.date.startsWith(todayStr)) {
        if (t.isClosed) cerrado += t.amount;
        else hoy += t.amount;
      }
    });
    return { recaudoHoy: hoy, recaudoCerradoHoy: cerrado };
  }, [transactions]);

  const filteredTx = useMemo(() => {
    if (!dateFilter) return transactions;
    return transactions.filter(t => t.date.startsWith(dateFilter));
  }, [transactions, dateFilter]);

  const revenueByCourseBars = useMemo(() => {
    const map = {};
    transactions.filter(t => t.amount > 0).forEach(t => {
      map[t.course] = (map[t.course] || 0) + t.amount;
    });
    return Object.entries(map).map(([label, value]) => ({ label, value }));
  }, [transactions]);

  const atRiskStudents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return students
      .map(s => {
        const due = new Date(s.dueDate);
        due.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        const course = courses.find(c => c.id === s.courseId);
        return { ...s, courseName: course?.name || 'N/A', diffDays };
      })
      .filter(s => s.diffDays <= 7)
      .sort((a, b) => a.diffDays - b.diffDays);
  }, [students, courses]);

  const studentsByCourseDonuts = useMemo(() => {
    const map = {};
    students.forEach(s => {
      const course = courses.find(c => c.id === s.courseId);
      const label = course ? course.name : 'Otros';
      map[label] = (map[label] || 0) + 1;
    });
    return Object.entries(map).map(([label, value]) => ({ label, value }));
  }, [students, courses]);

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
    <div id="financial-report" className="space-y-8 animate-in fade-in duration-300">
      {/* Printable-only Header */}
      <div className="hidden print:block border-b-4 border-blue-800 pb-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-blue-800 tracking-tighter uppercase">CONADEH</h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Reporte Financiero Institucional</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase">Fecha de Emisión</p>
            <p className="text-sm font-black text-slate-800">{new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-primary to-primary-dark border border-primary/20 text-white p-5 md:p-7 rounded-[2.5rem] shadow-xl dark:shadow-none transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><DollarSign size={20} className="text-white" /></div>
            <p className="text-white/80 text-[10px] font-black uppercase tracking-widest leading-none">Recaudo <br /> Hoy</p>
          </div>
          <h3 className="text-2xl md:text-3xl font-black">$ {recaudoHoy.toLocaleString('es-CO')}</h3>
          <p className="text-white/60 text-[10px] font-bold mt-1 uppercase italic tracking-widest">En Caja Abierta</p>
        </div>
        <div className="bg-gradient-to-br from-slate-700 to-bg-main dark:from-bg-card/40 dark:to-bg-main/40 dark:border dark:border-slate-700/50 text-white p-5 md:p-7 rounded-[2.5rem] shadow-xl dark:shadow-none transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 dark:bg-slate-700/50 rounded-xl flex items-center justify-center"><CalendarClock size={20} className="dark:text-slate-400" /></div>
            <p className="text-slate-200 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">Cierre de <br /> Caja</p>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-100 dark:text-slate-300">$ {recaudoCerradoHoy.toLocaleString('es-CO')}</h3>
          <p className="text-slate-400 dark:text-slate-500/70 text-[10px] font-bold mt-1 uppercase italic tracking-widest">Histórico Hoy</p>
        </div>
        <div className="bg-white dark:bg-bg-card p-5 md:p-7 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-500">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center"><Users size={20} className="text-emerald-600" /></div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total <br /> Alumnos</p>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-text-main">{students.length}</h3>
          <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-1 uppercase">
            <TrendingUp size={10} /> CRECIENDO
          </div>
        </div>
        <div className="bg-white dark:bg-bg-card p-5 md:p-7 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-500">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/10 rounded-xl flex items-center justify-center"><BookOpen size={20} className="text-amber-600" /></div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Programas <br /> Activos</p>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-text-main">{courses.length}</h3>
          <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-widest">Vigentes 2024</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* 🚨 Alertas de Cobro */}
        <div className="lg:col-span-2 bg-white dark:bg-bg-card p-8 md:p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-500">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-black text-xl text-slate-800 dark:text-text-main uppercase tracking-tighter">Alertas de Cobro</h3>
              <p className="text-slate-400 text-xs font-bold mt-1">Alumnos vencidos o próximos a vencer (≤7 días)</p>
            </div>
            <div className={`p-2 rounded-xl ${atRiskStudents.length > 0 ? 'bg-red-50 dark:bg-red-500/10' : 'bg-slate-50 dark:bg-slate-800'}`}>
              <AlertTriangle size={20} className={atRiskStudents.length > 0 ? 'text-red-500' : 'text-slate-400'} />
            </div>
          </div>

          {atRiskStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-300 dark:text-slate-700">
              <Users size={48} strokeWidth={1} />
              <p className="mt-3 font-bold text-sm">¡Todo al día! Sin alertas pendientes.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {atRiskStudents.map(s => {
                const isOverdue = s.diffDays < 0;
                const isToday = s.diffDays === 0;
                const label = isOverdue
                  ? `Vencido hace ${Math.abs(s.diffDays)} día${Math.abs(s.diffDays) !== 1 ? 's' : ''}`
                  : isToday ? 'Vence hoy'
                  : `Vence en ${s.diffDays} día${s.diffDays !== 1 ? 's' : ''}`;
                const badgeCls = isOverdue
                  ? 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400'
                  : isToday ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400'
                  : 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400'
                const dotCls = isOverdue ? 'bg-red-500' : isToday ? 'bg-orange-500' : 'bg-amber-400';
                return (
                  <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-500/30 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-2.5 h-2.5 rounded-full ${dotCls} shrink-0`} />
                      <div>
                        <p className="font-black text-sm text-slate-700 dark:text-text-main uppercase tracking-tight leading-none">{s.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 truncate max-w-[180px]">{s.courseName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${badgeCls}`}>{label}</span>
                      {s.phone && (
                        <a href={`https://wa.me/${s.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 hover:bg-emerald-200 transition-colors">
                          <Phone size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {atRiskStudents.length > 0 && (
            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                {atRiskStudents.filter(s => s.diffDays < 0).length} vencidos · {atRiskStudents.filter(s => s.diffDays >= 0).length} próximos
              </span>
              <span className="font-black text-sm text-red-500">{atRiskStudents.length} alertas activas</span>
            </div>
          )}
        </div>

        {/* 📚 Recaudación por Programa */}
        <div className="bg-white dark:bg-bg-card p-8 md:p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-500">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-black text-xl text-slate-800 dark:text-text-main uppercase tracking-tighter">Por Programa</h3>
              <p className="text-slate-400 text-xs font-bold mt-1">Ingresos por curso</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-xl">
              <BookOpen size={20} className="text-amber-500" />
            </div>
          </div>

          {revenueByCourseBars.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-300 dark:text-slate-700">
              <BookOpen size={40} strokeWidth={1} />
              <p className="mt-3 font-bold text-sm">Sin datos</p>
            </div>
          ) : (
            <div className="space-y-4">
              {revenueByCourseBars.map(({ label, value }, i) => {
                const maxVal = Math.max(...revenueByCourseBars.map(d => d.value), 1);
                const pct = Math.round((value / maxVal) * 100);
                return (
                  <div key={label} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-black text-slate-600 dark:text-slate-400 truncate max-w-[120px]" title={label}>{label}</span>
                      <span className="font-black text-xs text-slate-800 dark:text-text-main">$ {value.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${COURSE_COLORS[i % COURSE_COLORS.length]} rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alumnos por programa</p>
                <div className="space-y-2 mt-3">
                  {studentsByCourseDonuts.map((d, i) => (
                    <div key={d.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${COURSE_COLORS[i % COURSE_COLORS.length]}`} />
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[110px]">{d.label}</span>
                      </div>
                      <span className="font-black text-sm text-slate-700 dark:text-text-main">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-bg-card rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-500">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <h2 className="font-black text-xl text-slate-800 dark:text-text-main uppercase tracking-tighter">Historial de Transacciones</h2>
            <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase">{filteredTx.length} REGISTROS</div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="date"
              className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-3 text-xs font-bold text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary w-full md:w-auto transition-all"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
            />
            {(!dateFilter || dateFilter === new Date().toISOString().split('T')[0]) && (
              <button 
                onClick={() => setShowCloseModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all shrink-0"
              >
                <CalendarClock size={16} /> Cerrar Día
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Tipo</th>
                <th className="px-8 py-5">Estudiante</th>
                <th className="px-8 py-5">Programa</th>
                <th className="px-8 py-5">Método</th>
                <th className="px-8 py-5">Fecha / Hora</th>
                <th className="px-8 py-5 text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredTx.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-8 py-4">
                    <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase ${
                      tx.type === 'Matrícula' || tx.type === 'Inscripción' ? 'bg-emerald-100 text-emerald-700' : 
                      tx.type === 'Mensualidad' ? 'bg-violet-100 text-violet-700' : 
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="font-black text-slate-700 dark:text-text-main text-sm uppercase tracking-tighter">{tx.student}</div>
                  </td>
                  <td className="px-8 py-4 text-xs text-slate-500 dark:text-slate-400 font-bold">{tx.course}</td>
                  <td className="px-8 py-4">
                    <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-[9px] font-black uppercase text-slate-600 dark:text-slate-400">{tx.method}</span>
                  </td>
                  <td className="px-8 py-4 text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                    {tx.date.includes('T') ? new Date(tx.date).toLocaleString() : tx.date}
                  </td>
                  <td className="px-8 py-4 text-right font-black text-primary dark:text-primary-light">+$ {tx.amount.toLocaleString('es-CO')}</td>
                </tr>
              ))}
              {filteredTx.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400 dark:text-slate-500 font-bold text-sm italic">No hay transacciones para esta fecha.</td></tr>
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
          className="bg-primary text-white p-5 md:p-7 rounded-[2.5rem] flex items-center gap-4 hover:bg-primary-dark transition-all shadow-xl dark:shadow-none"
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

      {showCloseModal && (
        <CloseDayModal
          transactions={transactions}
          date={reportDate || new Date().toISOString().split('T')[0]}
          onClose={() => setShowCloseModal(false)}
          onConfirm={onCloseDay}
        />
      )}
    </div>
  );
};

// 💰 Close Day Modal 💰
const CloseDayModal = ({ transactions, date, onClose, onConfirm }) => {
  const [isFinalized, setIsFinalized] = useState(false);
  const dayTx = useMemo(() => transactions.filter(t => t.date.startsWith(date) && (isFinalized ? true : !t.isClosed)), [transactions, date, isFinalized]);
  const total = useMemo(() => dayTx.reduce((s, t) => s + t.amount, 0), [dayTx]);
  const byMethod = useMemo(() => {
    const map = {};
    dayTx.forEach(t => { map[t.method] = (map[t.method] || 0) + t.amount; });
    return Object.entries(map);
  }, [dayTx]);

  const handleFinalize = () => {
    if (window.confirm("¿Seguro que deseas cerrar la caja? Esto reiniciará el contador de hoy.")) {
      onConfirm(date);
      setIsFinalized(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-bg-main/80 backdrop-blur-xl z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-bg-card rounded-[3.5rem] w-full max-w-2xl shadow-2xl p-8 lg:p-12 animate-in zoom-in duration-300 relative overflow-hidden border border-transparent dark:border-slate-800">
        {isFinalized && (
          <div className="absolute inset-0 bg-primary/95 flex flex-col items-center justify-center z-50 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 bounce-in">
              <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-white text-3xl font-black uppercase tracking-tighter">¡Cierre Exitoso!</h3>
            <p className="text-white/80 font-bold mt-2">Caja reiniciada a cero.</p>
          </div>
        )}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-emerald-600 to-emerald-800" />
        
        <div id="printable-report" className="space-y-8">
          <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-8">
            <div>
              <h2 className="text-4xl font-black text-slate-800 dark:text-text-main tracking-tighter uppercase">Cierre de Caja</h2>
              <p className="text-primary font-bold text-sm tracking-widest mt-1 uppercase">Fecha: {date}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Recaudado</p>
              <p className="text-4xl font-black text-primary dark:text-primary-light tracking-tighter">$ {total.toLocaleString('es-CO')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-black text-[10px] uppercase text-slate-400 dark:text-slate-500 tracking-widest border-l-4 border-primary pl-3">Desglose por Método</h3>
              <div className="space-y-2">
                {byMethod.map(([method, amount]) => (
                  <div key={method} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <span className="font-bold text-slate-600 dark:text-slate-300 text-sm">{method}</span>
                    <span className="font-black text-slate-800 dark:text-text-main">$ {amount.toLocaleString('es-CO')}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-black text-[10px] uppercase text-slate-400 tracking-widest border-l-4 border-accent pl-3">Resumen de Operaciones</h3>
              <div className="p-6 bg-slate-900 dark:bg-bg-main rounded-[2.5rem] text-white border border-primary/20">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Transacciones</p>
                <p className="text-5xl font-black mb-1">{dayTx.length}</p>
                <p className="text-xs text-accent font-bold uppercase tracking-widest">Ventas registradas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-10 no-print">
          <button onClick={onClose} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            Cerrar
          </button>
          <button 
            onClick={() => window.print()}
            className="flex-1 py-4 bg-slate-900 dark:bg-black text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl"
          >
            <Printer size={18} /> Planilla
          </button>
          <button 
            onClick={handleFinalize}
            className="flex-1 py-4 bg-primary text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-primary-dark transition-all shadow-xl dark:shadow-none"
          >
            Finalizar Cierre
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
