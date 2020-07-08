export default (options) => {
  return {
    id: "webhook",
    type: "webhook",
    name: "Webhook",
    maxAge: 24 * 60 * 60, // How long link are valid for (default 24h)
    ...options,
    sendVerificationRequest: ({
      identifier,
      value,
      url,
      token,
      site,
      provider,
    }) => {
      console.log(identifier, url);
    },
  };
};
