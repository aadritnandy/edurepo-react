-- Create class_content table
create table public.class_content (
  id uuid default uuid_generate_v4() primary key,
  class_id uuid references public.classes(id) on delete cascade not null,
  type text not null check (type in ('text', 'image')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.class_content enable row level security;

-- Policies
create policy "Class members can view content" on public.class_content
  for select using (
    exists (
      select 1 from public.user_classes
      where user_classes.class_id = class_content.class_id
      and user_classes.user_id = auth.uid()
    )
  );

create policy "Owners can insert content" on public.class_content
  for insert with check (
    exists (
      select 1 from public.classes
      where classes.id = class_content.class_id
      and classes.owner_id = auth.uid()
    )
  );

create policy "Owners can delete content" on public.class_content
  for delete using (
    exists (
      select 1 from public.classes
      where classes.id = class_content.class_id
      and classes.owner_id = auth.uid()
    )
  );
