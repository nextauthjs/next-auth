import MicrosoftEntra, {type MicrosoftEntraIDOptions, type MicrosoftEntraIDProfile} from './microsoft-entra-id'
import type {OAuthConfig} from "./oauth";

type AzureADOptions<P extends MicrosoftEntraIDProfile> = MicrosoftEntraIDOptions<P>

/**
 * @deprecated
 * Azure Active Directory is now Mixcrosoft Entra ID.
 * Import this provider from the `providers/microsoft-entra-id` submodule instead of `providers/azure-ad`.
 *
 * To log in with nodemailer, change `signIn("email")` to `signIn("nodemailer")`
 */
export default function AzureAd<P extends MicrosoftEntraIDProfile>(
    options: AzureADOptions<P>
): OAuthConfig<P> {
    return {
        ...MicrosoftEntra(options),
        id: 'azure-ad',
        name: 'Azure Active Directory'
    }
}