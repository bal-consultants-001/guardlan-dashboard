'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface Note {
  id: string;
  created_at: string;
  note: string;
  user_uuid: string;
  update: string;
}

interface Props {
  ticketId: string;
  user: User;
  onClose: () => void;
}

export default function TicketNotesModal({ ticketId, user, onClose }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('ticket_notes')
      .select('id, created_at, note, user_uuid, update')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Failed to fetch notes:', error);
    } else {
      setNotes(data || []);
    }
  };

  const submitNote = async () => {
    if (!newNote.trim()) return;
    setLoading(true);
    const { error } = await supabase.from('ticket_notes').insert({
      note: newNote,
      user_uuid: user.id,
      ticket_id: ticketId,
      update: 'Update', // default type, you can make this a select input if needed
    });

    if (error) {
      console.error('Failed to insert note:', error);
    } else {
      setNewNote('');
      fetchNotes();
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, [ticketId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6">
        <h2 className="text-xl font-bold mb-4">Ticket Notes</h2>
        <div className="h-64 overflow-y-auto border p-2 mb-4 rounded">
          {notes.length === 0 ? (
            <p className="text-gray-600">No notes yet.</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="mb-3 border-b pb-2">
                <p className="text-sm text-gray-500">{new Date(note.created_at).toLocaleString()} ({note.update})</p>
                <p>{note.note}</p>
              </div>
            ))
          )}
        </div>
        <textarea
          className="w-full border rounded p-2 mb-2"
          placeholder="Add a new note..."
          rows={3}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={submitNote}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}
