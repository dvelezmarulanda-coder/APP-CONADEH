import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard, Users, BookOpen, CalendarClock,
  TrendingUp, PlusCircle, ChevronRight, DollarSign,
  Printer, X, Search, FileText, AlertCircle, ShieldCheck, Phone
} from 'lucide-react';

import Courses from './components/Courses';
import Students from './components/Students';
import Reports from './components/Reports';

// ── Constants ───────────────────────────────────────────────────────────────
const APP_NAME = "CONADEH";

const INITIAL_COURSES = [
  { id: 1, name: 'Derechos Humanos Básicos', students: 45, color: 'bg-blue-700', price: 1500000, teacher: 'Dr. Roberto Sosa', startDate: '2024-01-15', endDate: '2024-06-15', spots: 50, location: 'Sede Central' },
  { id: 2, name: 'Gestión Pública y Ciudadanía', students: 30, color: 'bg-blue-600', price: 1200000, teacher: 'Lic. Elena Soler', startDate: '2024-02-01', endDate: '2024-05-01', spots: 40, location: 'Sede Regional' },
  { id: 3, name: 'Mediación de Conflictos', students: 25, color: 'bg-blue-900', price: 1350000, teacher: 'Abg. Marcos Ruiz', startDate: '2024-01-20', endDate: '2024-07-20', spots: 30, location: 'Virtual' },
];

const INITIAL_STUDENTS = [
  { id: 101, name: 'Carlos Mendoza', email: 'carlos@mail.com', phone: '310 123 4567', courseId: 1, status: 'Al día', dueDate: '2024-04-20', registrationDate: '2024-03-01 10:30' },
  { id: 102, name: 'Ana Beltrán', email: 'ana@mail.com', phone: '315 987 6543', courseId: 2, status: 'Vencido', dueDate: '2024-03-10', registrationDate: '2024-02-15 09:15' },
  { id: 103, name: 'Luis Ortega', email: 'luis@mail.com', phone: '300 555 1234', courseId: 1, status: 'Por vencer', dueDate: '2024-03-28', registrationDate: '2024-03-05 14:20' },
  { id: 104, name: 'Sofía Vega', email: 'sofia@mail.com', phone: '320 444 8888', courseId: 3, status: 'Vencido', dueDate: '2024-03-05', registrationDate: '2024-03-02 16:45' },
];

const INITIAL_TRANSACTIONS = [
  { id: 'CON-10023', date: new Date().toLocaleString(), student: 'Marta Ríos', course: 'Derechos Humanos Básicos', method: 'Efectivo', amount: 500000 },
  { id: 'CON-10024', date: new Date().toLocaleString(), student: 'Jorge Pinto', course: 'Gestión Pública y Ciudadanía', method: 'Transferencia', amount: 750000 },
];

// ── BrandLogo ────────────────────────────────────────────────────────────────
const BrandLogo = ({ className, onError, hasError }) => {
  if (hasError) return <ShieldCheck className={`${className} text-blue-700`} />;
  return <img src="image_6f15a4.png" alt="CONADEH" className={`${className} object-contain`} onError={onError} />;
};

// ── Registration Modal ───────────────────────────────────────────────────────
const RegistrationModal = ({ courses, onClose, onSuccess }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', courseId: '', method: 'Efectivo', amount: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const courseIdInt = parseInt(form.courseId);
    const selectedCourse = courses.find(c => c.id === courseIdInt);
    if (!selectedCourse) return;
    const now = new Date();
    const formattedRegDate = `${now.toISOString().split('T')[0]} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    const amountNum = parseFloat(form.amount) || 0;
    const newStudent = {
      id: Date.now(), name: form.name, email: form.email, phone: form.phone,
      courseId: selectedCourse.id, status: 'Al día',
      dueDate: new Date(Date.now() + 30 * 864e5).toISOString().split('T')[0],
      registrationDate: formattedRegDate
    };
    const newTx = {
      id: `CON-${Math.floor(Math.random() * 90000) + 10000}`,
      date: now.toLocaleString(), student: form.name, course: selectedCourse.name,
      method: form.method, amount: amountNum, balance: selectedCourse.price - amountNum
    };
    onSuccess(newStudent, newTx, selectedCourse.id);
  };

  return (
    <div className="fixed inset-0 bg-blue-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl p-10 animate-in zoom-in duration-200 relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-700 rounded-t-[3rem]" />
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Nueva Matrícula</h2>
          <button onClick={onClose} className="bg-slate-50 p-2 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 block mb-1">Nombre Completo</label>
            <input required type="text" className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-700 font-bold"
              placeholder="Nombre completo" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 block mb-1">Email</label>
              <input type="email" className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-700 font-bold text-sm"
                placeholder="correo@mail.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 block mb-1">Teléfono</label>
              <input required type="tel" className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-700 font-bold text-sm"
                placeholder="310 000 0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 block mb-1">Programa</label>
              <select required className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-700 font-bold text-xs"
                value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })}>
                <option value="">Elegir Programa</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 block mb-1">Método Pago</label>
              <select className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-700 font-bold text-xs"
                value={form.method} onChange={e => setForm({ ...form, method: e.target.value })}>
                <option>Efectivo</option>
                <option>Transferencia</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest pl-2 block mb-1">Abono Inicial (COP)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-700 font-black text-xl">$</span>
              <input required type="number" className="w-full p-4 pl-10 bg-blue-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-700 font-mono text-2xl text-blue-800 font-black"
                placeholder="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
            </div>
            <p className="text-[9px] text-slate-400 font-bold italic mt-2 text-center">La fecha de ingreso se guardará automáticamente al confirmar.</p>
          </div>
          <button type="submit" className="w-full bg-blue-800 text-white py-5 rounded-[2.5rem] font-black text-lg hover:bg-blue-900 transition-all shadow-xl shadow-blue-100 uppercase tracking-widest">
            Confirmar Registro
          </button>
        </form>
      </div>
    </div>
  );
};

// ── Ticket Modal ─────────────────────────────────────────────────────────────
const TicketModal = ({ tx, onClose, logoError, onLogoError }) => (
  <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-[3rem] w-full max-w-sm shadow-2xl p-10 text-center animate-in slide-in-from-bottom duration-300">
      <div id="printable-ticket" className="p-8 border-2 border-slate-50 rounded-[2.5rem] mb-8 bg-slate-50/50">
        <BrandLogo className="w-20 h-20 mx-auto mb-4" hasError={logoError} onError={onLogoError} />
        <h3 className="font-black text-2xl tracking-tighter text-blue-800 uppercase">{APP_NAME}</h3>
        <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] mb-6">Recibo Oficial de Pago</p>
        <div className="space-y-3 text-left text-xs mb-8">
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="text-slate-400 font-bold uppercase text-[9px]">ID Transacción</span>
            <span className="font-mono font-black text-blue-800">{tx.id}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="text-slate-400 font-bold uppercase text-[9px]">Fecha</span>
            <span className="font-bold">{tx.date}</span>
          </div>
          <div className="py-4">
            <p className="text-[9px] font-black uppercase text-blue-600 mb-1">Matriculado</p>
            <p className="font-black text-xl text-slate-800 leading-none">{tx.student}</p>
          </div>
          <div className="bg-blue-800 p-5 rounded-3xl flex justify-between items-center shadow-lg shadow-blue-100">
            <span className="font-black text-blue-200 text-[10px] uppercase">Abonado</span>
            <span className="text-2xl font-black text-white">$ {tx.amount.toLocaleString('es-CO')}</span>
          </div>
        </div>
        <p className="text-[8px] text-slate-300 font-black uppercase tracking-widest">Documento digital válido para trámites internos</p>
      </div>
      <div className="space-y-3 no-print">
        <button onClick={() => window.print()} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-all text-xs uppercase tracking-widest">
          <Printer size={18} /> Imprimir
        </button>
        <button onClick={onClose} className="w-full py-2 text-slate-400 font-black hover:text-slate-600 text-[10px] uppercase tracking-widest">Finalizar</button>
      </div>
    </div>
  </div>
);

// ── Payment Panel ────────────────────────────────────────────────────────────
const Payments = ({ students, setStudents, courses, setTransactions, setLastTx, setShowTicket }) => {
  const [search, setSearch] = useState('');
  const overdue = useMemo(() => students.filter(s => s.status !== 'Al día'), [students]);
  const filtered = useMemo(() => overdue.filter(s => s.name.toLowerCase().includes(search.toLowerCase())), [overdue, search]);

  const handleRenew = (studentId) => {
    const student = students.find(s => s.id === studentId);
    const course = courses.find(c => c.id === student.courseId);
    const amount = (course?.price || 1000000) / 4;
    setStudents(prev => prev.map(s => s.id === studentId
      ? { ...s, status: 'Al día', dueDate: new Date(Date.now() + 30 * 864e5).toISOString().split('T')[0], isRenewed: true }
      : s));
    const tx = { id: `REN-${Math.floor(Math.random() * 90000) + 10000}`, date: new Date().toLocaleString(), student: student.name, course: course?.name || 'Curso General', method: 'Efectivo/Sistema', amount, balance: 0 };
    setTransactions(prev => [tx, ...prev]);
    setLastTx(tx);
    setShowTicket(true);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-300">
      <div className="bg-blue-900 text-white p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-100">
        <div className="flex items-center gap-6">
          <AlertCircle size={40} className="text-blue-300 shrink-0" />
          <div>
            <h4 className="font-black text-xl uppercase">Cobros Pendientes</h4>
            <p className="opacity-70 text-sm font-medium">Hay {overdue.length} renovaciones pendientes.</p>
          </div>
        </div>
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" size={18} />
          <input type="text" placeholder="Buscar estudiante..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-blue-800/50 border border-blue-700 rounded-2xl text-white placeholder-blue-300/70 outline-none focus:ring-2 focus:ring-blue-400 font-bold text-sm" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 && (
          <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 text-center">
            <p className="text-slate-400 font-bold">No se encontraron estudiantes pendientes.</p>
          </div>
        )}
        {filtered.map(s => (
          <div key={s.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row justify-between items-center group hover:border-blue-200 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-blue-700 text-2xl border border-slate-100 group-hover:bg-blue-700 group-hover:text-white transition-all">
                {s.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-black text-xl text-slate-800">{s.name}</h4>
                <p className="text-xs text-slate-400 font-bold uppercase">{courses.find(c => c.id === s.courseId)?.name}</p>
                {s.phone && <p className="text-[10px] text-blue-600 font-black mt-1 flex items-center gap-1"><Phone size={10} /> {s.phone}</p>}
              </div>
            </div>
            <div className="flex items-center gap-8 mt-4 md:mt-0">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Vencimiento</p>
                <p className="font-mono text-red-600 font-black text-lg">{s.dueDate}</p>
              </div>
              <button onClick={() => handleRenew(s.id)}
                className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-100">
                Procesar Pago
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = ({ courses, students, transactions, setActiveTab, setShowRevenue }) => {
  const totalRevenue = useMemo(() => transactions.reduce((s, t) => s + t.amount, 0), [transactions]);
  const overdue = useMemo(() => students.filter(s => s.status !== 'Al día').length, [students]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div onClick={() => setShowRevenue(true)}
          className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Recaudo Total</p>
              <h3 className="text-4xl font-black text-blue-700 mt-1">$ {totalRevenue.toLocaleString('es-CO')}</h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ChevronRight size={16} />
            </div>
          </div>
          <div className="text-[10px] font-bold text-blue-600 mt-4 flex items-center gap-1">Ver desglose <ChevronRight size={12} /></div>
        </div>
        <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Estudiantes Activos</p>
          <h3 className="text-4xl font-black text-slate-800 mt-1">{students.length}</h3>
        </div>
        <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Alertas de Pago</p>
          <h3 className="text-4xl font-black text-red-500 mt-1">{overdue}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="font-black text-lg mb-8 text-slate-700 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={20} /> OCUPACIÓN POR PROGRAMA
          </h3>
          <div className="space-y-6">
            {courses.map(c => {
              const enrolled = students.filter(s => s.courseId === c.id).length;
              return (
                <div key={c.id}>
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2">
                    <span>{c.name}</span>
                    <span className="text-blue-700">{enrolled} Inscritos</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${c.color}`} style={{ width: `${Math.min((enrolled / c.spots) * 100, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-blue-800 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-200 flex flex-col justify-center">
          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-4 leading-tight">Módulo de Reportes<br />Institucionales</h3>
            <p className="opacity-70 text-sm mb-8 max-w-xs font-medium italic">Acceso restringido para personal administrativo del CONADEH.</p>
            <button onClick={() => setActiveTab('reports')} className="bg-white text-blue-800 px-8 py-3.5 rounded-2xl font-black text-sm hover:scale-105 transition-all">
              Ir a Reportes
            </button>
          </div>
          <FileText className="absolute -bottom-10 -right-10 w-64 h-64 opacity-5 rotate-12" />
        </div>
      </div>
    </div>
  );
};

// ── Revenue Modal ────────────────────────────────────────────────────────────
const RevenueModal = ({ transactions, onClose }) => {
  const totalRevenue = useMemo(() => transactions.reduce((s, t) => s + t.amount, 0), [transactions]);
  const byCoure = useMemo(() => {
    const map = {};
    transactions.forEach(t => { map[t.course] = (map[t.course] || 0) + t.amount; });
    return Object.entries(map).map(([name, total]) => ({ name, total })).sort((a,b) => b.total - a.total);
  }, [transactions]);

  return (
    <div className="fixed inset-0 bg-blue-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl p-10 animate-in zoom-in duration-200 relative max-h-[90vh] flex flex-col">
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500 rounded-t-[3rem]" />
        <div className="flex justify-between items-center mb-8 shrink-0">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Detalle de Ingresos</h2>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">Total: <span className="text-blue-700">$ {totalRevenue.toLocaleString('es-CO')}</span></p>
          </div>
          <button onClick={onClose} className="bg-slate-50 p-3 rounded-2xl text-slate-400 hover:bg-slate-100 transition-colors"><X /></button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-y-auto pr-2 pb-4">
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-black text-sm uppercase text-slate-400 tracking-widest border-b border-slate-100 pb-2">Por Programa</h3>
            {byCoure.map((item, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-600 mb-1 leading-tight">{item.name}</p>
                <p className="text-xl font-black text-blue-800">$ {item.total.toLocaleString('es-CO')}</p>
              </div>
            ))}
          </div>
          <div className="lg:col-span-2">
            <h3 className="font-black text-sm uppercase text-slate-400 tracking-widest border-b border-slate-100 pb-2 mb-4">Transacciones</h3>
            <div className="space-y-3">
              {transactions.map(tx => (
                <div key={tx.id} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><DollarSign size={18} /></div>
                    <div>
                      <p className="font-black text-sm text-slate-800">{tx.student}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{tx.course}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-lg text-emerald-600">+$ {tx.amount.toLocaleString('es-CO')}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">{tx.method} • {tx.date.split(',')[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── App ──────────────────────────────────────────────────────────────────────
const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [showRevenue, setShowRevenue] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [lastTx, setLastTx] = useState(null);
  const [logoError, setLogoError] = useState(false);

  const totalOverdue = useMemo(() => students.filter(s => s.status !== 'Al día').length, [students]);

  const handleRegistrationSuccess = (newStudent, newTx, courseId) => {
    setStudents(prev => [newStudent, ...prev]);
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, students: c.students + 1 } : c));
    setTransactions(prev => [newTx, ...prev]);
    setLastTx(newTx);
    setShowRegistration(false);
    setShowTicket(true);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { id: 'courses', label: 'Programas', Icon: BookOpen },
    { id: 'students', label: 'Estudiantes', Icon: Users },
    { id: 'payments', label: 'Pagos', Icon: CalendarClock, count: totalOverdue },
    { id: 'reports', label: 'Reportes', Icon: FileText },
  ];

  const PAGE_TITLES = {
    dashboard: 'Panel de Control',
    courses: 'Gestión Académica',
    students: 'Directorio de Alumnos',
    payments: 'Control de Ingresos',
    reports: 'Inteligencia Institucional',
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed h-full z-30">
        <div className="p-8 border-b border-slate-50 flex flex-col items-center">
          <BrandLogo className="w-20 h-20 mb-3" hasError={logoError} onError={() => setLogoError(true)} />
          <span className="text-3xl font-black tracking-tighter text-blue-800">{APP_NAME}</span>
        </div>
        <nav className="flex-1 p-4 space-y-1 mt-4">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${activeTab === item.id ? 'bg-blue-700 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}>
              <div className="flex items-center space-x-3">
                <item.Icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                <span className="font-bold text-sm">{item.label}</span>
              </div>
              {item.count > 0 && (
                <span className={`${activeTab === item.id ? 'bg-white text-blue-700' : 'bg-red-500 text-white'} text-[10px] font-black px-2 py-1 rounded-full`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">AD</div>
            <div>
              <p className="text-xs font-black text-slate-700">Administrador</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Sistema Educativo</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:ml-64 overflow-y-auto min-h-screen">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">{PAGE_TITLES[activeTab]}</h1>
          <button onClick={() => setShowRegistration(true)}
            className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-xl shadow-blue-100 font-bold text-sm">
            <PlusCircle size={18} />
            <span>Nueva Matrícula</span>
          </button>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard courses={courses} students={students} transactions={transactions}
              setActiveTab={setActiveTab} setShowRevenue={setShowRevenue} />
          )}
          {activeTab === 'courses' && (
            <Courses courses={courses} setCourses={setCourses} students={students} />
          )}
          {activeTab === 'students' && (
            <Students students={students} setStudents={setStudents} courses={courses} />
          )}
          {activeTab === 'payments' && (
            <Payments students={students} setStudents={setStudents} courses={courses}
              setTransactions={setTransactions} setLastTx={setLastTx} setShowTicket={setShowTicket} />
          )}
          {activeTab === 'reports' && (
            <Reports transactions={transactions} students={students} courses={courses} />
          )}
        </div>
      </main>

      {/* Modals */}
      {showRevenue && <RevenueModal transactions={transactions} onClose={() => setShowRevenue(false)} />}
      {showRegistration && (
        <RegistrationModal courses={courses} onClose={() => setShowRegistration(false)} onSuccess={handleRegistrationSuccess} />
      )}
      {showTicket && lastTx && (
        <TicketModal tx={lastTx} onClose={() => setShowTicket(false)} logoError={logoError} onLogoError={() => setLogoError(true)} />
      )}

      <style>{`
        @media print {
          .no-print, aside, header, button { display: none !important; }
          body { background: white !important; }
          .lg\\:ml-64 { margin-left: 0 !important; }
          #printable-ticket { border: 1px solid #eee !important; width: 100% !important; margin: 0 !important; box-shadow: none !important; background: white !important; }
          main { padding: 0 !important; margin: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
