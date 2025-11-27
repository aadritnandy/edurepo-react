-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create users table
create table public.users (
  id uuid references auth.users not null primary key,
  email text unique not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) for users
alter table public.users enable row level security;

-- Create policies for users
create policy "Users can view their own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.users
  for update using (auth.uid() = id);

-- Create classes table
create table public.classes (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  language text not null,
  color text not null,
  code text unique not null,
  owner_id uuid references public.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for classes
alter table public.classes enable row level security;

-- Create policies for classes
create policy "Anyone can view classes" on public.classes
  for select using (true);

create policy "Authenticated users can create classes" on public.classes
  for insert with check (auth.role() = 'authenticated');

create policy "Owners can update their classes" on public.classes
  for update using (auth.uid() = owner_id);

create policy "Owners can delete their classes" on public.classes
  for delete using (auth.uid() = owner_id);

-- Create user_classes table (enrollments)
create table public.user_classes (
  user_id uuid references public.users(id) on delete cascade not null,
  class_id uuid references public.classes(id) on delete cascade not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, class_id)
);

-- Enable RLS for user_classes
alter table public.user_classes enable row level security;

-- Create policies for user_classes
create policy "Users can view their enrollments" on public.user_classes
  for select using (auth.uid() = user_id);

create policy "Users can enroll in classes" on public.user_classes
  for insert with check (auth.uid() = user_id);

create policy "Users can unenroll" on public.user_classes
  for delete using (auth.uid() = user_id);

-- Function to handle new user signup (automatically create profile)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
