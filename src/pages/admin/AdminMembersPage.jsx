import { useEffect, useState } from 'react';
import { inviteMember, listMembers, resendMemberInvite, updateMemberStatus } from '../../api/members.js';
import Button from '../../components/ui/Button.jsx';
import TextField from '../../components/ui/TextField.jsx';
import Modal, { ModalActions } from '../../components/ui/Modal.jsx';
import PersonAvatar from '../../components/ui/PersonAvatar.jsx';
import StatusChangeConfirmModal from '../../components/admin/StatusChangeConfirmModal.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import StatusChip from '../../components/ui/StatusChip.jsx';

function memberStatus(member) {
  if (member.isActive) {
    return { label: 'Active', tone: 'verified' };
  }
  return { label: 'Inactive', tone: 'locked' };
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [statusConfirm, setStatusConfirm] = useState(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await listMembers();
      setMembers(data.members || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleInvite() {
    setBusy(true);
    setError('');
    try {
      await inviteMember({ email: inviteEmail });
      setInviteOpen(false);
      setInviteEmail('');
      await load();
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
      await load();
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
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Members</h1>
        <Button onClick={() => setInviteOpen(true)}>Invite member</Button>
      </div>
      <ErrorMessage message={error} />

      <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-card">
        <table className="w-full text-left text-sm">
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
              const showResend = !member.isActive;

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
                    {showResend ? (
                      <Button size="sm" variant="secondary" onClick={() => handleResend(member)}>
                        Resend invite
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setStatusConfirm({ member, nextActive: !member.isActive })
                      }
                    >
                      {member.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal open={inviteOpen} title="Invite member" onClose={() => setInviteOpen(false)} closeOnBackdrop={false}>
        <TextField
          id="invite-email"
          label="Email"
          type="email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
        />
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
        personLabel={statusConfirm?.member?.email}
        nextActive={statusConfirm?.nextActive}
        loading={busy}
        onCancel={() => setStatusConfirm(null)}
        onConfirm={applyStatusChange}
      />
    </div>
  );
}
