'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Trash2, User, UserX } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ConfirmModal } from '@/components/ui/Modal'
import { createClient } from '@/lib/supabase/client'
import { formatRelativeTime } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { GuestbookMessage } from '@/types'

interface Props {
  event: { id: string; name: string }
  initialMessages: GuestbookMessage[]
}

export function GuestbookManager({ event, initialMessages }: Props) {
  const [messages, setMessages] = useState(initialMessages)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const supabase = createClient()

  const filtered = messages.filter(m => filter === 'all' || m.status === filter)

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setLoading(id)
    try {
      const { error } = await supabase.from('guestbook_messages').update({ status }).eq('id', id)
      if (error) throw error
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m))
      toast.success(`Message ${status}`)
    } catch {
      toast.error('Failed to update')
    } finally {
      setLoading(null)
    }
  }

  const deleteMessage = async (id: string) => {
    setLoading(id)
    try {
      await supabase.from('guestbook_messages').delete().eq('id', id)
      setMessages(prev => prev.filter(m => m.id !== id))
      toast.success('Message deleted')
    } catch {
      toast.error('Failed to delete')
    } finally {
      setLoading(null)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">Guestbook</h1>
        <p className="text-white/50 mt-1">{event.name}</p>
      </div>

      <div className="flex gap-1 glass p-1 rounded-xl w-fit">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all capitalize ${
              filter === f ? 'bg-brand-600 text-white' : 'text-white/50 hover:text-white'
            }`}
          >
            {f} ({messages.filter(m => f === 'all' || m.status === f).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="font-bold text-white mb-1">No messages</p>
          <p className="text-sm text-white/50">Guest messages will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div key={msg.id} className="glass-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 mb-2">
                  {msg.is_anonymous ? (
                    <UserX className="w-4 h-4 text-white/30" />
                  ) : (
                    <User className="w-4 h-4 text-white/50" />
                  )}
                  <span className="text-sm font-medium text-white">
                    {msg.is_anonymous ? 'Anonymous' : (msg.author_name || 'Guest')}
                  </span>
                  <Badge
                    variant={msg.status === 'approved' ? 'approved' : msg.status === 'rejected' ? 'rejected' : 'pending'}
                    dot
                  >
                    {msg.status}
                  </Badge>
                  <span className="text-xs text-white/30 ml-auto">
                    {formatRelativeTime(msg.created_at)}
                  </span>
                </div>
              </div>

              <p className="text-white/80 text-sm leading-relaxed mb-4">{msg.message}</p>

              <div className="flex gap-2">
                {msg.status !== 'approved' && (
                  <Button
                    variant="success"
                    size="sm"
                    icon={<CheckCircle className="w-4 h-4" />}
                    onClick={() => updateStatus(msg.id, 'approved')}
                    loading={loading === msg.id}
                  >
                    Approve
                  </Button>
                )}
                {msg.status !== 'rejected' && (
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<XCircle className="w-4 h-4" />}
                    onClick={() => updateStatus(msg.id, 'rejected')}
                  >
                    Reject
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={() => setDeleteTarget(msg.id)}
                  className="text-red-400/70 hover:text-red-400 ml-auto"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMessage(deleteTarget)}
        title="Delete this message?"
        description="This cannot be undone."
        confirmLabel="Delete"
        danger
        loading={loading === deleteTarget}
      />
    </div>
  )
}
