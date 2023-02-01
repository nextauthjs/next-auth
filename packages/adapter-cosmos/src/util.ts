export function exceptSystemGenerated(value: any) {
  const { _etag, _rid, _self, _ts, _attachments, ...others } = value
  return others
}

export function convertTime(value: any) {
  if (value.expires !== undefined) {
    return { ...value, expires: new Date(value.expires) }
  }
  if (value.emailVerified !== undefined) {
    return { ...value, emailVerified: new Date(value.emailVerified) }
  }
  return value
}

export function convertCosmosDocument(value: unknown) {
  return convertTime(exceptSystemGenerated(value))
}
