import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = (event) => {
  console.log('layout server load', event.locals.getSession)
  let session
  if (event.locals.getSession)
   {
  session = event.locals.getSession()

   }
  return {
    session,
  }
}
