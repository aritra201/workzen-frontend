import { getExtraDeclarationShiftStatusEntries } from '../../utils/extraShiftDeclarations.js';
import AttendanceShiftStatusPairs from '../attendance/AttendanceShiftStatusPairs.jsx';
import PersonAvatar from '../ui/PersonAvatar.jsx';
import TableCard from '../common/TableCard.jsx';
import { MobileListCard, MobileListStack } from '../common/MobileList.jsx';

export { isExtraDeclared, declaredExtraShiftsForRow } from '../../utils/extraShiftDeclarations.js';

export default function ExtraShiftDeclarationsTable({ rows, date, emptyMessage }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-4 py-10 text-center text-on-surface-variant shadow-card">
        {emptyMessage}
      </p>
    );
  }

  const shiftStatusHeader = (
    <span className="grid grid-cols-[minmax(5.5rem,7rem)_minmax(0,1fr)] gap-x-4">
      <span>Shift</span>
      <span>Status</span>
    </span>
  );

  return (
    <>
      <MobileListStack>
        {rows.map((row) => (
          <MobileListCard key={`${row.employeeId}-${date}-mobile`}>
            <div className="flex items-center gap-3">
              <PersonAvatar name={row.employeeName} email={row.employeeEmail} size={40} />
              <div className="min-w-0">
                <p className="truncate font-medium text-on-surface">{row.employeeName || '—'}</p>
                <p className="truncate text-xs text-on-surface-variant">{row.employeeEmail}</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="label-caps mb-1.5 text-outline">Shift · Status</p>
              <AttendanceShiftStatusPairs
                entries={getExtraDeclarationShiftStatusEntries(row)}
                emptyLabel="No extra shifts"
              />
            </div>
          </MobileListCard>
        ))}
      </MobileListStack>

      <TableCard className="rounded-lg" minTableWidth="md:min-w-[36rem]">
        <thead className="border-b border-outline-variant/40 bg-surface-container-low">
          <tr>
            <th className="label-caps px-3 py-2 text-outline">Employee</th>
            <th className="label-caps min-w-[14rem] px-3 py-2 text-outline">{shiftStatusHeader}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={`${row.employeeId}-${date}`}
              className="border-t border-outline-variant/30 hover:bg-surface-container-high/50"
            >
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <PersonAvatar name={row.employeeName} email={row.employeeEmail} size={40} />
                  <div className="min-w-0">
                    <p className="font-medium text-on-surface">{row.employeeName || '—'}</p>
                    <p className="truncate text-xs text-on-surface-variant">{row.employeeEmail}</p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-2.5">
                <AttendanceShiftStatusPairs
                  entries={getExtraDeclarationShiftStatusEntries(row)}
                  emptyLabel="No extra shifts"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </TableCard>
    </>
  );
}
