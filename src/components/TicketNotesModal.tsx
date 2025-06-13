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

interface UserMetadata {
  role?: string;
}

console.log('Supabase user:', user);
console.log('user.id being inserted:', user.id);


const UPDATE_TYPES = [
  'Information',
  'Remote - Booking',
  'Onsite - Booking',
  'Update',
  'Closing',
];

export default function TicketNotesModal({ ticketId, user, onClose }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [selectedUpdate, setSelectedUpdate] = useState('Information');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('ticket_notes')
      .select('*')
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

    const payload = {
      note: newNote.trim(),
      user_uuid: user.id,
      ticket_id: ticketId,
      update: isAdmin ? selectedUpdate : 'Information',
    };

    const { error } = await supabase.from('ticket_notes').insert(payload);

    if (error) {
      console.error('Error submitting note:', error);
	alert(`Error submitting note: ${error.message}`);
    } else {
      setNewNote('');
      if (!isAdmin) setSelectedUpdate('Information');
      fetchNotes();
    }

    setLoading(false);
  };

	useEffect(() => {
	  const fetchNotes = async () => {
		const { data } = await supabase
		  .from('ticket_notes')
		  .select('*')
		  .eq('ticket_id', ticketId)
		  .order('created_at', { ascending: true });

		if (data) setNotes(data);
	  };

	  const checkAdminRole = () => {
	  const role = (user.user_metadata as UserMetadata)?.role;
	  if (role === 'admin') {
		setIsAdmin(true);
	  }
	};


	  fetchNotes();
	  checkAdminRole();
	}, [ticketId, user]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative">
        <h2 className="text-xl font-bold mb-4">Ticket Notes</h2>

        <div className="h-64 overflow-y-auto space-y-4 mb-4 px-2">
          {notes.length === 0 ? (
            <p className="text-gray-500 text-center">No notes yet.</p>
          ) : (
            notes.map((note) => {
              const isAgentNote = note.user_uuid !== user.id;
              const bubbleStyle = isAgentNote
                ? 'bg-blue-600 text-white self-end'
                : 'bg-gray-200 text-black self-start';

              const alignment = isAgentNote ? 'items-end' : 'items-start';

              return (
                <div
                  key={note.id}
                  className={`flex flex-col ${alignment} max-w-[75%]`}
                >
                  <div className={`rounded-lg px-4 py-2 ${bubbleStyle}`}>
                    <p className="text-sm">{note.note}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(note.created_at).toLocaleString()} — {note.update}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Input and dropdown */}
        <textarea
          className="w-full border rounded p-2 mb-2"
          rows={3}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Type your message here..."
        />

        {isAdmin && (
          <div className="mb-2">
            <label htmlFor="update-type" className="block text-sm font-medium mb-1">
              Update Type
            </label>
            <select
              id="update-type"
              className="w-full border rounded p-2"
              value={selectedUpdate}
              onChange={(e) => setSelectedUpdate(e.target.value)}
            >
              {UPDATE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        )}

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
