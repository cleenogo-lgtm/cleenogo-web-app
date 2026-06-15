import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getOwnerToken, isTokenLikelyValid } from "@/lib/owner-session";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    if (!isTokenLikelyValid(getOwnerToken())) {
      throw redirect({ to: "/auth" });
    }
  },
  component: () => <Outlet />,
});
