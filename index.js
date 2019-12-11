let countries = require('./countries');

const hashCode = function (str) {
  if (typeof str !== 'string') {
    str = JSON.stringify(str);
  }
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

countries.forEach((country) => {
  country.hash = hashCode(country);
  country.population = country.hasOwnProperty('population') ? country.population : 0;
});

const totalPopulation = countries.reduce((total, country) => total + country.population, 0);

countries.forEach((country) => {
  country.populationPercentage = country.population / totalPopulation * 100;
});

const iso2Lookup = {};
const iso3Lookup = {};
const nameLookup = {};
countries.forEach((e) => {
  let k2 = e.iso2;
  let k3 = e.iso3;
  let names = e.names;
  iso2Lookup[k2] = e;
  iso3Lookup[k3] = e;
  names.forEach((name) => {
    nameLookup[name] = e;
  });
});

const iso2Keys = Object.keys(iso2Lookup);
const iso3Keys = Object.keys(iso3Lookup);
const nameKeys = Object.keys(nameLookup);

const countryLookup = (str, noOfResults = 3) => {
  const upperStr = str.toUpperCase();
  results = {};
  if (str.length === 2) {
    const iso2Index = iso2Keys.indexOf(upperStr);
    if (iso2Index !== -1) {
      const country = iso2Lookup[iso2Keys[iso2Index]];
      if (!results.hasOwnProperty(country.hash) || results[country.hash].score < 1) {
        results[country.hash] = { score: 1, country };
      }
    }
  }
  if (str.length === 3) {
    const iso3Index = iso3Keys.indexOf(upperStr);
    if (iso3Index !== -1) {
      const country = iso3Lookup[iso3Keys[iso3Index]];
      if (!results.hasOwnProperty(country.hash) || results[country.hash].score < 1) {
        results[country.hash] = { score: 1, country };
      }
    }
  }
  nameKeys.forEach((name) => {
    const upperName = name.toUpperCase();
    let score = 0;
    if (upperName.includes(upperStr)) {
      score = 0.5;
      if (upperName.startsWith(upperStr)) {
        score = 0.90;
        if (upperName === upperStr) {
          score = 1;
        }
      }
      country = nameLookup[name];
      if (!results.hasOwnProperty(country.hash) || results[country.hash].score < score) {
        results[country.hash] = { score, country };
      }
    }
  });

  results = Object.entries(results)
  .map(e => e[1]) // Get rid of the hashes
  .map(e => { // scale score by population percentage
    e.country.score_raw = e.score;
    e.score *= e.country.populationPercentage;
    e.country.score_weighted = e.score;
    return e;
  })
  .sort((a, b) => { // Sort descending by weighted score
    if (a.score > b.score) return -1;
    if (a.score < b.score) return 1;
    return 0;
  })
  .map(e => e.country)
  .slice(0, noOfResults);

  return results;
};

module.exports = countryLookup;
