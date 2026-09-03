alter table public.properties
  add column if not exists hero_enabled boolean not null default false,
  add column if not exists hero_order smallint;

alter table public.properties
  drop constraint if exists properties_hero_order_check;

alter table public.properties
  add constraint properties_hero_order_check
  check (hero_order is null or hero_order between 1 and 5);

comment on column public.properties.hero_enabled is
  'Define se o imóvel participa do carrossel editorial da página Imóveis.';

comment on column public.properties.hero_order is
  'Posição editorial do imóvel no carrossel, de 1 a 5.';
