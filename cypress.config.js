// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://proud-mud-0b66be61e.6.azurestaticapps.net/api/login',
  },
});
