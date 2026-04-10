import React, { useState } from 'react';
import { BookOpen, PlusCircle, Pencil, Trash2, X, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

const COLORS = ['bg-blue-600', 'bg-emerald-600', 'bg-violet-600', 'bg-amber-600', 'bg-rose-600', 'bg-cyan-600'];
const LOCATIONS = ['Sede Central', 'Sede Regional', 'Virtual'];

// 📔 Edit Course Modal 📔
const EditCourseModal = ({ course, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: course.name,
    teacher: course.teacher,
    location: course.location,
    spots: course.spots,
    weeks: course.weeks || 0,
    registrationFee: course.registrationFee || 0,
    monthlyFee: course.monthlyFee || 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...course,
      ...form,
      spots: parseInt(form.spots),
      weeks: parseInt(form.weeks),
      registrationFee: parseFloat(form.registrationFee),
      monthlyFee: parseFloat(form.monthlyFee)
    });
  };

  return (
    <div className="fixed inset-0 bg-bg-main/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-bg-card rounded-[3rem] w-full max-w-lg shadow-2xl p-6 sm:p-10 relative animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto border border-transparent dark:border-slate-800">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary rounded-t-[3rem]" />
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-800 dark:text-text-main tracking-tighter uppercase whitespace-pre-line leading-none">Editar Curso</h2>
          <button onClick={onClose} className="bg-slate-50 dark:bg-slate-800 p-2 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Nombre del Curso</label>
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
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Duración (Semanas)</label>
              <input required type="number" className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-slate-700"
                value={form.weeks} onChange={e => setForm({ ...form, weeks: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Inscripción</label>
              <input required type="number" className="w-full p-4 bg-primary/5 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-primary-dark"
                value={form.registrationFee} onChange={e => setForm({ ...form, registrationFee: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Mensualidad</label>
              <input required type="number" className="w-full p-4 bg-primary/5 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-primary-dark"
                value={form.monthlyFee} onChange={e => setForm({ ...form, monthlyFee: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="w-full bg-primary text-white py-4 rounded-[2rem] font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
            <CheckCircle2 size={18} /> Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

// 🗑️ Delete Confirm 🗑️
const DeleteCourseConfirm = ({ course, studentCount, onConfirm, onClose }) => (
  <div className="fixed inset-0 bg-bg-main/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
    <div className="bg-white dark:bg-bg-card rounded-[3rem] w-full max-w-sm shadow-2xl p-6 sm:p-10 text-center animate-in zoom-in duration-200 border border-transparent dark:border-slate-800">
      <div className="w-20 h-20 bg-red-100 dark:bg-red-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
        <Trash2 size={36} className="text-red-500" />
      </div>
      <h2 className="text-2xl font-black text-slate-800 dark:text-text-main mb-2 uppercase tracking-tighter">¿Eliminar curso?</h2>
      <p className="text-slate-400 font-bold text-sm mb-2">
        <span className="text-slate-700 dark:text-slate-300 font-black">{course.name}</span>
      </p>
      {studentCount > 0 && (
        <p className="text-red-600 font-black text-[10px] bg-red-50 dark:bg-red-500/10 rounded-2xl px-4 py-3 mb-4 uppercase tracking-widest leading-relaxed">
          ESTE CURSO TIENE {studentCount} ALUMNO{studentCount !== 1 ? 'S' : ''} INSCRITOS.
        </p>
      )}
      <p className="text-slate-400 font-bold text-xs mb-8">Esta acción es permanente.</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-[10px] uppercase tracking-widest">Cancelar</button>
        <button onClick={onConfirm} className="flex-1 py-3.5 bg-red-500 text-white rounded-2xl font-black hover:bg-red-600 transition-all text-[10px] uppercase tracking-widest">Eliminar</button>
      </div>
    </div>
  </div>
);

// ➕ Add Course Modal ➕
const AddCourseModal = ({ onSave, onClose }) => {
  const [form, setForm] = useState({ name: '', teacher: '', location: 'Sede Central', spots: '', weeks: '', registrationFee: '', monthlyFee: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const newCourseObj = {
      name: form.name,
      teacher: form.teacher,
      location: form.location,
      spots: parseInt(form.spots) || 30,
      weeks: parseInt(form.weeks) || 0,
      registrationFee: parseFloat(form.registrationFee) || 0,
      monthlyFee: parseFloat(form.monthlyFee) || 0,
      students: 0,
      color: randomColor,
    };
    onSave(newCourseObj);
  };

  return (
    <div className="fixed inset-0 bg-bg-main/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-bg-card rounded-[3rem] w-full max-w-xl shadow-2xl p-6 sm:p-12 animate-in zoom-in duration-200 relative overflow-hidden max-h-[90vh] overflow-y-auto border border-transparent dark:border-slate-800">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-slate-800 dark:text-text-main tracking-tighter">Crear Curso</h2>
          <button onClick={onClose} className="bg-slate-50 dark:bg-slate-800 p-2 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Nombre del Curso</label>
            <input required type="text" className="w-full p-4 bg-slate-100 dark:bg-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 dark:text-zinc-200"
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
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Semanas</label>
              <input required type="number" className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-slate-700 dark:text-text-main"
                placeholder="12" value={form.weeks} onChange={e => setForm({ ...form, weeks: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Inscripción</label>
              <input required type="number" className="w-full p-4 bg-primary/5 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-primary-dark"
                placeholder="150000" value={form.registrationFee} onChange={e => setForm({ ...form, registrationFee: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Mensualidad</label>
              <input required type="number" className="w-full p-4 bg-primary/5 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-primary-dark"
                placeholder="400000" value={form.monthlyFee} onChange={e => setForm({ ...form, monthlyFee: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="w-full mt-4 bg-primary text-white py-5 rounded-[2.5rem] font-black text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 uppercase tracking-widest">
            Guardar Curso
          </button>
        </form>
      </div>
    </div>
  );
};

// 🎓 Courses Tab 🎓
const Courses = ({ courses, setCourses, students }) => {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const handleSave = async (updated) => {
    // optimistic update
    setCourses(prev => prev.map(c => c.id === updated.id ? updated : c));
    setEditing(null);
    await supabase.from('courses').update(updated).eq('id', updated.id);
  };

  const handleAdd = async (newCourse) => {
    const { data } = await supabase.from('courses').insert([newCourse]).select();
    if (data && data.length > 0) {
      setCourses(prev => [...prev, data[0]]);
    }
    setShowAdd(false);
  };

  const handleDelete = async () => {
    const idToDelete = deleting.id;
    setCourses(prev => prev.filter(c => c.id !== idToDelete));
    setDeleting(null);
    await supabase.from('courses').delete().eq('id', idToDelete);
  };

  return (
    <>
      <div className="animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-white tracking-tighter">Cursos Disponibles</h2>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-primary/20 dark:shadow-none font-bold text-sm"
          >
            <PlusCircle size={18} />
            <span>Nuevo Curso</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => {
            const textColor = course.color.replace('bg-', 'text-');
            const enrolled = students.filter(s => s.courseId === course.id).length;
            return (
              <div key={course.id} className="bg-white dark:bg-bg-card rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-6 md:p-8 hover:shadow-xl dark:hover:shadow-black/20 transition-all group relative duration-500">
                {/* Action Buttons */}
                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditing(course)}
                    className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light hover:bg-primary dark:hover:bg-primary hover:text-white flex items-center justify-center transition-all"
                    title="Editar">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleting(course)}
                    className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 hover:bg-rose-600 dark:hover:bg-rose-600 hover:text-white flex items-center justify-center transition-all"
                    title="Eliminar">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className={`w-14 h-14 ${course.color} bg-opacity-10 rounded-2xl flex items-center justify-center mb-6 border border-primary/10`}>
                  <BookOpen className={textColor} size={28} />
                </div>
                <h3 className="font-black text-xl mb-1 text-slate-800 dark:text-white leading-tight pr-16">{course.name}</h3>
                <p className="text-slate-400 dark:text-slate-500 text-sm mb-6 font-bold">{course.teacher}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-1">
                    <span>Ocupación</span>
                    <span className={textColor}>{enrolled} / {course.spots}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className={`h-full ${course.color} transition-all duration-700`}
                      style={{ width: `${Math.min((enrolled / course.spots) * 100, 100)}%` }} />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                    <span>Modalidad • {course.weeks} Semanas</span>
                    <span className="text-slate-700 dark:text-slate-300">{course.location}</span>
                  </div>
                  <div className="flex justify-between items-center bg-primary/5 dark:bg-primary/10 p-3 rounded-2xl border border-transparent dark:border-primary/10">
                    <div>
                      <p className="text-[8px] font-black text-primary dark:text-primary-light uppercase tracking-tighter">Inscripción</p>
                      <p className="text-sm font-black text-primary-dark dark:text-primary-light">$ {(course.registrationFee || 0).toLocaleString('es-CO')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-primary dark:text-primary-light uppercase tracking-tighter">Costo Mensual</p>
                      <p className="text-xl font-black text-primary dark:text-primary-light">$ {(course.monthlyFee || 0).toLocaleString('es-CO')}</p>
                    </div>
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
