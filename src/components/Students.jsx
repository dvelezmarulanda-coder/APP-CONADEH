import React, { useState, useMemo } from 'react';
import { Phone, Calendar, Search, Pencil, Trash2, X, CheckCircle2 } from 'lucide-react';

const STATUS_COLORS = {
  'Al día': 'bg-emerald-100 text-emerald-700',
  'Por vencer': 'bg-amber-100 text-amber-700',
  'Vencido': 'bg-red-100 text-red-700',
};

// ── Edit Modal ──────────────────────────────────────────────────────────────
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
    <div className="fixed inset-0 bg-blue-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl p-10 relative animate-in zoom-in duration-200">
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-700 rounded-t-[3rem]" />
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Editar Estudiante</h2>
          <button onClick={onClose} className="bg-slate-50 p-2 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Nombre Completo</label>
            <input required type="text" className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-700 font-bold"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Email</label>
              <input type="email" className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-700 font-bold text-sm"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Teléfono</label>
              <input type="tel" className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-700 font-bold text-sm"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Programa</label>
              <select className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-700 font-bold text-xs"
                value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })}>
                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Estado</label>
              <select className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-700 font-bold text-xs"
                value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="Al día">Al día</option>
                <option value="Por vencer">Por vencer</option>
                <option value="Vencido">Vencido</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Próximo Pago</label>
            <input type="date" className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-700 font-bold"
              value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <button type="submit" className="w-full bg-blue-800 text-white py-4 rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-900 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2">
            <CheckCircle2 size={18} /> Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

// ── Delete Confirm ──────────────────────────────────────────────────────────
const DeleteConfirm = ({ student, onConfirm, onClose }) => (
  <div className="fixed inset-0 bg-blue-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-[3rem] w-full max-w-sm shadow-2xl p-10 text-center animate-in zoom-in duration-200">
      <div className="w-20 h-20 bg-red-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
        <Trash2 size={36} className="text-red-500" />
      </div>
      <h2 className="text-2xl font-black text-slate-800 mb-2">¿Eliminar alumno?</h2>
      <p className="text-slate-400 font-bold text-sm mb-8">
        Esta acción eliminará a <span className="text-slate-700 font-black">{student.name}</span> de forma permanente.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-3.5 bg-slate-100 rounded-2xl font-black text-slate-600 hover:bg-slate-200 transition-all text-sm">Cancelar</button>
        <button onClick={onConfirm} className="flex-1 py-3.5 bg-red-500 text-white rounded-2xl font-black hover:bg-red-600 transition-all text-sm">Eliminar</button>
      </div>
    </div>
  </div>
);

// ── Students Tab ────────────────────────────────────────────────────────────
const Students = ({ students, setStudents, courses }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const filtered = useMemo(() => {
    let list = filter === 'all' ? students : students.filter(s => s.courseId === parseInt(filter));
    if (search) list = list.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [students, filter, search]);

  const handleSave = (updated) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
    setEditing(null);
  };

  const handleDelete = () => {
    setStudents(prev => prev.filter(s => s.id !== deleting.id));
    setDeleting(null);
  };

  return (
    <>
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="font-black text-xl text-slate-800">Directorio General</h2>
            <select
              className="bg-slate-50 px-4 py-2 rounded-xl text-xs font-black text-slate-500 border-none outline-none focus:ring-2 focus:ring-blue-500"
              value={filter} onChange={e => setFilter(e.target.value)}
            >
              <option value="all">TODOS LOS PROGRAMAS</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 border-none"
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Estudiante / Contacto</th>
                <th className="px-8 py-5">Programa / Ingreso</th>
                <th className="px-8 py-5">Estado</th>
                <th className="px-8 py-5">Próximo Pago</th>
                <th className="px-8 py-5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-blue-50/20 transition-colors">
                  <td className="px-8 py-5">
                    <div className="font-black text-slate-700">{s.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <Phone size={8} /> {s.phone || 'Sin teléfono'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold">{s.email}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-bold text-slate-600">{courses.find(c => c.id === s.courseId)?.name}</div>
                    <div className="text-[9px] text-blue-600 font-black flex items-center gap-1 mt-1">
                      <Calendar size={10} /> {s.registrationDate || '--'}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase ${STATUS_COLORS[s.status] || 'bg-slate-100 text-slate-500'}`}>
                        {s.status}
                      </span>
                      {s.isRenewed && (
                        <span className="px-2 py-1 rounded-md text-[8px] font-black uppercase bg-blue-100 text-blue-700 border border-blue-200">Renovado</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-mono font-black text-slate-400">{s.dueDate}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setEditing(s)}
                        className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all"
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleting(s)}
                        className="w-9 h-9 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
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
    </>
  );
};

export default Students;
