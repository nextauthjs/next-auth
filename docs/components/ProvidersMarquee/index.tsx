import React from "react"

// --- Reusable Provider Icon Component ---
const ProviderIcon = ({ name }) => (
  <div className="group relative mx-4 flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg border border-black/5 bg-black/10 backdrop-blur-sm lg:h-32 lg:w-32 dark:border-white/10 dark:bg-white/5">
    <img
      src={`../img/providers/${name}.svg`}
      alt={name}
      className="dark:filter-white h-8 w-8 lg:h-12 lg:w-12"
      // Fix: Cast the event target to HTMLImageElement to access style properties
      onError={(e) => {
        ;(e.currentTarget as HTMLImageElement).style.display = "none"
      }}
    />
    {/* Floating tag that appears on hover */}
    <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 scale-0 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
      <div className="whitespace-nowrap rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-200">
        {name}.svg
      </div>
      {/* Tooltip arrow */}
      <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-neutral-700"></div>
    </div>
  </div>
)

// --- Main ProviderMarquee Component ---
const ProviderMarquee = () => {
  // The complete list of provider icons from the directory
  const providers = [
    "42-school",
    "apple",
    "asgardeo",
    "atlassian",
    "auth0",
    "authentik",
    "azure-ad-b2c",
    "azure-ad",
    "azure-devops",
    "azure",
    "bankid-no",
    "battlenet",
    "beyondidentity",
    "bitbucket",
    "box",
    "boxyhq-saml",
    "bungie",
    "click-up",
    "cognito",
    "coinbase",
    "concept2",
    "descope",
    "discord",
    "dribbble",
    "dropbox",
    "duende-identityserver-6",
    "eventbrite",
    "eveonline",
    "facebook",
    "faceit",
    "figma",
    "forwardemail",
    "foursquare",
    "freshbooks",
    "frontegg",
    "fusionauth",
    "github",
    "gitlab",
    "google",
    "hubspot",
    "huggingface",
    "identity-server4",
    "instagram",
    "kakao",
    "keycloak",
    "kinde",
    "line",
    "linkedin",
    "logto",
    "loops",
    "mailchimp",
    "mailgun",
    "mailru",
    "mastodon",
    "mattermost",
    "medium",
    "microsoft-entra-id",
    "naver",
    "netlify",
    "netsuite",
    "nextcloud",
    "nodemailer",
    "notion",
    "okta",
    "onelogin",
    "osso",
    "osu",
    "passage",
    "passkey",
    "patreon",
    "ping-id",
    "pinterest",
    "pipedrive",
    "postmark",
    "reddit",
    "resend",
    "roblox",
    "sailpoint",
    "salesforce",
    "sendgrid",
    "simplelogin",
    "slack",
    "spotify",
    "strava",
    "threads",
    "tiktok",
    "todoist",
    "trakt",
    "twitch",
    "twitter",
    "united-effects",
    "vercel",
    "vipps-mobilepay",
    "vipps",
    "vk",
    "webex",
    "wechat",
    "wikimedia",
    "wordpress",
    "workos",
    "yandex",
    "zitadel",
    "zoho",
    "zoom",
  ]

  // Split providers into four rows for the marquee
  const quarter = Math.ceil(providers.length / 4)
  const row1 = providers.slice(0, quarter)
  const row2 = providers.slice(quarter, quarter * 2)
  const row3 = providers.slice(quarter * 2, quarter * 3)
  const row4 = providers.slice(quarter * 3)

  return (
    <div className="relative w-full overflow-hidden py-16">
      <div className="flex flex-col gap-8">
        {/* Row 1, scrolling left */}
        <div className="animate-scroll-left flex min-w-full flex-shrink-0">
          {row1.map((name, i) => (
            <ProviderIcon key={`r1-${i}`} name={name} />
          ))}
          {/* Duplicate for infinite effect */}
          {row1.map((name, i) => (
            <ProviderIcon key={`r1-dup-${i}`} name={name} />
          ))}
        </div>

        {/* Row 2, scrolling right */}
        <div className="animate-scroll-right flex min-w-full flex-shrink-0">
          {row2.map((name, i) => (
            <ProviderIcon key={`r2-${i}`} name={name} />
          ))}
          {/* Duplicate for infinite effect */}
          {row2.map((name, i) => (
            <ProviderIcon key={`r2-dup-${i}`} name={name} />
          ))}
        </div>

        {/* Row 3, scrolling left */}
        <div className="animate-scroll-left flex min-w-full flex-shrink-0">
          {row3.map((name, i) => (
            <ProviderIcon key={`r3-${i}`} name={name} />
          ))}
          {/* Duplicate for infinite effect */}
          {row3.map((name, i) => (
            <ProviderIcon key={`r3-dup-${i}`} name={name} />
          ))}
        </div>

        {/* Row 4, scrolling right */}
        <div className="animate-scroll-right flex min-w-full flex-shrink-0">
          {row4.map((name, i) => (
            <ProviderIcon key={`r4-${i}`} name={name} />
          ))}
          {/* Duplicate for infinite effect */}
          {row4.map((name, i) => (
            <ProviderIcon key={`r4-dup-${i}`} name={name} />
          ))}
        </div>
      </div>

      {/* CSS for animations and image filter */}
      <style>
        {`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll-left {
            animation: scroll-left 15s linear infinite;
          }
          
          @keyframes scroll-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-scroll-right {
            animation: scroll-right 15s linear infinite;
          }

          @media (min-width: 1024px) {
            .animate-scroll-left {
              animation-duration: 75s;
            }
            .animate-scroll-right {
              animation-duration: 75s;
            }
          }

          .filter-white {
            filter: brightness(0) invert(1);
          }
        `}
      </style>
    </div>
  )
}

// --- Example Usage in a Page ---
const App = () => {
  return (
    <div className="bg-black">
      {/* Other sections of your landing page */}
      <ProviderMarquee />
      {/* Other sections of your landing page */}
    </div>
  )
}

export default ProviderMarquee
