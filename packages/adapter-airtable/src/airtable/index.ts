import Airtable from "airtable"
import Account from "./account"
import User from "./user"
import Session from "./session"
import Verification from "./verification"

export interface AirtableAdapterOptions {
  apiKey: string
  baseId: string
}

export default function AirtableModel({
  apiKey,
  baseId,
}: AirtableAdapterOptions): any {
  if (!apiKey || !baseId) throw Error("Missing apiKey or baseId")
  const airtable = new Airtable({ apiKey })
  const base = airtable.base(baseId)

  return {
    account: Account(base),
    user: User(base),
    session: Session(base),
    verification: Verification(base),
  }
}
