import { RouterProvider, createRouter } from "@tanstack/react-router";
import { useAuth } from "./users";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CommunityType, UserType } from "./lib/types";
// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    // auth will initially be undefined
    // We'll be passing down the auth state from within a React component
    auth: undefined!,
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
const queryClient = new QueryClient();
const users: UserType[] = [
  {
    id: "1",
    nome: "gabriel",
    senha: "1234",
    email: "biel@communitychat.com",
  },
  {
    id: "2",
    nome: "tamara",
    senha: "1234",
    email: "tamara@communitychat.com",
  },
  {
    id: "3",
    nome: "joão",
    senha: "1234",
    email: "joao@communitychat.com",
  },
];
const usersString = JSON.stringify(users);
localStorage.setItem("users", usersString);

const communities: CommunityType[] = [
  {
    id: "3",
    privada: false,
    nome: "outra comunidade",
    criador: "tamara",
    users: [{ nome: "joão" }],
  },
  {
    id: "1",
    privada: true,
    nome: "Gabriel comunidade",
    criador: "gabriel",
    users: [{ nome: "tamara" }],
  },
  {
    id: "2",
    privada: false,
    nome: "tamara comunidade",
    criador: "tamara",
    users: [{ nome: "joão" }, { nome: "gabriel" }],
  },
];
const communitiesString = JSON.stringify(communities);
localStorage.setItem("communities", communitiesString);

export function InnerApp() {
  const auth = useAuth();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ auth }} />
    </QueryClientProvider>
  );
}
