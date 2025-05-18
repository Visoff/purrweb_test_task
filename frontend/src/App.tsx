import { SignupPage } from "@/pages/signup"
import { UserTokenStore } from "./lib/global_store"
import { useAtom } from "jotai"
import { WorkSpaceSelection } from "./pages/workspace_selection"

export default function() {
    const [UserToken, _] = useAtom(UserTokenStore)
    return <>
        {UserToken ? <WorkSpaceSelection /> : <SignupPage />}
    </>
}
