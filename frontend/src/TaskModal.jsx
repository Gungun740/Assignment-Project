import { useState, useEffect } from 'react';
import './TaskModal.css';

const STATUSES   = ['TODO', 'IN_PROGRESS', 'DONE'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
const STATUS_LABELS   = { TODO: 'To do', IN_PROGRESS: 'In progress', DONE: 'Done' };
const PRIORITY_LABELS = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' };

const empty = { title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '' };

export default function TaskModal({ task, onClose, onSave }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

 // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
  }, [task]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    else if (form.title.length > 255) e.title = 'Max 255 characters';
    if (form.description.length > 1000) e.description = 'Max 1000 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors && typeof apiErrors === 'object') setErrors(apiErrors);
    } finally {
      setSaving(false);
    }
  };

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: '' })); };

  return (
    <div className="modal-overlay animate-fade-in" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-fade-up">
        <div className="modal__header">
          <h3>{task ? 'Edit task' : 'New task'}</h3>
          <button className="btn btn-icon btn-ghost modal__close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal__body" noValidate>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              className={`form-input ${errors.title ? 'error' : ''}`}
              type="text" autoFocus placeholder="What needs to be done?"
              value={form.title} onChange={set('title')}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className={`form-input ${errors.description ? 'error' : ''}`}
              placeholder="Optional details…"
              value={form.description} onChange={set('description')}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          <div className="modal__row-2">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input" value={form.status} onChange={set('status')}>
                {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-input" value={form.priority} onChange={set('priority')}>
                {PRIORITIES.map(p => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Due date</label>
            <input
              className="form-input"
              type="datetime-local"
              value={form.dueDate} onChange={set('dueDate')}
            />
          </div>

          <div className="modal__footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><span className="spinner" />{task ? 'Saving…' : 'Creating…'}</> : task ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}