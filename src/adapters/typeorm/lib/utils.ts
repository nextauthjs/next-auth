const entitiesChanged = (prevEntities, newEntities) => {
  if (prevEntities.length !== newEntities.length) return true
  for (let i = 0; i < prevEntities.length; i++) {
    if (prevEntities[i] !== newEntities[i]) return true
  }
  return false
}

export const updateConnectionEntities = async (connection, entities) => {
  // Check if the entities passed have changed and if so replace them
  // and re-sync the typeorm connection.
  if (!connection || !entitiesChanged(connection.options.entities, entities)) return
  connection.options.entities = entities
  connection.buildMetadatas()
  if (connection.options.synchronize) {
    await connection.synchronize()
  }
}
