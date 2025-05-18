import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Signup1Props {
  heading?: string;
  subheading?: string;
  signupText?: string;
  loginText?: string;
  loginButtonText?: string;
  onSubmit?: (email: string, password: string) => void;
  onSwitch?: () => void;
}

const Signup = ({
  heading = "Signup",
  subheading = "Create a new account",
  signupText = "Create an account",
  loginText = "Already have an account?",
  loginButtonText = "Login",
  onSubmit: onSignup = () => {},
  onSwitch: onLogin = () => {},
}: Signup1Props) => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      return (
        <section className="h-screen bg-muted">
          <div className="flex h-full items-center justify-center">
            <form
                onSubmit={(e) => {e.preventDefault(); onSignup(email, password)}}
                className="flex w-full max-w-sm flex-col items-center gap-y-8 rounded-md border border-muted bg-white px-6 py-12 shadow-md">
              <div className="flex flex-col items-center gap-y-2">
                <h1 className="text-3xl font-semibold">{heading}</h1>
                {subheading && (
                  <p className="text-sm text-muted-foreground">{subheading}</p>
                )}
              </div>
              <div className="flex w-full flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Input
                      type="email"
                      placeholder="Email"
                      required
                      className="bg-white"
                      onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                      value={email}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Input
                      type="password"
                      placeholder="Password"
                      required
                      className="bg-white"
                      onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                      value={password}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <Button type="submit" className="mt-2 w-full">
                      {signupText}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-1 text-sm text-muted-foreground">
                <p>{loginText}</p>
                <button
                  onClick={onLogin}
                  type="button"
                  className="cursor-pointer font-medium text-primary hover:underline"
                >
                  {loginButtonText}
                </button>
              </div>
            </form>
          </div>
        </section>
      );
    };

export { Signup };
