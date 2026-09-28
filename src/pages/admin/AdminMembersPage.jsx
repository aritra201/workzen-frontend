import { useCallback, useEffect, useState } from 'react';
import { inviteMember, listMembers, resendMemberInvite, updateMemberStatus } from '../../api/members.js';
import ListPagination from '../../components/common/ListPagination.jsx';
import Button from '../../components/ui/Button.jsx';
import TextField from '../../components/ui/TextField.jsx';
import Modal, { ModalActions } from '../../components/ui/Modal.jsx';
import PersonAvatar from '../../components/ui/PersonAvatar.jsx';
import StatusChangeConfirmModal from '../../components/admin/StatusChangeConfirmModal.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import StatusChip from '../../components/ui/StatusChip.jsx';
import TableCard from '../../components/common/TableCard.jsx';
import { MobileListCard, MobileListStack } from '../../components/common/MobileList.jsx';

const PAGE_SIZE = 20;

function memberStatus(member) {
  if (!member.userId) {
    return { label: 'Invitation pending', tone: 'pending' };
  }
  if (member.isActive) {
    return { label: 'Active', tone: 'verified' };
  }
  return { label: 'Inactive', tone: 'locked' };
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ memberName: '', email: '' });
  const [busy, setBusy] = useState(false);
  const [statusConfirm, setStatusConfirm] = useState(null);

  const load = useCallback(async (pageNum = page) => {
    setLoading(true);
    setError('');
    try {
      const data = await listMembers({ page: pageNum, limit: PAGE_SIZE });
      setMembers(data.items || data.members || []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 0);
      setPage(data.page ?? pageNum);
    } catch (err) {
      setError(err.message);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load
  }, []);

  async function handleInvite() {
    setBusy(true);
    setError('');
    try {
      await inviteMember({
        memberName: inviteForm.memberName.trim(),
        email: inviteForm.email.trim(),
      });
      setInviteOpen(false);
      setInviteForm({ memberName: '', email: '' });
      await load(page);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleResend(member) {
    setError('');
    try {
      await resendMemberInvite({ email: member.email });
      await load(page);
    } catch (err) {
      setError(err.message);
    }
  }

  async function applyStatusChange() {
    if (!statusConfirm) return;
    const { member, nextActive } = statusConfirm;
    setBusy(true);
    setError('');
    try {
      await updateMemberStatus(member.id, { isActive: nextActive });
      setStatusConfirm(null);
      await load(page);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  if (loading && members.length === 0 && !error) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Members</h1>
        <Button onClick={() => setInviteOpen(true)}>Invite member</Button>
      </div>
      <ErrorMessage message={error} />

      <p className="text-sm text-on-surface-variant">
        {total === 0 ? 'No members yet.' : `Showing ${rangeStart}–${rangeEnd} of ${total}`}
      </p>

      {members.length === 0 ? (
        <p className="rounded-xl bg-surface-container-lowest px-4 py-10 text-center text-on-surface-variant shadow-card">
          No members to show.
        </p>
      ) : (
        <MobileListStack className={loading ? 'opacity-60' : ''}>
          {members.map((member) => {
            const status = memberStatus(member);
            const invitationPending = !member.userId;
            const canDeactivate = member.userId && member.isActive;
            const canActivate = member.userId && !member.isActive;
            return (
              <MobileListCard key={member.id}>
                <div className="flex items-center gap-3">
                  <PersonAvatar
                    name={member.name}
                    email={member.email}
                    src={member.profilePicture}
                    size={44}
                  />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{member.name || '—'}</p>
                    <p className="truncate text-sm text-on-surface-variant">{member.email}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <StatusChip tone={status.tone}>{status.label}</StatusChip>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {invitationPending ? (
                    <Button size="sm" variant="secondary" onClick={() => handleResend(member)}>
                      Resend invite
                    </Button>
                  ) : null}
                  {canDeactivate ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setStatusConfirm({ member, nextActive: false })}
                    >
                      Deactivate
                    </Button>
                  ) : null}
                  {canActivate ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setStatusConfirm({ member, nextActive: true })}
                    >
                      Activate
                    </Button>
                  ) : null}
                </div>
              </MobileListCard>
            );
          })}
        </MobileListStack>
      )}

      {members.length > 0 ? (
      <TableCard
        bordered={false}
        className={`rounded-xl ${loading ? 'opacity-60' : ''}`}
        minTableWidth="md:min-w-[44rem]"
      >
          <thead className="bg-surface-container-low text-xs uppercase text-outline">
            <tr>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
              {members.map((member) => {
                const status = memberStatus(member);
                const invitationPending = !member.userId;
                const canDeactivate = member.userId && member.isActive;
                const canActivate = member.userId && !member.isActive;

                return (
                  <tr key={member.id} className="border-t border-surface-container-high">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <PersonAvatar
                          name={member.name}
                          email={member.email}
                          src={member.profilePicture}
                          size={44}
                        />
                        <span className="font-medium">{member.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{member.email}</td>
                    <td className="px-4 py-3">
                      <StatusChip tone={status.tone}>{status.label}</StatusChip>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      {invitationPending ? (
                        <Button size="sm" variant="secondary" onClick={() => handleResend(member)}>
                          Resend invite
                        </Button>
                      ) : null}
                      {canDeactivate ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setStatusConfirm({ member, nextActive: false })}
                        >
                          Deactivate
                        </Button>
                      ) : null}
                      {canActivate ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setStatusConfirm({ member, nextActive: true })}
                        >
                          Activate
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
          </tbody>
      </TableCard>
      ) : null}

      <ListPagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={PAGE_SIZE}
        loading={loading}
        onPageChange={(next) => load(next)}
      />

      <Modal open={inviteOpen} title="Invite member" onClose={() => setInviteOpen(false)} closeOnBackdrop={false}>
        <div className="space-y-3">
          <TextField
            id="invite-member-name"
            label="Name"
            icon="person"
            value={inviteForm.memberName}
            inputFilter="alphabetic"
            onChange={(e) => setInviteForm({ ...inviteForm, memberName: e.target.value })}
            required
          />
          <TextField
            id="invite-email"
            label="Email"
            type="email"
            icon="alternate_email"
            value={inviteForm.email}
            onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
            required
          />
        </div>
        <div className="mt-6">
          <ModalActions
            confirmLabel="Send invite"
            loading={busy}
            onCancel={() => setInviteOpen(false)}
            onConfirm={handleInvite}
          />
        </div>
      </Modal>

      <StatusChangeConfirmModal
        open={Boolean(statusConfirm)}
        kind="member"
        personLabel={statusConfirm?.member?.name || statusConfirm?.member?.email}
        nextActive={statusConfirm?.nextActive}
        loading={busy}
        onCancel={() => setStatusConfirm(null)}
        onConfirm={applyStatusChange}
      />
    </div>
  );
}
