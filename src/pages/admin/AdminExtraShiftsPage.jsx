import { useEffect, useState } from 'react';
import { declareExtraShift, listExtraShifts } from '../../api/extraShifts.js';
import { listEmployees } from '../../api/employees.js';
import { todayIsoDate } from '../../utils/format.js';
import Button from '../../components/ui/Button.jsx';
import TextField from '../../components/ui/TextField.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

export default function AdminExtraShiftsPage() {
  const [date, setDate] = useState(todayIsoDate());
  const [employees, setEmployees] = useState([]);
  const [declarations, setDeclarations] = useState([]);
  const [form, setForm] = useState({ employeeId: '', extraDayShift: true, extraNightShift: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const [emp, extra] = await Promise.all([listEmployees(), listExtraShifts({ date })]);
      setEmployees(emp.employees || []);
      setDeclarations(extra.declarations || extra.records || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [date]);

  async function handleDeclare(event) {
    event.preventDefault();
    try {
      await declareExtraShift({
        employeeId: form.employeeId,
        date,
        extraDayShift: form.extraDayShift,
        extraNightShift: form.extraNightShift,
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Extra shifts</h1>
      <ErrorMessage message={error} />

      <form onSubmit={handleDeclare} className="grid gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-card md:grid-cols-2">
        <TextField id="extra-date" label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Employee</span>
          <select
            className="h-12 w-full rounded-lg bg-surface-container-low px-3"
            value={form.employeeId}
            onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
            required
          >
            <option value="">Select employee</option>
            {employees.map((e) => (
              <option key={e.employeeId} value={e.employeeId}>{e.employeeName}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.extraDayShift} onChange={(ev) => setForm({ ...form, extraDayShift: ev.target.checked })} />
          Extra day shift
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.extraNightShift} onChange={(ev) => setForm({ ...form, extraNightShift: ev.target.checked })} />
          Extra night shift
        </label>
        <Button type="submit" className="md:col-span-2">Declare extra shift</Button>
      </form>

      <div className="rounded-xl bg-surface-container-lowest p-5 shadow-card">
        <h2 className="font-semibold">Declarations for {date}</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {declarations.map((d) => (
            <li key={d.employeeId + date} className="flex justify-between border-b border-surface-container-high py-2">
              <span>{d.employeeName || d.employeeId}</span>
              <span className="text-on-surface-variant">
                {d.extraDay ? 'Day' : ''}{d.extraDay && d.extraNight ? ' · ' : ''}{d.extraNight ? 'Night' : ''}
              </span>
            </li>
          ))}
          {!declarations.length ? <li className="text-on-surface-variant">No declarations yet.</li> : null}
        </ul>
      </div>
    </div>
  );
}
