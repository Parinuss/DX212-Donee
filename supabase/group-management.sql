-- Run AFTER setup-all.sql on the existing chat-enabled database.
-- Requires public.messages(group_id, file_path) and storage.objects.
-- Storage bytes are deleted by the signed-in owner's Storage API, NEVER SQL.
begin;
alter table public.groups add column if not exists deletion_pending boolean not null default false;

create or replace function donee_private.owns_group(p_group_id bigint)
returns boolean language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists(select 1 from public.groups where id=p_group_id and created_by=auth.uid());
$$;
revoke all on function donee_private.owns_group(bigint) from public, anon;
grant execute on function donee_private.owns_group(bigint) to authenticated;

-- Serialize new writes against the deletion marker, including in-flight uploads.
create or replace function donee_private.guard_group_write()
returns trigger language plpgsql security definer set search_path = '' as $$
declare gid bigint; pending boolean;
begin
  if TG_TABLE_SCHEMA = 'storage' then
    if TG_OP = 'UPDATE' and old.bucket_id = 'chat-images' and (old.bucket_id <> new.bucket_id or old.name <> new.name) then
      raise exception 'Moving group attachments is disabled';
    end if;
    if new.bucket_id <> 'chat-images' then return new; end if;
    if split_part(new.name,'/',1) !~ '^[0-9]+$' then raise exception 'Invalid group attachment path'; end if;
    gid := split_part(new.name,'/',1)::bigint;
    if TG_OP = 'UPDATE' and (old.bucket_id <> new.bucket_id or old.name <> new.name) then
      raise exception 'Moving group attachments is disabled';
    end if;
  else
    gid := new.group_id;
    if TG_OP = 'UPDATE' and old.group_id is distinct from new.group_id then
      raise exception 'Moving records between groups is disabled';
    end if;
  end if;
  if gid is null then return new; end if;
  select deletion_pending into pending from public.groups where id=gid for share;
  if not found or pending then raise exception 'กลุ่มกำลังถูกลบ ไม่สามารถเพิ่มหรือแก้ไขข้อมูล กรุณาให้ผู้สร้างลองลบอีกครั้ง'; end if;
  return new;
end $$;
revoke all on function donee_private.guard_group_write() from public, anon, authenticated;
drop trigger if exists donee_deletion_guard on public.messages;
create trigger donee_deletion_guard before insert or update on public.messages for each row execute function donee_private.guard_group_write();
drop trigger if exists donee_deletion_guard on public.tasks;
create trigger donee_deletion_guard before insert or update on public.tasks for each row execute function donee_private.guard_group_write();
drop trigger if exists donee_deletion_guard on public.group_members;
create trigger donee_deletion_guard before insert or update on public.group_members for each row execute function donee_private.guard_group_write();
drop trigger if exists donee_deletion_guard on storage.objects;
create trigger donee_deletion_guard before insert or update on storage.objects for each row execute function donee_private.guard_group_write();

create or replace function public.donee_rename_group(p_group_id bigint, p_name text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare target public.groups;
begin
  select * into target from public.groups where id=p_group_id for update;
  if auth.uid() is null or target.created_by is distinct from auth.uid() then raise exception 'เฉพาะผู้สร้างกลุ่มเท่านั้น' using errcode='42501'; end if;
  if target.deletion_pending then raise exception 'กลุ่มกำลังถูกลบ'; end if;
  if p_name is null or p_name !~ '[^[:space:]]' or length(btrim(p_name)) not between 1 and 60 then raise exception 'ชื่อกลุ่มต้องมี 1–60 ตัวอักษร'; end if;
  update public.groups set name=btrim(p_name) where id=p_group_id;
  return jsonb_build_object('id',p_group_id::text,'name',btrim(p_name));
end $$;

create or replace function public.donee_begin_delete_group(p_group_id bigint)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare target public.groups;
begin
  select * into target from public.groups where id=p_group_id for update;
  if auth.uid() is null or target.created_by is distinct from auth.uid() then raise exception 'เฉพาะผู้สร้างกลุ่มเท่านั้น' using errcode='42501'; end if;
  -- Refuse unsafe legacy paths rather than delete another group's files.
  if exists(select 1 from public.messages where group_id=p_group_id and file_path is not null and file_path not like p_group_id::text || '/%') then
    raise exception 'พบไฟล์แนบที่อยู่นอกโฟลเดอร์กลุ่ม ให้ผู้ดูแลตรวจ file_path ก่อนลองใหม่';
  end if;
  update public.groups set deletion_pending=true where id=p_group_id;
  -- Bounded batches; subsequent calls resume after partial deletion.
  return coalesce((select jsonb_agg(name order by name) from
    (select name from storage.objects where bucket_id='chat-images' and name like p_group_id::text || '/%' order by name limit 100) files),'[]'::jsonb);
end $$;

create or replace function public.donee_finish_delete_group(p_group_id bigint)
returns boolean language plpgsql security definer set search_path = '' as $$
declare target public.groups;
begin
  select * into target from public.groups where id=p_group_id for update;
  if auth.uid() is null or target.created_by is distinct from auth.uid() then raise exception 'เฉพาะผู้สร้างกลุ่มเท่านั้น' using errcode='42501'; end if;
  if not target.deletion_pending then raise exception 'กรุณาเริ่มลบไฟล์แนบก่อน'; end if;
  if exists(select 1 from storage.objects where bucket_id='chat-images' and name like p_group_id::text || '/%') then
    raise exception 'ยังลบไฟล์แนบไม่ครบ กรุณาลองลบกลุ่มอีกครั้ง';
  end if;
  delete from public.messages where group_id=p_group_id;
  delete from public.tasks where group_id=p_group_id;
  delete from public.group_members where group_id=p_group_id;
  delete from public.groups where id=p_group_id;
  return true;
end $$;

-- No direct client mutation can bypass the owner-checked RPCs.
revoke insert, update, delete on public.groups, public.group_members from authenticated, anon;
revoke all on function public.donee_rename_group(bigint,text), public.donee_begin_delete_group(bigint), public.donee_finish_delete_group(bigint) from public, anon;
grant execute on function public.donee_rename_group(bigint,text), public.donee_begin_delete_group(bigint), public.donee_finish_delete_group(bigint) to authenticated;

create or replace function donee_private.can_delete_group_file(p_name text)
returns boolean language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists(select 1 from public.groups
    where p_name like id::text || '/%' and created_by=auth.uid() and deletion_pending);
$$;
revoke all on function donee_private.can_delete_group_file(text) from public, anon;
grant execute on function donee_private.can_delete_group_file(text) to authenticated;
drop policy if exists donee_group_cleanup_read on storage.objects;
create policy donee_group_cleanup_read on storage.objects for select to authenticated
  using(bucket_id='chat-images' and donee_private.can_delete_group_file(name));
drop policy if exists donee_group_cleanup_delete on storage.objects;
create policy donee_group_cleanup_delete on storage.objects for delete to authenticated
  using(bucket_id='chat-images' and donee_private.can_delete_group_file(name));
drop policy if exists donee_group_cleanup_delete_guard on storage.objects;
create policy donee_group_cleanup_delete_guard on storage.objects as restrictive for delete to public
  using(bucket_id <> 'chat-images' or donee_private.can_delete_group_file(name));
notify pgrst, 'reload schema';
commit;
