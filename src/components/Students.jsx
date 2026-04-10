import React, { useState, useMemo } from 'react';
import { Phone, Calendar, Search, Pencil, Trash2, X, CheckCircle2, RefreshCcw, DollarSign } from 'lucide-react';
import { supabase } from '../supabaseClient';

const STATUS_COLORS = {
  'Al día': 'bg-primary/10 text-primary',
  'Por vencer': 'bg-amber-100 text-amber-700',
  'Vencido': 'bg-red-100 text-red-700',
};

// 👤 Edit Modal 👤
const EditStudentModal = ({ student, courses, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: student.name,
    email: student.email,
    phone: student.phone,
    courseId: student.courseId,
    status: student.status,
    dueDate: student.dueDate,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...student, ...form, courseId: parseInt(form.courseId) });
  };

  return (
    <div className="fixed inset-0 bg-bg-main/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-bg-card rounded-[3rem] w-full max-w-lg shadow-2xl p-6 sm:p-10 relative animate-in zoom-in duration-200 border border-transparent dark:border-slate-800">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary rounded-t-[3rem]" />
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-800 dark:text-text-main tracking-tighter">Editar Estudiante</h2>
          <button onClick={onClose} className="bg-slate-50 dark:bg-slate-800 p-2 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-2">Nombre Completo</label>
            <input required type="text" className="w-full p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-600 font-bold text-zinc-700 dark:text-zinc-200"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-2">Email</label>
              <input type="email" className="w-full p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-600 font-bold text-sm text-zinc-700 dark:text-zinc-200"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-2">Teléfono</label>
              <input type="tel" className="w-full p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-600 font-bold text-sm text-zinc-700 dark:text-zinc-200"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-2">Programa Académico</label>
            <select className="w-full p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-600 font-bold text-sm text-zinc-700 dark:text-zinc-200"
              value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })}>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-2">Estado</label>
              <select className="w-full p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-600 font-bold text-sm text-zinc-700 dark:text-zinc-200"
                value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-2">Próximo Pago</label>
              <input type="text" className="w-full p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-600 font-bold text-sm text-zinc-700 dark:text-zinc-200"
                value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="w-full bg-primary text-white py-4 rounded-[2rem] font-bold uppercase tracking-widest hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
            <CheckCircle2 size={18} /> Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

// ⚠️ Delete Confirm ⚠️
const DeleteConfirm = ({ student, onConfirm, onClose }) => (
  <div className="fixed inset-0 bg-bg-main/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
    <div className="bg-white dark:bg-bg-card rounded-[3rem] w-full max-w-sm shadow-2xl p-10 text-center animate-in zoom-in duration-200 border border-transparent dark:border-slate-800">
      <div className="w-20 h-20 bg-red-100 dark:bg-red-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
        <Trash2 size={36} className="text-red-500" />
      </div>
      <h2 className="text-2xl font-black text-slate-800 dark:text-text-main mb-2 uppercase tracking-tighter">¿Eliminar alumno?</h2>
      <p className="text-slate-400 font-bold text-xs mb-8 uppercase tracking-widest leading-relaxed">
        Esta acción eliminará a <span className="text-slate-700 dark:text-text-main font-black">{student.name}</span> de forma permanente.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-[10px] uppercase tracking-widest">Cancelar</button>
        <button onClick={onConfirm} className="flex-1 py-3.5 bg-red-500 text-white rounded-2xl font-black hover:bg-red-600 transition-all text-[10px] uppercase tracking-widest">Eliminar</button>
      </div>
    </div>
  </div>
);

// 💰 Renew Modal 💰
const RenewModal = ({ student, courses, onConfirm, onClose }) => {
  const course = courses.find(c => c.id === student.courseId);
  const suggested = course?.monthlyFee || 0;
  const [method, setMethod] = useState('Efectivo');
  const [amount, setAmount] = useState(suggested.toString());

  const nextDue = new Date();
  nextDue.setDate(nextDue.getDate() + 30);
  const nextDueStr = nextDue.toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ amount: parseFloat(amount) || 0, method, nextDue: nextDueStr });
  };

  return (
    <div className="fixed inset-0 bg-bg-main/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-bg-card rounded-[3.5rem] w-full max-w-md shadow-2xl p-8 md:p-12 relative animate-in zoom-in duration-300 border border-transparent dark:border-slate-800">
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-emerald-500 to-primary rounded-t-[3.5rem]" />
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-text-main tracking-tighter uppercase leading-none">Renovar Mensualidad</h3>
            <p className="text-primary font-bold text-[10px] tracking-widest mt-1 uppercase">{student.name}</p>
          </div>
          <button onClick={onClose} className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-800/30 rounded-3xl p-5 mb-6">
          <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-1">Próximo vencimiento</p>
          <p className="text-2xl font-black text-emerald-800 dark:text-emerald-300">{nextDueStr}</p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-bold mt-1">(+30 días desde hoy)</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-3">Método de Pago</label>
            <select
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-4 focus:ring-primary/20 font-bold text-slate-700 dark:text-text-main text-sm uppercase tracking-widest"
              value={method} onChange={e => setMethod(e.target.value)}
            >
              <option>Efectivo</option>
              <option>Transferencia</option>
              <option>Nequi</option>
              <option>Daviplata</option>
              <option>Tarjeta</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-3">Monto Recibido (COP)</label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                required type="number" min="0"
                className="w-full pl-10 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-4 focus:ring-primary/20 font-black text-xl text-primary"
                value={amount} onChange={e => setAmount(e.target.value)}
              />
            </div>
            {suggested > 0 && (
              <p className="text-[10px] text-slate-400 font-bold pl-3">Mensualidad sugerida: $ {suggested.toLocaleString('es-CO')}</p>
            )}
          </div>

          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3">
            <RefreshCcw size={18} /> Confirmar Renovación
          </button>
        </form>
      </div>
    </div>
  );
};

// 🎓 Students Tab 🎓
const Students = ({ students, setStudents, courses, onRenew }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [renewing, setRenewing] = useState(null);

  const filtered = useMemo(() => {
    let list = filter === 'all' ? students : students.filter(s => s.courseId === parseInt(filter));
    if (search) list = list.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [students, filter, search]);

  const handleSave = async (updated) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
    setEditing(null);
    await supabase.from('students').update(updated).eq('id', updated.id);
  };

  const handleDelete = async () => {
    const idToDelete = deleting.id;
    setStudents(prev => prev.filter(s => s.id !== idToDelete));
    setDeleting(null);
    await supabase.from('students').delete().eq('id', idToDelete);
  };

  const handleRenew = async ({ amount, method, nextDue }) => {
    const s = renewing;
    setStudents(prev => prev.map(st =>
      st.id === s.id ? { ...st, dueDate: nextDue, status: 'Al día', isRenewed: true } : st
    ));
    setRenewing(null);
    
    // Update Supabase
    await supabase.from('students').update({ dueDate: nextDue, status: 'Al día', isRenewed: true }).eq('id', s.id);
    
    // Trigger transaction creation
    if (onRenew) onRenew(s, amount, method, nextDue);
  };

  return (
    <>
      <div className="bg-white dark:bg-bg-card rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in duration-300 transition-colors duration-500">
        <div className="p-5 md:p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="font-black text-xl text-slate-800 dark:text-text-main uppercase tracking-tighter">Directorio General</h2>
            <select
              className="bg-slate-50 dark:bg-slate-800 px-5 py-3 rounded-2xl text-xs font-black text-slate-500 dark:text-slate-400 border-none outline-none focus:ring-2 focus:ring-primary uppercase tracking-widest"
              value={filter} onChange={e => setFilter(e.target.value)}
            >
              <option value="all">TODOS LOS PROGRAMAS</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-sm font-bold text-slate-600 dark:text-text-main outline-none focus:ring-2 focus:ring-primary border-none transition-all"
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Estudiante / Contacto</th>
                <th className="px-8 py-5">Programa / Ingreso</th>
                <th className="px-8 py-5">Estado</th>
                <th className="px-8 py-5">Próximo Pago</th>
                <th className="px-8 py-5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                  <td className="px-8 py-5">
                    <div className="font-black text-slate-700 dark:text-text-main uppercase tracking-tighter">{s.name}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1 uppercase tracking-widest">
                      <Phone size={8} /> {s.phone || 'Sin teléfono'}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold italic lowercase">{s.email}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-bold text-slate-600 dark:text-slate-400">{courses.find(c => c.id === s.courseId)?.name}</div>
                    <div className="text-[9px] text-primary dark:text-primary-light font-black flex items-center gap-1 mt-1">
                      <Calendar size={10} /> {s.registrationDate || '--'}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase ${STATUS_COLORS[s.status] || 'bg-zinc-100 text-zinc-500'}`}>
                        {s.status}
                      </span>
                      {s.isRenewed && (
                        <span className="px-2 py-1 rounded-md text-[8px] font-black uppercase bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50">Renovado</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-mono font-black text-slate-400 dark:text-slate-500">{s.dueDate}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setRenewing(s)}
                        className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all"
                        title="Renovar mensualidad"
                      >
                        <RefreshCcw size={14} />
                      </button>
                      <button
                        onClick={() => setEditing(s)}
                        className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light hover:bg-primary dark:hover:bg-primary hover:text-white flex items-center justify-center transition-all"
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleting(s)}
                        className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-500 dark:hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-400 font-bold text-sm">
                    No se encontraron estudiantes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing && <EditStudentModal student={editing} courses={courses} onSave={handleSave} onClose={() => setEditing(null)} />}
      {deleting && <DeleteConfirm student={deleting} onConfirm={handleDelete} onClose={() => setDeleting(null)} />}
      {renewing && <RenewModal student={renewing} courses={courses} onConfirm={handleRenew} onClose={() => setRenewing(null)} />}
    </>
  );
};

export default Students;
