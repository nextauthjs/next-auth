/** 
* USERS
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table users (
  -- UUID from next_auth.users
  id uuid not null primary key,
  name text,
  email text,
  image text,
  constraint "users_id_fkey" foreign key ("id")
        references  next_auth.users (id) match simple
        on update no action
        on delete cascade -- if user is deleted in NextAuth they will also be deleted in our public table.
);
alter table users enable row level security;
create policy "Can view own user data." on users for select using (next_auth.uid() = id);
create policy "Can update own user data." on users for update using (next_auth.uid() = id);

/**
* This trigger automatically creates a user entry when a new user signs up via NextAuth.
*/ 
create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, name, email, image)
  values (new.id, new.name, new.email, new.image);
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on next_auth.users
  for each row execute procedure public.handle_new_user();