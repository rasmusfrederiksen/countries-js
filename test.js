let countries = require('./countries');
const fs = require('fs');

for (let i = 0; i < countries.length; i++) {
  let c = countries[i];
  console.log(`${c.names[0]} - ${c.iso2}/${c.iso3} - ${c.population}`);
}

