import { type ParentComponent } from "solid-js";
import { Title, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { authOpts } from "./api/auth/[...solidauth]";
import { getSession } from "@solid-auth/next";

export const routeData = () => {
  return createServerData$(
    async (_, { request }) => {
      return await getSession(request, authOpts);
    },
    { key: () => ["auth_user"] }
  );
};
const Home: ParentComponent = () => {
  const user = useRouteData<typeof routeData>();
  return (
    <>
      <Title>Create JD App</Title>
      <div class="flex flex-col gap-2 items-center">
        <pre>{JSON.stringify(user(), null, 2)}</pre>
      </div>
    </>
  );
};

export default Home;
