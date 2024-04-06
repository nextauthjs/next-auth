import { Auth, setEnvDefaults, type AuthConfig } from "@auth/core"
import Apple from "@auth/core/providers/apple"
import Auth0 from "@auth/core/providers/auth0"
import AzureDevops from "@auth/core/providers/azure-devops"
import Cognito from "@auth/core/providers/cognito"
import Facebook from "@auth/core/providers/facebook"
import GitHub from "@auth/core/providers/github"
import Google from "@auth/core/providers/google"
import LinkedIn from "@auth/core/providers/linkedin"
import Passage from "@auth/core/providers/passage"
import Pinterest from "@auth/core/providers/pinterest"
import Twitch from "@auth/core/providers/twitch"
import Twitter from "@auth/core/providers/twitter"

const authConfig: AuthConfig = {
  providers: [
    Apple,
    Auth0,
    AzureDevops,
    Cognito,
    Facebook,
    GitHub,
    Google,
    LinkedIn,
    Passage,
    Pinterest,
    Twitch,
    Twitter,
  ],
  basePath: "/api",
}
setEnvDefaults(process.env, authConfig)

export default function handler(req: Request) {
  return Auth(req, authConfig)
}

export const config = { runtime: "edge" }
