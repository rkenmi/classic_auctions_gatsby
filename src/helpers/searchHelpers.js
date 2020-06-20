const qs = require('qs');

export const normalizeParam = (s) => {
  return s.replace(/[^a-zA-Z\s:\\'"]/gi,'');
};

export const normalizeNumber = (n) => {
  const num =  parseInt(n.toString().replace(/[^0-9]/gi,''));
  return num >= 0 ? num : 0;
};

export const capitalizeWord = (s) => {
  return s[0].toUpperCase() + s.substring(1, s.length);
};

export const objectFlip = (obj) => {
  return Object.keys(obj).reduce((ret, key) => {
    ret[obj[key]] = key;
    return ret;
  }, {});
};

export function getParamsFromURL(search) {
  const query = qs.parse(search, { ignoreQueryPrefix: true }).q;
  const page = qs.parse(search, { ignoreQueryPrefix: true }).p;
  const currentRealm = qs.parse(search, { ignoreQueryPrefix: true }).realm;
  const currentFaction = qs.parse(search, { ignoreQueryPrefix: true }).faction;
  const sortField = qs.parse(search, { ignoreQueryPrefix: true }).sortField;
  const sortFieldOrder = parseInt(qs.parse(search, { ignoreQueryPrefix: true }).sortFieldOrder);

  return [query, page, currentRealm, currentFaction, sortField, sortFieldOrder];
}

export function hideSuggestionItemsTooltip() {
  // Remove tooltip if the tooltip is currently hovering
  if (window && window.WH && window.WH.Tooltip) {
    window.WH.Tooltip.hide();
  }
}

export const getColorCode = (quality) => {
  switch(quality) {
    case 'Misc': {
      return '#ffd100';
    }
    case 'Poor': {
      return '#9d9d9d';
    }
    case 'Common': {
      return '#ffffff';
    }
    case 'Uncommon': {
      return '#1eff00';
    }
    case 'Rare': {
      return '#0070dd';
    }
    case 'Epic': {
      return '#a335ee';
    }
    case 'Legendary': {
      return '#ff8000';
    }
    default: {
      return '#ffffff';
    }
  }
};

