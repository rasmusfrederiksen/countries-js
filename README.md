# countries-js

A Javascript library made for looking up countries based on string-input.
Originally made to ease the input of country names, but extended with a ton of info like population, phone extension, iso2/iso3 codes and so on. Data is not complete, so feel free to contribute if you find the missing pieces.

It's all very basic - only a single function is exposed, the `countryLookup`, which takes a string as input and returns the best match out of all the possibilities - weighted by population and things like whether the country name begins with the supplied string. The exact algorithm is a result of some trial-and-error. It's not perfect, but it works well, except for "Oman" where the algorithm insist you MUST mean "Romania". Ah well. Feel free to contribute here as well. I don't know anyone from Oman, so I've just pretended the problem isn't there, like a good little imperialist.

You can of course just use the `countries.js` file as-is and build your own stuff on top of it, but I'd prefer it if you contributed back to this tiny project.
