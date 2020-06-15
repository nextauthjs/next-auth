import logger from '../../lib/logger'

export default async (event, message) => {
  try {
    await event(message)
  } catch (e) {
    logger.error('EVENT_ERROR', e)
  }
}
