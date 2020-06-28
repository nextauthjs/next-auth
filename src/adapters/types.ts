type CreateUser<Profile> = (profile: Profile) => Promise<void>;
type GetUser = (id: string) => Promise<void>;
type GetUserByEmail = (email: string) => Promise<void>;
type GetUserByProviderAccountId = (
  providerId: string,
  providerAccountId: string,
) => Promise<void>;
type GetUserByCredentials<Credentials> = (credentials: Credentials) => Promise<void>;
type UpdateUser<User> = (user: User) => Promise<void>;
type DeleteUser = (userId: string) => Promise<void>;
type LinkAccount = (
  userId: string,
  providerId: string,
  // TODO: make literal
  providerType: string,
  providerAccountId: string,
  refreshToken: string,
  accessToken: string,
  accessTokenExpires: string,
) => Promise<void>;
type UnlinkAccount = (
  userId: string,
  providerId: string,
  providerAccountId: string,
) => Promise<void>;
type CreateSession<User> = (user: User) => Promise<void>;
type GetSession = (sessionToken: string) => Promise<void>;
// TODO: is `boolean` the correct type for `force`?
type UpdateSession = (session: string, force: boolean) => Promise<void>;
type DeleteSession = (sessionToken: string) => Promise<void>;
type CreateVerificationRequest<Provider> = (
  identifier: string,
  url: string,
  token: string,
  secret: string,
  provider: Provider,
) => Promise<void>;
type GetVerificationRequest<Provider> = (
  identifier: string,
  token: string,
  secret: string,
  provider: Provider,
) => Promise<void>;
type DeleteVerificationRequest<Provider> = (
  identifier: string,
  token: string,
  secret: string,
  provider: Provider,
) => Promise<void>;

interface GetAdapterResult<
  Profile = any,
  Credentials = any,
  User = any,
  Provider = any
> {
  createUser: CreateUser<Profile>;
  getUser: GetUser;
  getUserByEmail: GetUserByEmail;
  getUserByProviderAccountId: GetUserByProviderAccountId;
  getUserByCredentials?: GetUserByCredentials<Credentials>;
  updateUser?: UpdateUser<User>;
  deleteUser?: DeleteUser;
  linkAccount: LinkAccount;
  unlinkAccount?: UnlinkAccount;
  createSession: CreateSession<User>;
  getSession: GetSession;
  updateSession: UpdateSession;
  deleteSession: DeleteSession;
  createVerificationRequest: CreateVerificationRequest<Provider>;
  getVerificationRequest: GetVerificationRequest<Provider>;
  deleteVerificationRequest: DeleteVerificationRequest<Provider>;
}

export type Adapter<Config> = (config: Config, options?: any) =>
  // TODO: determine whether these are the same options as right above this line
  // TODO: where do we pass the profile, credentials, etc. Let's make use of the generic params
  {getAdapter: (options: any) => Promise<GetAdapterResult>};