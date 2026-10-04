// Every word a visitor reads lives here. Bosnian, latin script, ijekavica.

export const YEAR = new Date().getFullYear()

export const copy = {
  meta: {
    title: 'ĆEIF · Nije turska. Bosanska je.',
    ogTitle: 'Nije turska. Bosanska je.',
    ogDescription: 'Upiši prezime i vidi svoju džezvu.',
  },

  chrome: {
    wordmark: 'ćeif',
    share: 'Podijeli',
  },

  loader: {
    unit: '°C',
    heating: 'Voda se grije…',
    boiled: 'Proključalo.',
  },

  // 1. the džezva with your name
  pot: {
    lines: ['NIJE TURSKA.', 'BOSANSKA JE.'],
    sub: 'Ručno kovana džezva s tvojim prezimenom.',
    // Shown when someone opens a shared link.
    sharedLines: (surnameUpper: string) => ['DŽEZVA PORODICE', `${surnameUpper}.`],
    sharedCta: 'Napravi svoju',
  },

  engrave: {
    surname: 'Prezime',
    town: 'Grad',
    live: (p: string, g: string) => (g ? `Džezva porodice ${p}. ${g}.` : `Džezva porodice ${p}.`),
    share: 'Podijeli',
    // Engraved in turn while the fields are empty.
    examples: [
      ['Hodžić', 'Zenica'],
      ['Kovačević', 'Banja Luka'],
      ['Marić', 'Mostar'],
      ['Begić', 'Tuzla'],
      ['Jurić', 'Livno'],
      ['Petrović', 'Bijeljina'],
    ] as [string, string][],
    // The two engraved lines on the band.
    line1: (surnameUpper: string) => (surnameUpper ? `PORODICA ${surnameUpper}` : 'PORODICA'),
    line2: (townUpper: string, year: number) => (townUpper ? `${townUpper} · ${year}` : `${year}`),
  },

  // 2. the explosion
  explosion: {
    lines: ['KAFA SE', 'NE PIJE', 'S NOGU.'],
    phoneLines: ['KAFA SE', 'NE PIJE', 'S NOGU.'],
    small: 'Ko žuri, nek pije nes.',
  },

  // 3. hammered copper
  copper: {
    lines: ['KOVANA', 'RUKOM.'],
    phoneLines: ['KOVANA RUKOM.'],
    body: 'Svaki udarac čekića je ručni. Zato na svijetu nema dvije iste.',
  },

  // 4. the pour
  pour: {
    lines: ['PRVO', 'PJENA.', 'PA PRIČA.'],
    phoneLines: ['PRVO PJENA.', 'PA PRIČA.'],
    body: 'Usko grlo čuva pjenu. A bez pjene nije kafa.',
  },

  // 5. the set
  set: {
    lines: ['DOĐI NA', 'KAFU.'],
  },

  ending: {
    lines: ['TVOJE', 'PREZIME.', 'TVOJA', 'DŽEZVA.'],
    phoneLines: ['TVOJE PREZIME.', 'TVOJA DŽEZVA.'],
    share: 'Podijeli',
    footer: (year: number) => `ćeif · ${year}`,
  },

  shareImage: {
    title: 'DŽEZVA PORODICE',
    bottom: 'Dođi na kafu.',
  },

  shareText: (link: string) => `Evo naše džezve. Dođi na kafu. ${link}`,

  shareSheet: {
    hold: 'Drži prst na slici da je sačuvaš',
    copyLink: 'Kopiraj link',
    // Small functional labels.
    copied: 'Kopirano',
    save: 'Sačuvaj sliku',
    close: 'Zatvori',
  },
}
