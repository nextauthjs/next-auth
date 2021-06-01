export function getBroadcastEvents() {
  return window.localStorage.setItem.mock.calls
    .filter((call) => call[0] === "nextauth.message")
    .map(([eventName, value]) => {
      const { timestamp, ...rest } = JSON.parse(value)
      return { eventName, value: rest }
    })
}
