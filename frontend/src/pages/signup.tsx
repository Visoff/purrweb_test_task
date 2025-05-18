import { useState } from "react";
import { Signup } from "@/components/signup";
import { fetcher } from "@/lib/fetch";
import { useAtom } from "jotai";
import { UserTokenStore } from "@/lib/global_store";

export function SignupPage() {
    const [SignupMode, setSignupMode] = useState(false)

    const [_, setUserToken] = useAtom(UserTokenStore)

    async function SignIn(email: string, password: string) {
        const res = await fetcher('/user/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
        if (!res.ok) return
        const body = await res.json()
        localStorage.setItem('token', body.token)
        setUserToken(body.token)
        location.reload()
    }

    async function SignUp(email: string, password: string) {
        const res = await fetcher('/user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name:email, email, password }) })
        if (!res.ok) return
        const body = await res.json()
        localStorage.setItem('token', body.token)
        setUserToken(body.token)
        location.reload()
    }

    return <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-sm">
            {SignupMode ?
                <Signup onSubmit={SignUp} onSwitch={() => setSignupMode(false)} /> :
                <Signup
                    onSubmit={SignIn}
                    onSwitch={() => setSignupMode(true)}
                    heading="Login"
                    subheading="Login to your account"
                    signupText="Login"
                    loginText="Don't have an account?"
                    loginButtonText="Signup"
                />
            }
        </div>
    </div>
}
