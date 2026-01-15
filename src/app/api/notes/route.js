import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 1. FUNGSI GET (Ambil Data)
export async function GET() {
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: 'desc' }, // Urutkan dari yang terbaru
  });
  return NextResponse.json(notes);
}

// 2. FUNGSI POST (Simpan Data)
export async function POST(request) {
  const { content } = await request.json();

  const newNote = await prisma.note.create({
    data: {
      content: content,
    },
  });
  
  return NextResponse.json(newNote);
}

// 3. FUNGSI DELETE (Hapus Data)
export async function DELETE(request) {
  // Baca data ID yang mau dihapus dari Frontend
  const { id } = await request.json();

  // "Hei Prisma, cari note dengan ID ini, lalu HAPUS!"
  await prisma.note.delete({
    where: {
      id: Number(id), // Pastikan id diubah jadi angka (bukan text)
    },
  });

  return NextResponse.json({ message: "Berhasil dihapus" });
}

// 4. FUNGSI PUT (Update/Edit Data)
export async function PUT(request) {
  // Terima ID dan Isi Baru dari Frontend
  const { id, content } = await request.json();

  // "Hei Prisma, cari ID ini, terus GANTI isinya dengan yang baru"
  const updatedNote = await prisma.note.update({
    where: {
      id: Number(id),
    },
    data: {
      content: content,
    },
  });

  return NextResponse.json(updatedNote);
}