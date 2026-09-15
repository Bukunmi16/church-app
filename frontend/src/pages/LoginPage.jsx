import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: wire up real auth
    };

    return (
        <div className="flex min-h-screen w-full bg-[#0A0A0C]">
            {/* Left: brand panel */}
            <div className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden  lg:flex">
                {/* Subtle radial glow behind the logo, red-tinted */}
                <div className="pointer-events-none absolute h-[420px] w-[420px] rounded-full bg-[#D62839]/10 blur-3xl" />

                <img
                    src="https://res.cloudinary.com/jkjwwa8p/image/upload/v1789514114/rhema-logo-transparent.png"
                    alt="Rhema Chapel logo"
                    className="relative h-40 w-40 object-contain"
                />
                <h1 className="font-fancy relative  text-5xl text-[#EDEDEF]">
                    Welcome Back
                </h1>
                <p className=" relative mt-3 max-w-sm text-center text-sm text-[#8A8C94]">
                    Sign in to manage services, teachings, members, and more for Rhema Chapel Ogbomoso.
                </p>
            </div>

            {/* Right: form panel */}
            <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
                {/* Mobile-only compact logo, since the brand panel is hidden below lg */}
                <div className="mb-8 flex flex-col items-center lg:hidden">
                    <img
                        src="https://res.cloudinary.com/jkjwwa8p/image/upload/v1789514114/rhema-logo-transparent.png"
                        alt="Rhema Chapel logo"
                        className="h-25 w-25 object-contain"
                    />
                    <h1 className="font-fancy mt-3 text-3xl text-[#EDEDEF]">
                        Welcome Back
                    </h1>
                </div>

                <div className="w-full max-w-sm rounded-xl border border-[#1C1D22] bg-[#111214] p-8">
                    <div className="mb-6 hidden lg:block">
                        <h2 className="text-lg font-semibold text-[#EDEDEF]">Sign in</h2>
                        <p className="mt-1 text-sm text-[#8A8C94]">
                            Enter your admin credentials to continue.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-[#EDEDEF]">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@rhemachapel.org"
                                className="border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-[#EDEDEF]">
                                    Password
                                </Label>
                                <a
                                    href="/forgot-password"
                                    className="text-xs font-medium text-[#8A8C94] transition-colors hover:text-[#D62839]"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="border-[#1C1D22] bg-[#0A0A0C] pr-10 text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E7079] transition-colors hover:text-[#EDEDEF]"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox id="remember" className="border-[#1C1D22] data-[state=checked]:bg-[#D62839] data-[state=checked]:border-[#D62839]" />
                            <Label htmlFor="remember" className="text-sm font-normal text-[#8A8C94]">
                                Remember me
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#D62839] text-white hover:bg-[#B91F2E]"
                        >
                            Sign in
                        </Button>
                    </form>
                </div>

                <p className="mt-6 text-xs text-[#6E7079]">
                    Rhema Chapel Ogbomoso &middot; Admin Portal
                </p>
            </div>
        </div>
    );
};

export default LoginPage;