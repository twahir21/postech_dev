import { component$, useStore } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { AuthForm } from "~/components/Auth";

export default component$(() => {
  const location = useLocation();

  // Get `reg` query parameter immediately
  const params = new URLSearchParams(location.url.search);
  const regParam = params.get("reg");

  // Store `isLogin` based on query parameter (default to true)
  const state = useStore({ isLogin: regParam !== "true" });

  return <AuthForm isLogin={state.isLogin} />;
});
