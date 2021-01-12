const providers = require('./providers.json')
module.exports = {
  sidebar: {
    'Getting Started': [
      'getting-started/introduction',
      'getting-started/example',
      'getting-started/client',
      'getting-started/rest-api',
      'getting-started/typescript'
    ],
    Configuration: [
      'configuration/options',
      'configuration/providers',
      'configuration/databases',
      'configuration/pages',
      'configuration/callbacks',
      'configuration/events'
    ],
    'Models & Schemas': [
      'schemas/models',
      'schemas/mysql',
      'schemas/postgres',
      'schemas/mssql',
      'schemas/mongodb',
      'schemas/adapters'
    ],
    'Authentication Providers': Object.entries(providers)
      .sort(([, a], [, b]) => a.localeCompare(b))
      .map(([provider]) => `providers/${provider}`)
  }
}
