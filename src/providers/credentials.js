export default function Credentials(options) {
  return {
    id: "credentials",
    name: "Credentials",
    type: "credentials",
    authorize: null,
    credentials: null,
    options,
  }
}
