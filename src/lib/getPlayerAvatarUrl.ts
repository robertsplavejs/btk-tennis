const importedPlayerAvatars: Record<string, string> = {
  "Roberts Pļāvējs": "/demo/roberts.webp",
  "Artis Budze": "/player-avatars/artis-budze.webp",
  "Dāgs Markuss Vilciņš": "/player-avatars/dags-markuss-vilcins.webp",
  "Edmunds Zīlnieks": "/player-avatars/edmunds-zilnieks.webp",
  "Gatis Liepiņš": "/player-avatars/gatis-liepins.webp",
  "Jānis Paikens": "/player-avatars/janis-paikens.webp",
  "Juris Stokmanis-Blaus": "/player-avatars/juris-stokmanis-blaus.webp",
  "Kārlis Krisbergs": "/player-avatars/karlis-krisbergs.webp",
  "Kaspars Ekša": "/player-avatars/kaspars-eksa.webp",
  "Kaspars Gražulis": "/player-avatars/kaspars-grazulis.webp",
  "Krišjānis Stokmanis-Blaus": "/player-avatars/krisjanis-stokmanis-blaus.webp",
  "Mārtiņš Palejs": "/player-avatars/martins-palejs.webp",
  "Rainers Helds": "/player-avatars/rainers-helds.webp",
  "Ralfs Zvirbulis": "/player-avatars/ralfs-zvirbulis.webp",
  "Rihards Plūme": "/player-avatars/rihards-plume.webp",
  "Roberts Jaunzems-Pētersons": "/player-avatars/roberts-jaunzems-petersons.webp",
  "Rolands Laizāns": "/player-avatars/rolands-laizans.webp",
  "Sergejs Andrijevskis": "/player-avatars/sergejs-andrijevskis.webp",
  "Žans Kirejevs": "/player-avatars/zans-kirejevs.webp",
};

export function getPlayerAvatarUrl(
  fullName: string,
  storedAvatarUrl?: string | null
) {
  return storedAvatarUrl ?? importedPlayerAvatars[fullName];
}
