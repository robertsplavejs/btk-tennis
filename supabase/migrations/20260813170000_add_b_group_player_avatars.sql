update public.players
set avatar_url = case full_name
  when 'Roberts Pļāvējs' then '/demo/roberts.jpg'
  when 'Artis Budze' then '/player-avatars/artis-budze.jpg'
  when 'Dāgs Markuss Vilciņš' then '/player-avatars/dags-markuss-vilcins.jpg'
  when 'Edmunds Zīlnieks' then '/player-avatars/edmunds-zilnieks.jpg'
  when 'Gatis Liepiņš' then '/player-avatars/gatis-liepins.jpeg'
  when 'Jānis Paikens' then '/player-avatars/janis-paikens.jpg'
  when 'Juris Stokmanis-Blaus' then '/player-avatars/juris-stokmanis-blaus.jpeg'
  when 'Kārlis Krisbergs' then '/player-avatars/karlis-krisbergs.jpg'
  when 'Kaspars Ekša' then '/player-avatars/kaspars-eksa.png'
  when 'Kaspars Gražulis' then '/player-avatars/kaspars-grazulis.jpg'
  when 'Krišjānis Stokmanis-Blaus' then '/player-avatars/krisjanis-stokmanis-blaus.jpg'
  when 'Mārtiņš Palejs' then '/player-avatars/martins-palejs.jpg'
  when 'Rainers Helds' then '/player-avatars/rainers-helds.jpg'
  when 'Ralfs Zvirbulis' then '/player-avatars/ralfs-zvirbulis.png'
  when 'Rihards Plūme' then '/player-avatars/rihards-plume.png'
  when 'Roberts Jaunzems-Pētersons' then '/player-avatars/roberts-jaunzems-petersons.png'
  when 'Rolands Laizāns' then '/player-avatars/rolands-laizans.png'
  when 'Sergejs Andrijevskis' then '/player-avatars/sergejs-andrijevskis.jpg'
  when 'Žans Kirejevs' then '/player-avatars/zans-kirejevs.png'
  else avatar_url
end
where full_name in (
  'Roberts Pļāvējs', 'Artis Budze', 'Dāgs Markuss Vilciņš', 'Edmunds Zīlnieks',
  'Gatis Liepiņš', 'Jānis Paikens', 'Juris Stokmanis-Blaus',
  'Kārlis Krisbergs', 'Kaspars Ekša', 'Kaspars Gražulis',
  'Krišjānis Stokmanis-Blaus', 'Mārtiņš Palejs', 'Rainers Helds',
  'Ralfs Zvirbulis', 'Rihards Plūme', 'Roberts Jaunzems-Pētersons',
  'Rolands Laizāns', 'Sergejs Andrijevskis', 'Žans Kirejevs'
);

do $$
begin
  if (
    select count(*)
    from public.players
    where avatar_url like '/player-avatars/%'
  ) < 18 then
    raise exception 'Neizdevās sasaistīt visas 18 B grupas spēlētāju bildes.';
  end if;
end;
$$;
