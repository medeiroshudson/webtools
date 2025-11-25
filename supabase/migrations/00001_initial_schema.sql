-- Create notes table
create table public.notes (
  id uuid default gen_random_uuid() primary key,
  content text default '',
  is_collaborative boolean default false,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.notes enable row level security;

-- Create policies
-- Allow anyone to read notes (if they have the ID)
create policy "Public notes are viewable by everyone"
  on public.notes for select
  using (true);

-- Allow updates only if collaborative is true
create policy "Collaborative notes are updatable by everyone"
  on public.notes for update
  using (is_collaborative = true);

-- Allow inserts by everyone (anon)
create policy "Anyone can create notes"
  on public.notes for insert
  with check (true);

-- Enable Realtime
alter publication supabase_realtime add table public.notes;
