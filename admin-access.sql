begin;

alter table public.profiles enable row level security;
alter table public.cars enable row level security;
alter table public.inquiries enable row level security;

drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Limit profile reads to admins and profile owners" on public.profiles;

create policy "Admins can view all profiles"
  on public.profiles for select to authenticated
  using (lower((select auth.jwt() ->> 'email')) in (
    'hyellaudaedward@gmail.com',
    'eddygsk2018@gmail.com'
  ));

create policy "Limit profile reads to admins and profile owners"
  on public.profiles as restrictive for select to public
  using (
    (select auth.uid()) = id
    or lower((select auth.jwt() ->> 'email')) in (
      'hyellaudaedward@gmail.com',
      'eddygsk2018@gmail.com'
    )
  );

drop policy if exists "Admins can read cars" on public.cars;
drop policy if exists "Only admins can read cars" on public.cars;

create policy "Admins can read cars"
  on public.cars for select to authenticated
  using (lower((select auth.jwt() ->> 'email')) in (
    'hyellaudaedward@gmail.com',
    'eddygsk2018@gmail.com'
  ));

create policy "Only admins can read cars"
  on public.cars as restrictive for select to public
  using (lower((select auth.jwt() ->> 'email')) in (
    'hyellaudaedward@gmail.com',
    'eddygsk2018@gmail.com'
  ));

drop policy if exists "Admins can read inquiries" on public.inquiries;
drop policy if exists "Only admins can read inquiries" on public.inquiries;

create policy "Admins can read inquiries"
  on public.inquiries for select to authenticated
  using (lower((select auth.jwt() ->> 'email')) in (
    'hyellaudaedward@gmail.com',
    'eddygsk2018@gmail.com'
  ));

create policy "Only admins can read inquiries"
  on public.inquiries as restrictive for select to public
  using (lower((select auth.jwt() ->> 'email')) in (
    'hyellaudaedward@gmail.com',
    'eddygsk2018@gmail.com'
  ));

grant select on table public.profiles, public.cars, public.inquiries to authenticated;

commit;
