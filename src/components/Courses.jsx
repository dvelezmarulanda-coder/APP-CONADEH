import React, { useState } from 'react';
import { BookOpen, PlusCircle, Pencil, Trash2, X, CheckCircle2 } from 'lucide-react';

const COLORS = ['bg-blue-600','bg-emerald-600','bg-violet-600','bg-amber-600','bg-rose-600','bg-cyan-600'];
const LOCATIONS = ['Sede Central','Sede Regional','Virtual'];

// ── Edit Course Modal ───────────────────────────────────────────────────────
const EditCourseModal = ({ course, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: course.name,
    teacher: course.teacher,
    location: course.location,
    spots: course.spots,
    price: course.price,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...course, ...form, spots: parseInt(form.spots), price: parseFloat(form.price) });
  };

  return (
    <div className="fixed inset-0 bg-blue-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl p-10 relative animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500 rounded-t-[3rem]" />
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Editar Programa</h2>
          <button onClick={onClose} className="bg-slate-50 p-2 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Nombre del Programa</label>
            <input required type="text" className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Docente Encargado</label>
            <input required type="text" className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
              value={form.teacher} onChange={e => setForm({ ...form, teacher: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Modalidad/Sede</label>
              <select className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 text-sm"
                value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Cupos Totales</label>
              <input required type="number" min={1} className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                value={form.spots} onChange={e => setForm({ ...form, spots: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1 pt-2">
            <label className="text-[10px] font-black uppercase text-emerald-600 tracking-widest pl-2">Inversión (COP)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-black text-xl">$</span>
              <input required type="number" className="w-full p-4 pl-10 bg-emerald-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xl text-emerald-800 font-black"
                value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-[2rem] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-2">
            <CheckCircle2 size={18} /> Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

// ── Delete Confirm ──────────────────────────────────────────────────────────
const DeleteCourseConfirm = ({ course, studentCount, onConfirm, onClose }) => (
  <div className="fixed inset-0 bg-blue-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-[3rem] w-full max-w-sm shadow-2xl p-10 text-center animate-in zoom-in duration-200">
      <div className="w-20 h-20 bg-red-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
        <Trash2 size={36} className="text-red-500" />
      </div>
      <h2 className="text-2xl font-black text-slate-800 mb-2">¿Eliminar programa?</h2>
      <p className="text-slate-400 font-bold text-sm mb-2">
        <span className="text-slate-700 font-black">{course.name}</span>
      </p>
      {studentCount > 0 && (
        <p className="text-amber-600 font-black text-xs bg-amber-50 rounded-2xl px-4 py-3 mb-4">
          ⚠️ Este programa tiene {studentCount} alumno{studentCount !== 1 ? 's' : ''} inscritos.
        </p>
      )}
      <p className="text-slate-400 font-bold text-sm mb-8">Esta acción es permanente.</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-3.5 bg-slate-100 rounded-2xl font-black text-slate-600 hover:bg-slate-200 transition-all text-sm">Cancelar</button>
        <button onClick={onConfirm} className="flex-1 py-3.5 bg-red-500 text-white rounded-2xl font-black hover:bg-red-600 transition-all text-sm">Eliminar</button>
      </div>
    </div>
  </div>
);

// ── Add Course Modal ────────────────────────────────────────────────────────
const AddCourseModal = ({ onSave, onClose }) => {
  const [form, setForm] = useState({ name: '', teacher: '', location: 'Sede Central', spots: '', price: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    onSave({
      id: Date.now(),
      name: form.name,
      teacher: form.teacher,
      location: form.location,
      spots: parseInt(form.spots) || 30,
      price: parseFloat(form.price) || 0,
      students: 0,
      color: randomColor,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  };

  return (
    <div className="fixed inset-0 bg-blue-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl p-12 animate-in zoom-in duration-200 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Crear Programa</h2>
          <button onClick={onClose} className="bg-slate-50 p-2 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Nombre del Programa</label>
            <input required type="text" className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
              placeholder="Ej: Diplomado en Liderazgo"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Docente Encargado</label>
            <input required type="text" className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
              placeholder="Ej: Dr. Juan Pérez"
              value={form.teacher} onChange={e => setForm({ ...form, teacher: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Modalidad/Sede</label>
              <select className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 text-sm"
                value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Cupos Libres</label>
              <input required type="number" className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                placeholder="Ej: 40"
                value={form.spots} onChange={e => setForm({ ...form, spots: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1 pt-2">
            <label className="text-[10px] font-black uppercase text-emerald-600 tracking-widest pl-2">Inversión (COP)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-black text-xl">$</span>
              <input required type="number" className="w-full p-4 pl-10 bg-emerald-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xl text-emerald-800 font-black"
                placeholder="1500000"
                value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="w-full mt-4 bg-emerald-600 text-white py-5 rounded-[2.5rem] font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 uppercase tracking-widest">
            Guardar Programa
          </button>
        </form>
      </div>
    </div>
  );
};

// ── Courses Tab ─────────────────────────────────────────────────────────────
const Courses = ({ courses, setCourses, students }) => {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const handleSave = (updated) => {
    setCourses(prev => prev.map(c => c.id === updated.id ? updated : c));
    setEditing(null);
  };

  const handleAdd = (newCourse) => {
    setCourses(prev => [...prev, newCourse]);
    setShowAdd(false);
  };

  const handleDelete = () => {
    setCourses(prev => prev.filter(c => c.id !== deleting.id));
    setDeleting(null);
  };

  return (
    <>
      <div className="animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Oferta Académica</h2>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-emerald-200 font-bold text-sm"
          >
            <PlusCircle size={18} />
            <span>Nuevo Programa</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => {
            const textColor = course.color.replace('bg-', 'text-');
            const enrolled = students.filter(s => s.courseId === course.id).length;
            return (
              <div key={course.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 hover:shadow-xl transition-all group relative">
                {/* Action Buttons */}
                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditing(course)}
                    className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all"
                    title="Editar">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleting(course)}
                    className="w-9 h-9 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                    title="Eliminar">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className={`w-14 h-14 ${course.color} bg-opacity-10 rounded-2xl flex items-center justify-center mb-6`}>
                  <BookOpen className={textColor} size={28} />
                </div>
                <h3 className="font-black text-xl mb-1 text-slate-800 leading-tight pr-16">{course.name}</h3>
                <p className="text-slate-400 text-sm mb-6 font-bold">{course.teacher}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-1">
                    <span>Ocupación</span>
                    <span className={textColor}>{enrolled} / {course.spots}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className={`h-full ${course.color} transition-all duration-700`}
                      style={{ width: `${Math.min((enrolled / course.spots) * 100, 100)}%` }} />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-50">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                    <span>Modalidad</span>
                    <span className="text-slate-700">{course.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inversión</span>
                    <span className="text-2xl font-black text-blue-800">$ {course.price.toLocaleString('es-CO')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showAdd && <AddCourseModal onSave={handleAdd} onClose={() => setShowAdd(false)} />}
      {editing && <EditCourseModal course={editing} onSave={handleSave} onClose={() => setEditing(null)} />}
      {deleting && (
        <DeleteCourseConfirm
          course={deleting}
          studentCount={students.filter(s => s.courseId === deleting.id).length}
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </>
  );
};

export default Courses;
