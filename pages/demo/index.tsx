import { useProfile } from "../../components/contextManagers/profile";
import { SuperflowsButton } from "@superflows/chat-ui-react";
import { useRouter } from "next/router";
import { LoadingPage } from "../../components/loadingspinner";
import React from "react";

export default function Demo() {
  const { profile } = useProfile();
  const router = useRouter();

  return (
    <div>
      <SuperflowsButton
        superflowsUrl={process.env.NEXT_PUBLIC_SUPERFLOWS_URL}
        superflowsApiKey={process.env.NEXT_PUBLIC_SUPERFLOWS_API_KEY as string}
      ></SuperflowsButton>
    </div>
  );
}
