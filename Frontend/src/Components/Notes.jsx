
import React, { useState, useEffect, useRef } from 'react';
import { FileText, Edit, Save, Plus, Trash2 } from 'lucide-react'; 

const Notes = () => {
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [notes, setNotes] = useState([
    {
      id: 1,
      date: new Date(2025, 2, 8),
      content: 'hello world my name is binod kaucha magar',
    },
    {
      id: 2,
      date: new Date(2025, 2, 7),
      content: 'binod magar adsad',
    },
  ]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  const notesRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notesRef.current && !notesRef.current.contains(event.target)) {
        setIsNotesOpen(false);
        setEditingNoteId(null);
        setEditingContent('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDate = (date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      const newNote = {
        id: Date.now(),
        date: new Date(),
        content: newNoteContent,
      };
      setNotes([newNote, ...notes]);
      setNewNoteContent('');
      setIsAddingNote(false);
    }
  };

  const startEditing = (note) => {
    setEditingNoteId(note.id);
    setEditingContent(note.content);
  };

  const saveEdit = () => {
    if (editingContent.trim()) {
      setNotes(
        notes.map((note) =>
          note.id === editingNoteId ? { ...note, content: editingContent, date: new Date() } : note
        )
      );
      setEditingNoteId(null);
      setEditingContent('');
    }
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
    setEditingContent('');
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
    setEditingNoteId(null);
    setEditingContent('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const textarea = e.target;
      const cursorPosition = textarea.selectionStart;
      const textBeforeCursor = textarea.value.substring(0, cursorPosition);
      const textAfterCursor = textarea.value.substring(cursorPosition);

      const newValue = textBeforeCursor + '\n' + textAfterCursor;

      if (editingNoteId) {
        setEditingContent(newValue);
      } else {
        setNewNoteContent(newValue);
      }

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = cursorPosition + 1;
      }, 0);
    }
  };

  return (
    <div>
      <div className="relative" ref={notesRef}>
        <button
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={() => setIsNotesOpen(!isNotesOpen)}
        >
          <FileText className="h-7 w-7 text-gray-600" />
        </button>

        {isNotesOpen && (
          <div className="absolute right-0 mt-2 w-120 h-96 bg-white rounded-lg shadow-lg py-4 z-50 flex flex-col">
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-300">
              <h2 className="text-xl font-bold">Notepad</h2>
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto p-2 notesShow">
              {notes.map((note) => (
                <div key={note.id} className="p-3 border-b border-gray-300">
                  <div className="text-xs text-gray-500 font-medium">{formatDate(note.date)}</div>

                  {editingNoteId === note.id ? (
                    <div className="mt-1">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full p-2 border rounded text-black bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          onClick={cancelEdit}
                          className="px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded-md text-gray-800 text-sm cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveEdit}
                          className="px-2 py-1 bg-blue-500 hover:bg-blue-600 rounded-md text-white flex items-center text-sm cursor-pointer"
                        >
                          <Save size={12} className="mr-1" /> Save
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 rounded-md text-white flex items-center text-sm cursor-pointer"
                        >
                          <Trash2 size={12} className="mr-1" /> Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start mt-1">
                      <div className="whitespace-pre-line text-gray-800 text-sm">{note.content}</div>
                      <button
                        className="ml-2 text-gray-500 hover:text-blue-500 flex-shrink-0"
                        onClick={() => startEditing(note)}
                      >
                        <Edit size={18} className='cursor-pointer hover:text-black'/>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Note Section */}
            <div className="px-3 pt-2 border-t border-gray-300 mt-auto">
              {isAddingNote ? (
                <div className="flex flex-col space-y-2">
                  <textarea
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full p-2 border rounded text-black bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Type your note here..."
                    rows={3}
                    autoFocus
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setIsAddingNote(false)}
                      className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddNote}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-white cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingNote(true)}
                  className="flex items-center text-gray-600 hover:text-black cursor-pointer"
                >
                  <Plus size={18} className="mr-2 " /> New note
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
