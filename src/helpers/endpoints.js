export const CLASSIC_AH_API = process.env.API_URL;
export const TINY_ICON_URL = 'https://d2b9gcya89vi12.cloudfront.net/ico/tiny/';
export const MISC_URL = 'https://d2b9gcya89vi12.cloudfront.net/ico/misc/';
export const FOUR_O_FOUR = 'https://i.kym-cdn.com/photos/images/newsfeed/001/398/839/b4d.jpg';
export const BIG_ICON_ITEM_URL = 'https://render-classic-us.worldofwarcraft.com/icons/56/';

// Images
export const SOCKET = MISC_URL + 'socket-lg.png';

export const getItemPageLink = (id, currentRealm, currentFaction) => {
  return `/item/${id}/?realm=${currentRealm}&faction=${currentFaction}`;
};
