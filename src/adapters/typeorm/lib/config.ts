import { EntitySchema } from 'typeorm'

interface MongoConfig {
  type: "mongodb";
  url: string;
  useNewUrlParser: boolean;
  useUnifiedTopology: true;
}

interface ElseConfig {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

type Config = Record<string, unknown> & (MongoConfig | ElseConfig);

const parseConnectionString = (configString: string) => {
  if (typeof configString !== 'string') { return configString }

  // If the input is URL string, automatically convert the string to an object
  // to make configuration easier (in most use cases).
  //
  // TypeORM accepts connection string as a 'url' option, but unfortunately
  // not for all databases (e.g. SQLite) or for all options, so we handle
  // parsing it in this function.
  try {
    const parsedUrl = new URL(configString)
    const config: Config = (() => {
      if (parsedUrl.protocol.startsWith('mongodb+srv')) {
        // Special case handling is required for mongodb+srv with TypeORM
        return {
          type: 'mongodb',
          url: configString.replace(/\?(.*)$/, ''),
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      }
      
      return {
        type: parsedUrl.protocol.replace(/:$/, ''),
        host: parsedUrl.hostname,
        port: Number(parsedUrl.port),
        username: parsedUrl.username,
        password: parsedUrl.password,
        database: parsedUrl.pathname.replace(/^\//, '').replace(/\?(.*)$/, ''),
      }
    })()

    if (parsedUrl.search) {
      parsedUrl.search.replace(/^\?/, '').split('&').forEach(keyValuePair => {
        let [key, value] = keyValuePair.split('=')
        // Converts true/false strings to actual boolean values
        config[key] = value === "true";
      })
    }

    return config
  } catch (error) {
    // If URL parsing fails for any reason, try letting TypeORM handle it
    return {
      url: configString
    }
  }
}

const loadConfig = (config: Config, { models, namingStrategy }) => {
  const defaultConfig = {
    name: 'default',
    autoLoadEntities: true,
    entities: [
      new EntitySchema(models.User.schema),
      new EntitySchema(models.Account.schema),
      new EntitySchema(models.Session.schema),
      new EntitySchema(models.VerificationRequest.schema)
    ],
    timezone: 'Z', // Required for timestamps to be treated as UTC in MySQL
    logging: false,
    namingStrategy
  }

  return {
    ...defaultConfig,
    ...config
  }
}

export default {
  parseConnectionString,
  loadConfig
}
