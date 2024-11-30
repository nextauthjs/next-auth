/**
 * <div class="provider" style={{backgroundColor: "#0072c6", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Azure AD</b> integration.</span>
 * <a href="https://learn.microsoft.com/en-us/azure/active-directory">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/azure-ad.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/azure-ad
 */
import MicrosoftEntraID, {
  MicrosoftEntraIDProfile,
} from "./microsoft-entra-id.js"

export type AzureADProfile = MicrosoftEntraIDProfile

/**
 * @deprecated
 * Azure Active Directory has been renamed to [Microsoft Entra ID](/getting-started/providers/microsoft-entra-id).
 * Import this provider from the `providers/microsoft-entra-id` submodule instead of `providers/azure-ad`.
 */
export default function AzureAD(
  config: Parameters<typeof MicrosoftEntraID>[0]
): ReturnType<typeof MicrosoftEntraID> {
  return {
    ...MicrosoftEntraID(config),
    id: "azure-ad",
    name: "Azure Active Directory",
  }
}
