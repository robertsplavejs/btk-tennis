const importedPlayerAvatars: Record<string, string> = {
  "Roberts Pļāvējs": "/demo/roberts.jpg",
  "Artis Budze": "/player-avatars/artis-budze.jpg",
  "Dāgs Markuss Vilciņš": "/player-avatars/dags-markuss-vilcins.jpg",
  "Edmunds Zīlnieks": "/player-avatars/edmunds-zilnieks.jpg",
  "Gatis Liepiņš": "/player-avatars/gatis-liepins.jpeg",
  "Jānis Paikens": "/player-avatars/janis-paikens.jpg",
  "Juris Stokmanis-Blaus": "/player-avatars/juris-stokmanis-blaus.jpeg",
  "Kārlis Krisbergs": "/player-avatars/karlis-krisbergs.jpg",
  "Kaspars Ekša": "/player-avatars/kaspars-eksa.png",
  "Kaspars Gražulis": "/player-avatars/kaspars-grazulis.jpg",
  "Krišjānis Stokmanis-Blaus": "/player-avatars/krisjanis-stokmanis-blaus.jpg",
  "Mārtiņš Palejs": "/player-avatars/martins-palejs.jpg",
  "Rainers Helds": "/player-avatars/rainers-helds.jpg",
  "Ralfs Zvirbulis": "/player-avatars/ralfs-zvirbulis.png",
  "Rihards Plūme": "/player-avatars/rihards-plume.png",
  "Roberts Jaunzems-Pētersons": "/player-avatars/roberts-jaunzems-petersons.png",
  "Rolands Laizāns": "/player-avatars/rolands-laizans.png",
  "Sergejs Andrijevskis": "/player-avatars/sergejs-andrijevskis.jpg",
  "Žans Kirejevs": "/player-avatars/zans-kirejevs.png",
};

export function getPlayerAvatarUrl(
  fullName: string,
  storedAvatarUrl?: string | null
) {
  return storedAvatarUrl ?? importedPlayerAvatars[fullName];
}
