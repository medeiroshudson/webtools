import { supabase } from "@/lib/api/supabase"
import { NoteEditor } from "@/components/notes/note-editor"
import { NoteExpired } from "@/components/notes/note-expired"
import { notFound } from "next/navigation"

export const revalidate = 0

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { data: note, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", id)
        .single()

    if (error || !note) {
        notFound()
    }

    if (note.expires_at && new Date(note.expires_at) < new Date()) {
        return <NoteExpired />
    }

    return <NoteEditor note={note} />
}
