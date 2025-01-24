import { useNavigate } from "@solidjs/router";
import { getAuth, signOut } from "firebase/auth";
import { Component, onMount } from "solid-js";
import { useState } from "../../state";

const Logout: Component<{}> = (props) => {
  const [
    allKnownTests,
    setAllKnownTests,
    loadingState,
    setLoadingState,
    defaultTest,
    setDefaultTest,
    defaultGSE,
    setDefaultGSE,
    defaultTestArticle,
    setDefaultTestArticle,
    auth,
    setAuth,
    org,
    setOrg,
  ] = useState();

  onMount(() => {
    console.log("logging out...");
    signOut(getAuth());
    const navigate = useNavigate();
    navigate(`/${org() ?? ""}`, { replace: true });
  });

  return <p>Logging Out</p>;
};

export default Logout;
