-- Add title column to notes table
alter table public.notes add column title text default 'Untitled Note';

-- Add a comment to the column
comment on column public.notes.title is 'The title of the note';
