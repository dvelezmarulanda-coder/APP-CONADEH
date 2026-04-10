import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard, Users, BookOpen, CalendarClock,
  TrendingUp, PlusCircle, ChevronRight, DollarSign,
  Printer, X, Search, FileText, AlertCircle, ShieldCheck, Phone,
  Sun, Moon
} from 'lucide-react';

import Courses from './components/Courses';
import Students from './components/Students';
import Reports from './components/Reports';

const APP_NAME = "CONADEH";

const generateId = (prefix = "CON") => `${prefix}-${Math.floor(Math.random() * 90000) + 10000}`;

import { supabase } from './supabaseClient';

// 🏛️ BrandLogo 🏛️
const BrandLogo = ({ className, onError, hasError }) => {
  if (hasError) return <ShieldCheck className={`${className} text-primary`} />;
  return <img src="/logo.png" alt="CONADEH" className={`${className} object-contain`} onError={onError} />;
};

// 🧾 POS Receipt Component 🧾
const POSReceipt = ({ data }) => {
  if (!data) return null;
  return (
    <div className="print-area hidden text-slate-900 font-mono text-[10px] bg-white p-2">
      <div className="text-center border-b border-dashed border-slate-300 pb-3 mb-3">
        <h2 className="text-sm font-black tracking-tight">CONADEH</h2>
        <p className="text-[8px] uppercase font-bold">Comprobante de Pago</p>
        <p className="mt-1">Nº {data.id}</p>
        <p>{new Date(data.date).toLocaleString()}</p>
      </div>
      <div className="space-y-1.5 mb-4">
        <div className="flex justify-between"><span>CONCEPTO:</span> <span className="font-bold text-right uppercase">{data.type}</span></div>
        <div className="flex justify-between"><span>ESTUDIANTE:</span> <span className="font-bold text-right uppercase">{data.student}</span></div>
        <div className="flex justify-between"><span>CURSO:</span> <span className="font-bold text-right uppercase">{data.course}</span></div>
        <div className="flex justify-between"><span>MÉTODO:</span> <span className="font-bold text-right uppercase">{data.method}</span></div>
      </div>
      <div className="border-t border-b border-dashed border-slate-300 py-3 flex justify-between font-black text-xs">
        <span>TOTAL PAGADO:</span>
        <span>$ {data.amount?.toLocaleString()}</span>
      </div>
      <div className="text-center mt-8 text-[7px] space-y-1">
        <p className="font-bold uppercase">¡GRACIAS POR SU CONFIANZA!</p>
        <p>Este es un soporte interno de pago</p>
        <p>CONADEH - Educación Institucional</p>
      </div>
    </div>
  );
};

// 📝 Registration Modal 📝
const RegistrationModal = ({ courses, onClose, onSuccess }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', courseId: '', method: 'Efectivo', amount: '' });
  const selectedCourse = useMemo(() => courses.find(c => c.id === parseInt(form.courseId)), [courses, form.courseId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const courseIdInt = parseInt(form.courseId);
    const selectedCourse = courses.find(c => c.id === courseIdInt);
    if (!selectedCourse) return;
    const now = new Date();
    const formattedRegDate = `${now.toISOString().split('T')[0]} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const amountNum = parseFloat(form.amount) || 0;

    const newStudent = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      courseId: courseIdInt,
      status: 'Al día',
      registrationDate: formattedRegDate,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    const newTransaction = {
      id: generateId(),
      date: new Date().toISOString(),
      student: form.name,
      course: selectedCourse.name,
      method: form.method,
      amount: amountNum,
      type: 'Inscripción',
      isClosed: false
    };

    onSuccess(newStudent, newTransaction);
  };

  return (
    <div className="fixed inset-0 bg-bg-main/80 backdrop-blur-xl z-[70] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-bg-card rounded-[3.5rem] w-full max-w-xl shadow-2xl p-8 md:p-12 animate-in zoom-in duration-300 relative overflow-hidden border border-transparent dark:border-slate-800">
        <div className="absolute top-0 left-0 w-full h-3 bg-primary" />
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-3xl font-black text-slate-800 dark:text-text-main tracking-tighter uppercase leading-none">Inscripción</h3>
            <p className="text-primary font-bold text-[10px] tracking-widest mt-1 uppercase">Nuevo Registro Académico</p>
          </div>
          <button onClick={onClose} className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl text-slate-400 hover:text-slate-600 transition-colors shadow-sm"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-3">Nombre Completo</label>
            <input required type="text" className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl outline-none focus:ring-4 focus:ring-primary/20 font-bold text-slate-700 dark:text-text-main transition-all"
              placeholder="Ej: David Velez"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-3">Email</label>
              <input required type="email" className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl outline-none focus:ring-4 focus:ring-primary/20 font-bold text-slate-700 dark:text-text-main text-sm"
                placeholder="correo@ejemplo.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-3">WhatsApp</label>
              <input required type="tel" className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl outline-none focus:ring-4 focus:ring-primary/20 font-bold text-slate-700 dark:text-text-main text-sm"
                placeholder="+57 300 000 0000"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-3">Programa Académico</label>
            <select required className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-primary/20 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]"
              value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })}>
              <option value="">Selecciona un curso</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-3">Método de Pago</label>
            <div className="grid grid-cols-2 gap-3">
              {['Efectivo', 'Transferencia'].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setForm({ ...form, method: m })}
                  className={`py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                    form.method === m 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {selectedCourse && (
            <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-3xl border border-primary/10 animate-in slide-in-from-top-4 duration-300">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Inversión Sugerida</span>
                <span className="text-xs font-black text-slate-400 uppercase">COP</span>
              </div>
              <div className="flex items-center gap-4">
                <input required type="number"
                  className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl p-4 text-2xl font-black text-primary placeholder:text-primary/20 outline-none shadow-sm"
                  placeholder={selectedCourse.registrationFee.toString()}
                  value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                />
              </div>
            </div>
          )}

          <button type="submit" className="w-full bg-primary text-white py-5 rounded-[2.5rem] font-black text-lg uppercase tracking-widest hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3">
            <ShieldCheck size={24} /> Confirmar Registro
          </button>
        </form>
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      const [ { data: c }, { data: s }, { data: t } ] = await Promise.all([
        supabase.from('courses').select('*'),
        supabase.from('students').select('*'),
        supabase.from('transactions').select('*')
      ]);
      if (c) setCourses(c);
      if (s) setStudents(s);
      if (t) setTransactions(t);
      setLoading(false);
    };
    fetchData();
  }, []);
  const [showRegModal, setShowRegModal] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [latestTx, setLatestTx] = useState(null);

  const printReceipt = (tx) => {
    setLatestTx(tx);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const stats = useMemo(() => {
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const activePrograms = courses.length;
    const totalStudents = students.length;
    return { totalRevenue, activePrograms, totalStudents };
  }, [transactions, courses, students]);

  const handleRegistration = async (newStudent, newTransaction) => {
    // Inserta alumno
    const { data: stData } = await supabase.from('students').insert([newStudent]).select();
    if (stData && stData.length > 0) {
      setStudents(prev => [...prev, stData[0]]);
    }
    
    // Inserta transacción
    const { data: txData } = await supabase.from('transactions').insert([newTransaction]).select();
    if (txData && txData.length > 0) {
      setTransactions(prev => [...prev, txData[0]]);
      printReceipt(txData[0]);
    }
    
    setShowRegModal(false);
  };

  const handleCloseDay = async (date) => {
    // Busca las que inician con la fecha
    const toClose = transactions.filter(t => t.date.startsWith(date));
    if (toClose.length > 0) {
      const ids = toClose.map(t => t.id);
      await supabase.from('transactions').update({ isClosed: true }).in('id', ids);
      setTransactions(prev => prev.map(t => ids.includes(t.id) ? { ...t, isClosed: true } : t));
    }
  };

  const handleRenewal = async (student, amount, method) => {
    const course = courses.find(c => c.id === student.courseId);
    const newTransaction = {
      id: `TX-${Date.now()}`,
      date: new Date().toISOString(),
      student: student.name,
      course: course?.name || 'N/A',
      method,
      amount,
      type: 'Mensualidad',
      isClosed: false,
    };
    const { data: txData } = await supabase.from('transactions').insert([newTransaction]).select();
    if (txData && txData.length > 0) {
      setTransactions(prev => [...prev, txData[0]]);
      printReceipt(txData[0]);
    }
  };

  const NavItem = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex flex-col md:flex-row items-center gap-3 px-6 py-4 rounded-[2rem] transition-all duration-500 group relative ${activeTab === id
          ? 'bg-primary text-white shadow-2xl shadow-primary/30 scale-105'
          : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary'
        }`}
    >
      <Icon size={activeTab === id ? 22 : 18} className={`transition-all ${activeTab === id ? 'scale-110' : 'group-hover:rotate-12'}`} />
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
      {activeTab === id && (
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full md:hidden" />
      )}
    </button>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} transition-colors duration-500`}>
      <POSReceipt data={latestTx} />
      <div className="min-h-screen bg-bg-main dark:bg-bg-main text-slate-800 dark:text-text-main flex flex-col md:flex-row font-sans selection:bg-primary/30 print:hidden">

        {/* Sidebar Navigation */}
        <aside className="w-full md:w-80 bg-white dark:bg-bg-card border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 p-8 flex flex-col z-40 transition-colors duration-500">
          <div className="flex flex-col items-center text-center gap-4 mb-16">
            <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center border border-primary/10 overflow-hidden group shadow-md transition-all">
              <BrandLogo className="w-16 h-16 group-hover:scale-110 transition-transform" onError={() => setImgError(true)} hasError={imgError} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-primary-dark dark:text-white leading-none">{APP_NAME}</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Admin Panel v2.0</p>
            </div>
          </div>

          <nav className="flex flex-row md:flex-col gap-2 md:gap-4 flex-1">
            <NavItem id="dashboard" label="Métricas" icon={LayoutDashboard} />
            <NavItem id="students" label="Alumnos" icon={Users} />
            <NavItem id="courses" label="Cursos" icon={BookOpen} />
            <NavItem id="reports" label="Finanzas" icon={CalendarClock} />
          </nav>

          <div className="mt-auto hidden md:block pt-8 border-t border-slate-50 dark:border-slate-800">
            <div className="p-6 bg-primary/5 dark:bg-primary/10 rounded-[2.5rem] border border-primary/10 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck size={80} className="text-primary" />
              </div>
              <p className="text-[8px] font-black text-primary uppercase tracking-widest mb-2">Sistema Seguro</p>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Servidor Online</span>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="mt-4 w-full p-4 rounded-2xl flex items-center justify-center gap-3 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-primary transition-all"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              <span className="text-[10px] font-black uppercase tracking-widest">{darkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 md:p-14 lg:p-20 overflow-y-auto max-h-screen">

          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
            <div className="animate-in fade-in slide-in-from-left duration-700">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase whitespace-pre-line leading-[0.9]">
                {activeTab === 'dashboard' ? 'Panel de\nControl' : activeTab === 'students' ? 'Gestión de\nAlumnos' : activeTab === 'courses' ? 'Gestión de\nCursos' : 'Reportes y\nCierres'}
              </h2>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-[3px] w-20 bg-primary" />
                <p className="text-slate-400 dark:text-slate-500 text-xs font-bold">Resumen institucional en tiempo real.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-right duration-700">
              {activeTab === 'dashboard' && (
                <button
                  onClick={() => setShowRegModal(true)}
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-[2.5rem] flex items-center gap-3 transition-all hover:-translate-y-1 shadow-2xl shadow-primary/20 font-black text-xs uppercase tracking-widest"
                >
                  <PlusCircle size={20} /> Nueva Inscripción
                </button>
              )}
              {activeTab === 'reports' && (
                <button onClick={() => window.print()} className="p-4 bg-white dark:bg-bg-card rounded-2xl text-slate-400 hover:text-primary transition-all shadow-sm border border-slate-100 dark:border-slate-800">
                  <Printer size={20} />
                </button>
              )}
            </div>
          </header>

          {activeTab === 'dashboard' && (
            <div className="space-y-12 animate-in fade-in duration-500">
              {/* Quick KPI Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-bg-card p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group transition-colors duration-500">
                  <div className="relative z-10">
                    <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-4">Recaudación Total</p>
                    <h3 className="text-4xl font-black text-slate-800 dark:text-text-main tracking-tighter mb-2">$ {stats.totalRevenue.toLocaleString('es-CO')}</h3>
                    <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase">
                      <TrendingUp size={12} /> +12% vs mes anterior
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                    <DollarSign size={100} className="text-primary" />
                  </div>
                </div>

                <div className="bg-white dark:bg-bg-card p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-500">
                  <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-4">Alumnos Activos</p>
                  <h3 className="text-4xl font-black text-slate-800 dark:text-text-main tracking-tighter mb-2">{stats.totalStudents}</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest italic">Registrados globalmente</p>
                </div>

                <div className="bg-white dark:bg-bg-card p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-500">
                  <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-4">Cursos Disponibles</p>
                  <h3 className="text-4xl font-black text-slate-800 dark:text-text-main tracking-tighter mb-2">{stats.activePrograms}</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest italic">Cursos vigentes</p>
                </div>
              </div>

              {/* Big Welcome / Info Card */}
              <div className="bg-slate-900 dark:bg-bg-card p-12 md:p-16 rounded-[4rem] text-white relative overflow-hidden shadow-2xl transition-colors duration-500">
                <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
                <div className="relative z-10 max-w-2xl">
                  <span className="px-5 py-2 bg-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-8 inline-block">Actualización Sistema</span>
                  <h3 className="text-5xl font-black tracking-tighter mb-6 leading-none">Optimice la gestión educativa de su institución.</h3>
                  <p className="text-slate-400 font-bold text-lg mb-10 leading-relaxed">Acceda a métricas detalladas, procese inscripciones rápidamente y controle el flujo financiero con nuestra nueva interfaz premium.</p>
                  <div className="flex flex-wrap gap-6">
                    <button
                      onClick={() => setActiveTab('students')}
                      className="bg-white text-slate-900 px-10 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-3"
                    >
                      Gestionar Alumnos <ChevronRight size={18} />
                    </button>
                    <div className="flex items-center gap-4 px-6 border-l-2 border-slate-700">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center">
                        <ShieldCheck className="text-primary" size={24} />
                      </div>
                      <p className="text-xs font-bold text-slate-400">Protección de Datos <br /> Cifrada (AES-256)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && <Students students={students} setStudents={setStudents} courses={courses} onRenew={handleRenewal} />}
          {activeTab === 'courses' && <Courses courses={courses} setCourses={setCourses} students={students} />}
          {activeTab === 'reports' && <Reports transactions={transactions} students={students} courses={courses} onCloseDay={handleCloseDay} />}
        </main>
      </div>

      {showRegModal && (
        <RegistrationModal
          courses={courses}
          onClose={() => setShowRegModal(false)}
          onSuccess={handleRegistration}
        />
      )}
    </div>
  );
};

export default App;
