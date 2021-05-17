export const constants = {

};

export const TIME_REMAINING = ['Short', 'Medium', 'Long', 'Very Long'];

export const SEO_DESCRIPTION = 'Search engine for Auction House pricing data and graphs on Classic WoW';
export const SORT_FIELDS = {
  BID: 'bid',
  BUYOUT: 'buyout',
  QUANTITY: 'quantity',
  PRICE: 'price',  // TODO: remove this
};

export const SORT_FIELDS_DISPLAY_NAMES = {
  [SORT_FIELDS.QUANTITY]: 'Name',
  [SORT_FIELDS.BUYOUT]: 'Buyout',
  [SORT_FIELDS.BID]: 'Bid',
  [SORT_FIELDS.PRICE]: 'Price',  // TODO: remove this
};

export const SORT_ORDERS = {
  NONE: 0,
  DESCENDING: 1,
  ASCENDING: 2,
};

export const TIMESPAN_DISPLAY = [
  'Last 12 Hours',
  'Last Week',
  'Last Month',
];

export const REALMS = {
  US_WEST: [
    "Anathema",
    "Arcanite Reaper",
    "Arugal",
    "Ashkandi",
    "Atiesh",
    "Azuresong",
    "Benediction",
    "Bigglesworth",
    "Blaumeux",
    "Bloodsail Buccaneers",
    "Deviate Delight",
    "Earthfury",
    "Faerlina",
    "Fairbanks",
    "Felstriker",
    "Grobbulus",
    "Heartseeker",
    "Herod",
    "Incendius",
    "Kirtonos",
    "Kromcrush",
    "Kurinnaxx",
    "Loatheb",
    "Mankrik",
    "Myzrael",
    "Netherwind",
    "Old Blanchy",
    "Pagle",
    "Rattlegore",
    "Remulos",
    "Skeram",
    "Smolderweb",
    "Stalagg",
    "Sul'thraze",
    "Sulfuras",
    "Thalnos",
    "Thunderfury",
    "Westfall",
    "Whitemane",
    "Windseeker",
    "Yojamba"
  ]
};
