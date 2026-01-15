"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const response = await fetch('/api/notes');
    const data = await response.json();
    setNotes(data);
  };

  const tambahCatatan = async (e) => {
    e.preventDefault();
    if (!input) return;
    setLoading(true);

    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: input })
    });

    setInput("");
    setLoading(false);
    fetchNotes();
  };

  const hapusCatatan = async (id) => {
    if (!confirm("Yakin mau hapus catatan ini?")) return;

    await fetch('/api/notes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    });

    fetchNotes();
  };

  // --- INI FUNGSI BARU BUAT EDIT ---
  const editCatatan = async (id, textLama) => {
    // 1. Munculkan popup input bawaan browser
    const textBaru = prompt("Edit catatan kamu:", textLama);

    // 2. Kalau user klik Cancel atau kosong, jangan lakukan apa-apa
    if (!textBaru || textBaru === textLama) return;

    // 3. Kirim data baru ke Backend
    await fetch('/api/notes', {
      method: 'PUT', // Pakai metode PUT
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, content: textBaru })
    });

    // 4. Refresh daftar
    fetchNotes();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-blue-400">📝 Catatan Harian (CRUD Lengkap)</h1>

      {/* Form Input */}
      <form onSubmit={tambahCatatan} className="w-full max-w-md flex gap-2 mb-8">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tulis sesuatu..."
          disabled={loading}
          className="flex-1 p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 disabled:opacity-50"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 px-6 rounded font-bold hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? "..." : "Simpan"}
        </button>
      </form>

      {/* Daftar Catatan */}
      <div className="w-full max-w-md space-y-3">
        {notes.map((note) => (
          <div key={note.id} className="p-4 bg-gray-800 rounded border border-gray-700 shadow-md flex justify-between items-center group">
            
            <div className="flex-1 mr-4">
              <p className="text-lg">{note.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(note.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-2">
              {/* TOMBOL EDIT (Kuning) */}
              <button 
                onClick={() => editCatatan(note.id, note.content)}
                className="bg-yellow-600/20 text-yellow-500 px-3 py-1 rounded hover:bg-yellow-600 hover:text-white transition-all text-sm font-bold"
              >
                Edit
              </button>

              {/* TOMBOL HAPUS (Merah) */}
              <button 
                onClick={() => hapusCatatan(note.id)}
                className="bg-red-600/20 text-red-500 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition-all text-sm font-bold"
              >
                Hapus
              </button>
            </div>

          </div>
        ))}

        {notes.length === 0 && (
          <p className="text-center text-gray-500">Belum ada catatan.</p>
        )}
      </div>
    </div>
  );
}