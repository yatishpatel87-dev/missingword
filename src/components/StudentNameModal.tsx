import React, { useState } from 'react';
import { User, Check, X, ShieldAlert } from 'lucide-react';

interface StudentNameModalProps {
  currentName: string;
  onSave: (name: string) => void;
  onClose: () => void;
}

export const StudentNameModal: React.FC<StudentNameModalProps> = ({
  currentName,
  onSave,
  onClose
}) => {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = name.trim();
    if (!clean) {
      setError('Please enter a student name for your detective certificate.');
      return;
    }
    onSave(clean);
  };

  return (
    <div
      id="student-name-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-white">
            Detective Profile (વિદ્યાર્થી નામ)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            This name will be printed on your Detective Certificate & Official Score Report.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Student / Detective Name
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g., Aarav Patel / Diya Sharma"
              className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-100 outline-none transition-all font-semibold"
            />
            {error && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              id="save-student-name-btn"
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Name</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
