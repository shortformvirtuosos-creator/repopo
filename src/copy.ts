// Every word a visitor reads lives here. Bosnian, latin script, ijekavica.

export const YEAR = new Date().getFullYear()

export type FinishId = 'bakar' | 'kalaj' | 'crna' | 'mesing'

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

  hero: {
    lines: ['NIJE TURSKA.', 'BOSANSKA JE.'],
    sub: 'Ručno kovana džezva s tvojim prezimenom.',
    cta: 'Upiši prezime',
    hint: 'Povuci dolje',
    // Shown when someone opens a shared link.
    sharedLines: (surnameUpper: string) => ['DŽEZVA PORODICE', `${surnameUpper}.`],
    sharedCta: 'Napravi svoju',
  },

  engrave: {
    headline: 'ČIJA JE OVO DŽEZVA?',
    surname: 'Prezime',
    town: 'Grad',
    live: (p: string, g: string) => (g ? `Džezva porodice ${p}. ${g}.` : `Džezva porodice ${p}.`),
    share: 'Podijeli',
    examples: [
      ['Hodžić', 'Zenica'],
      ['Kovačević', 'Banja Luka'],
      ['Marić', 'Mostar'],
      ['Begić', 'Tuzla'],
      ['Jurić', 'Livno'],
      ['Petrović', 'Bijeljina'],
    ] as [string, string][],
    // The two engraved lines on the džezva.
    line1: (surnameUpper: string) => (surnameUpper ? `PORODICA ${surnameUpper}` : 'PORODICA'),
    line2: (townUpper: string, year: number) => (townUpper ? `${townUpper} · ${year}` : `${year}`),
  },

  finish: {
    headline: 'ODABERI SVOJU.',
    items: {
      bakar: { name: 'Bakar', line: 'Klasika. Ista kakvu pamtiš iz djetinjstva.' },
      kalaj: { name: 'Kalaj', line: 'Srebrni sjaj. Za one koji vole drugačije.' },
      crna: { name: 'Crna', line: 'Mat crna, bakren rub.' },
      mesing: { name: 'Mesing', line: 'Zlatna boja. Za poklon koji se pamti.' },
    } as Record<FinishId, { name: string; line: string }>,
  },

  features: [
    { title: 'KOVANA RUKOM.', body: 'Svaki udarac čekića je ručni. Zato na svijetu nema dvije iste.' },
    { title: 'USKO GRLO.', body: 'Usko grlo čuva pjenu. A bez pjene nije kafa.' },
    { title: 'KALAJ IZNUTRA.', body: 'Iznutra je kalajisana, kako se radi oduvijek. Kafa ne dira bakar.' },
  ],

  pour: {
    headline: 'PRVO PJENA. PA PRIČA.',
    hint: 'Drži da sipaš',
    after: 'Kafa se ne pije s nogu.',
    afterSmall: 'Ko žuri, nek pije nes.',
  },

  set: {
    headline: 'DOĐI NA KAFU.',
  },

  ending: {
    headline: ['TVOJE PREZIME.', 'TVOJA DŽEZVA.'],
    share: 'Podijeli',
    instagram: 'Hoćeš pravu? Javi se na Instagramu.',
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
    // Small functional labels (not part of the brief's copy).
    copied: 'Kopirano',
    save: 'Sačuvaj sliku',
    close: 'Zatvori',
  },

  a11y: {
    prev: 'Prethodna',
    next: 'Sljedeća',
  },
}
