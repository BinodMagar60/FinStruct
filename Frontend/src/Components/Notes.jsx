import React, { useState, useEffect, useRef } from "react";
import { FileText, Edit, Save, Plus, Trash2 } from "lucide-react";
import { navbaNotesUpdate, navbarNotesDelete, navbarNotesPull, navbarNotesSave } from "../api/AdminApi";

const Notes = () => {
  const locallySavedUser = JSON.parse(localStorage.getItem("userDetails"));

  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isChange, setChange] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const notesRef = useRef(null);

  // Fetch notes data
  useEffect(() => {
    const gettingNotes = async () => {
      try {
        const response = await navbarNotesPull(`admin/user/navbar/${locallySavedUser.id}`);
        setNotes(response.receivedData);
      } catch (err) {
        console.log(err);
      }
    };
    gettingNotes();
  }, [isChange, isNotesOpen]);

  // Close the notepad when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notesRef.current && !notesRef.current.contains(event.target)) {
        setIsNotesOpen(false);
        setEditingNoteId(null);
        setEditingContent("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) return "Invalid date";

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${months[parsedDate.getMonth()]} ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`;
  };

  const handleAddNote = async () => {
    if (newNoteContent.trim()) {
      const newNote = {
        userId: locallySavedUser.id,
        companyId: locallySavedUser.companyId,
        date: new Date(),
        content: newNoteContent,
      };
      try {
        await navbarNotesSave("admin/user/navbar", newNote);
        setChange((prev) => !prev);
        setNewNoteContent("");
        setIsAddingNote(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const startEditing = (note) => {
    setEditingNoteId(note._id);
    setEditingContent(note.content);
  };

  const saveEdit = async (id, { content }) => {
    try {
      await navbaNotesUpdate(`admin/user/navbar/${id}`, { content });
      setChange((prev) => !prev);
      setEditingNoteId(null);
      setEditingContent("");
    } catch (err) {
      console.log(err);
    }
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
    setEditingContent("");
  };

  const deleteNote = async (id) => {
    try {
      await navbarNotesDelete(`admin/user/navbar/${id}`);
      setChange((prev) => !prev);
      setEditingNoteId(null);
      setEditingContent("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const textarea = e.target;
      const cursorPosition = textarea.selectionStart;
      const textBeforeCursor = textarea.value.substring(0, cursorPosition);
      const textAfterCursor = textarea.value.substring(cursorPosition);

      const newValue = textBeforeCursor + "\n" + textAfterCursor;

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
        <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setIsNotesOpen(!isNotesOpen)}>
          <FileText className="h-7 w-7 text-gray-600" />
        </button>

        {isNotesOpen && (
          <div className="absolute right-0 mt-2 w-120 h-96 bg-white rounded-lg shadow-lg py-4 z-50 flex flex-col">
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-300">
              <h2 className="text-xl font-bold">Notepad</h2>
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto p-2 notesShow">
              {[...notes]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((note) => (
                  <div key={note._id} className="p-3 border-b border-gray-300">
                    <div className="text-xs text-gray-500 font-medium">
                      {formatDate(note.date)}
                    </div>

                    {editingNoteId === note._id ? (
                      <div className="mt-1">
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="w-full p-2 border rounded text-black bg-gray-100 focus:outline-none border-gray-300"
                          rows={3}
                          autoFocus
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                          <button onClick={cancelEdit} className="px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded-md text-gray-800 text-sm">
                            Cancel
                          </button>
                          <button onClick={() => saveEdit(note._id, { content: editingContent })} className="px-2 py-1 bg-black hover:bg-gray-800 rounded-md text-white text-sm flex justify-center items-center gap-1">
                            <Save size={13} className="mr-1" /> Save
                          </button>
                          <button onClick={() => deleteNote(note._id)} className="px-2 py-1 bg-red-500 hover:bg-red-600 rounded-md text-white text-sm flex justify-center items-center gap-1">
                            <Trash2 size={13} className="mr-1" /> Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start mt-1">
                        <div className="whitespace-pre-line text-gray-800 text-sm">
                          {note.content}
                        </div>
                        <button className="ml-2 text-gray-500 hover:text-blue-500" onClick={() => startEditing(note)}>
                          <Edit size={18} className="cursor-pointer hover:text-black" />
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
                    className="w-full p-2 border rounded border-gray-300 text-black bg-gray-100 focus:outline-none"
                    placeholder="Type your note here..."
                    rows={3}
                    autoFocus
                  />
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => setIsAddingNote(false)} className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded">
                      Cancel
                    </button>
                    <button onClick={handleAddNote} className="px-3 py-1 bg-black hover:bg-gray-800 rounded text-white">
                      Add
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setIsAddingNote(true)} className="flex items-center text-gray-600 hover:text-black cursor-pointer">
                  <Plus size={18} className="mr-2" /> New note
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
