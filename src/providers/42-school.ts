import { OAuthConfig, OAuthUserConfig } from "./oauth"

interface UserData {
  id: number
  email: string
  login: string
  first_name: string
  last_name: string
  usual_full_name: null | string
  usual_first_name: null | string
  url: string
  phone: "hidden" | string | null
  displayname: string
  image_url: string | null
  "staff?": boolean
  correction_point: number
  pool_month: string | null
  pool_year: string | null
  location: string | null
  wallet: number
  anonymize_date: string
  created_at: string
  updated_at: string | null
  alumni: boolean
  "is_launched?": boolean
}

interface CursusUsers {
  grade: string | null
  level: number
  skills: [{ id: number; name: string; level: number }]
  blackholed_at: string | null
  id: number
  begin_at: string | null
  end_at: string | null
  cursus_id: number
  has_coalition: boolean
  created_at: string
  updated_at: string | null
  user: UserData
  cursus: { id: number; created_at: string; name: string; slug: string }
}

interface ProjectUsers {
  id: number
  occurrence: number
  final_mark: number | null
  status: "in_progress" | "finished"
  "validated?": boolean | null
  current_team_id: number
  project: {
    id: number
    name: string
    slug: string
    parent_id: number | null
  }
  cursus_ids: [number]
  marked_at: string | null
  marked: boolean
  retriable_at: string | null
  created_at: string
  updated_at: string | null
}

interface Achievements {
  id: number
  name: string
  description: string
  tier: "none" | "easy" | "medium" | "hard" | "challenge"
  kind: "scolarity" | "project" | "pedagogy" | "scolarity"
  visible: boolean
  image: string | null
  nbr_of_success: number | null
  users_url: string
}

interface LanguagesuUsers {
  id: number
  language_id: number
  user_id: number
  position: number
  created_at: string
}

interface TitlesUsers {
  id: number
  user_id: number
  title_id: number
  selected: boolean
  created_at: string
  updated_at: string | null
}

interface ExpertisesUsers {
  id: number
  expertise_id: number
  interested: boolean
  value: number
  contact_me: boolean
  created_at: string
  user_id: number
}

interface Campus {
  id: number
  name: string
  time_zone: string
  language: {
    id: number
    name: string
    identifier: string
    created_at: string
    updated_at: string | null
  }
  users_count: number
  vogsphere_id: number
  country: string
  address: string
  zip: string
  city: string
  website: string
  facebook: string
  twitter: string
  active: boolean
  email_extension: string
  default_hidden_phone: boolean
}

interface CampusUsers {
  id: number
  user_id: number
  campus_id: number
  is_primary: boolean
  created_at: string
  updated_at: string | null
}

export interface FortyTwoProfile extends UserData {
  groups: [{ id: number; name: string }]
  cursus_users: [CursusUsers]
  projects_users: [ProjectUsers]
  languages_users: [LanguagesuUsers]
  achievements: [Achievements]
  titles: [{ id: number; name: string }]
  titles_users: [TitlesUsers]
  partnerships: [any]
  patroned: [any]
  patroning: [any]
  expertises_users: [ExpertisesUsers]
  roles: [{ id: number; name: string }]
  campus: [Campus]
  campus_users: [CampusUsers]
  user: any | null
}

export default function FortyTwo<
  P extends Record<string, any> = FortyTwoProfile
>(options: OAuthUserConfig<P>): OAuthConfig<P> {
  return {
    id: "42-school",
    name: "42 School",
    type: "oauth",
    authorization: {
      url: "https://api.intra.42.fr/oauth/authorize",
      params: { scope: "public" },
    },
    token: "https://api.intra.42.fr/oauth/token",
    userinfo: "https://api.intra.42.fr/v2/me",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.usual_full_name,
        email: profile.email,
        image: profile.image_url,
      }
    },
    options,
  }
}
