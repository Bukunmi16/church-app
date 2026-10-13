import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { registerUser } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LOGO_URL =
    "https://res.cloudinary.com/jkjwwa8p/image/upload/v1789514114/rhema-logo-transparent.png";

const inputClass =
    "border-[#1C1D22] bg-[#0A0A0C] text-[#EDEDEF] placeholder:text-[#6E7079] focus-visible:ring-[#D62839]";

const STEPS = [
    { title: "About you", description: "Let's start with the basics." },
    { title: "Contact details", description: "How can we reach you?" },
    { title: "Secure your account", description: "Choose a password you'll remember." },
];

const CONTACT_STEP = 1;

const GENDERS = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
];

const initialForm = {
    name: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
};

const Register = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState("forward");
    const [form, setForm] = useState(initialForm);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isLastStep = step === STEPS.length - 1;
    const today = new Date().toISOString().split("T")[0];
    const passwordsMismatch = form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

    const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const goBack = () => {
        setDirection("back");
        setStep((current) => Math.max(0, current - 1));
    };

    // Only the current step's inputs are mounted, so the browser's native validation
    // (required, email format, min length) checks just this step before onSubmit runs.
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLastStep) {
            setDirection("forward");
            setStep((current) => current + 1);
            return;
        }

        if (form.password !== form.confirmPassword) {
            toast.error("Your passwords don't match.");
            return;
        }

        const payload = {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            dateOfBirth: form.dateOfBirth,
            gender: form.gender,
            address: form.address.trim(),
            password: form.password,
        };

        try {
            setIsSubmitting(true);
            await registerUser(payload);
            toast.success("Account created! Please log in to continue.");
            navigate("/login");
        } catch (err) {
            console.error(err);
            const message = err.response?.data?.message;
            toast.error(message || "We couldn't create your account. Please try again.");

            // Most likely cause is an email that's already registered, so take them back to fix it
            if (message && /email/i.test(message)) {
                setDirection("back");
                setStep(CONTACT_STEP);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-[#0A0A0C]">
            {/* Left: brand panel */}
            <div className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden border-r border-[#1C1D22] lg:flex">
                <div className="pointer-events-none absolute h-[420px] w-[420px] rounded-full bg-[#D62839]/10 blur-3xl" />

                <img src={LOGO_URL} alt="Rhema Chapel logo" className="relative h-28 w-28 object-contain" />
                <h1 className="relative mt-6 font-fancy text-5xl text-[#EDEDEF]">Join Our Family</h1>
                <p className="relative mt-3 max-w-sm text-center text-sm text-[#8A8C94]">
                    Create an account to stay connected with teachings, events, and everything happening at
                    Rhema Chapel Ogbomoso.
                </p>
            </div>

            {/* Right: form */}
            <div className="flex w-full flex-col items-center justify-center px-6 py-10 lg:w-1/2">
                <div className="w-full max-w-md">
                    <Link
                        to="/"
                        className="mb-6 inline-flex items-center gap-1.5 rounded text-sm text-[#8A8C94] transition-colors hover:text-[#EDEDEF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D62839]"
                    >
                        <ArrowLeft size={15} aria-hidden="true" />
                        Back to home
                    </Link>

                    {/* Mobile-only compact brand, since the brand panel is hidden below lg */}
                    <div className="mb-6 flex flex-col items-center lg:hidden">
                        <img src={LOGO_URL} alt="Rhema Chapel logo" className="h-14 w-14 object-contain" />
                        <h1 className="mt-3 font-fancy text-3xl text-[#EDEDEF]">Join Our Family</h1>
                    </div>

                    <div className="rounded-xl border border-[#1C1D22] bg-[#111214] p-6 sm:p-8">
                        {/* Progress */}
                        <div className="mb-6">
                            <div
                                role="progressbar"
                                aria-label="Registration progress"
                                aria-valuemin={1}
                                aria-valuemax={STEPS.length}
                                aria-valuenow={step + 1}
                                className="flex gap-1.5"
                            >
                                {STEPS.map((s, i) => (
                                    <span
                                        key={s.title}
                                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                                            i <= step ? "bg-[#D62839]" : "bg-[#1C1D22]"
                                        }`}
                                    />
                                ))}
                            </div>

                            <div aria-live="polite">
                                <p className="mt-4 text-xs font-medium uppercase tracking-wider text-[#6E7079]">
                                    Step {step + 1} of {STEPS.length}
                                </p>
                                <h2 className="mt-1 text-lg font-semibold text-[#EDEDEF]">{STEPS[step].title}</h2>
                                <p className="mt-1 text-sm text-[#8A8C94]">{STEPS[step].description}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* key remounts the step so it animates in; slide direction follows Back / Continue */}
                            <div
                                key={step}
                                className={`animate-in fade-in space-y-4 duration-300 motion-reduce:animate-none ${
                                    direction === "forward" ? "slide-in-from-right-4" : "slide-in-from-left-4"
                                }`}
                            >
                                {step === 0 && (
                                    <>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="name" className="text-[#EDEDEF]">Full name</Label>
                                            <Input
                                                id="name"
                                                autoComplete="name"
                                                value={form.name}
                                                onChange={setField("name")}
                                                placeholder="Your full name"
                                                required
                                                className={inputClass}
                                            />
                                        </div>

                                        <fieldset className="space-y-1.5">
                                            <legend className="text-sm font-medium text-[#EDEDEF]">Gender</legend>
                                            <div className="grid grid-cols-2 gap-3">
                                                {GENDERS.map((gender) => (
                                                    <label key={gender.value} className="cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="gender"
                                                            value={gender.value}
                                                            checked={form.gender === gender.value}
                                                            onChange={setField("gender")}
                                                            required
                                                            className="peer sr-only"
                                                        />
                                                        <span className="flex h-10 items-center justify-center rounded-md border border-[#1C1D22] bg-[#0A0A0C] text-sm text-[#8A8C94] transition-colors hover:border-[#2A2B31] peer-checked:border-[#D62839] peer-checked:bg-[#D62839]/10 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#D62839]">
                                                            {gender.label}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </fieldset>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="dateOfBirth" className="text-[#EDEDEF]">Date of birth</Label>
                                            <Input
                                                id="dateOfBirth"
                                                type="date"
                                                autoComplete="bday"
                                                max={today}
                                                value={form.dateOfBirth}
                                                onChange={setField("dateOfBirth")}
                                                required
                                                className={`[color-scheme:dark] ${inputClass}`}
                                            />
                                        </div>
                                    </>
                                )}

                                {step === 1 && (
                                    <>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="email" className="text-[#EDEDEF]">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                autoComplete="email"
                                                autoFocus
                                                value={form.email}
                                                onChange={setField("email")}
                                                placeholder="you@example.com"
                                                required
                                                className={inputClass}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="phone" className="text-[#EDEDEF]">Phone number</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                autoComplete="tel"
                                                value={form.phone}
                                                onChange={setField("phone")}
                                                placeholder="080 1234 5678"
                                                required
                                                className={inputClass}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="address" className="text-[#EDEDEF]">Home address</Label>
                                            <Input
                                                id="address"
                                                autoComplete="street-address"
                                                value={form.address}
                                                onChange={setField("address")}
                                                placeholder="Where you live"
                                                required
                                                className={inputClass}
                                            />
                                        </div>
                                    </>
                                )}

                                {step === 2 && (
                                    <>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="password" className="text-[#EDEDEF]">Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    autoComplete="new-password"
                                                    autoFocus
                                                    value={form.password}
                                                    onChange={setField("password")}
                                                    placeholder="At least 6 characters"
                                                    minLength={6}
                                                    required
                                                    className={`pr-10 ${inputClass}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                    aria-label={showPassword ? "Hide passwords" : "Show passwords"}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-[#6E7079] transition-colors hover:text-[#EDEDEF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D62839]"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="confirmPassword" className="text-[#EDEDEF]">Confirm password</Label>
                                            <Input
                                                id="confirmPassword"
                                                type={showPassword ? "text" : "password"}
                                                autoComplete="new-password"
                                                value={form.confirmPassword}
                                                onChange={setField("confirmPassword")}
                                                placeholder="Re-enter your password"
                                                required
                                                aria-invalid={passwordsMismatch}
                                                aria-describedby={passwordsMismatch ? "password-mismatch" : undefined}
                                                className={inputClass}
                                            />
                                            <p
                                                id="password-mismatch"
                                                role="status"
                                                className={`text-xs text-[#D62839] ${passwordsMismatch ? "" : "sr-only"}`}
                                            >
                                                {passwordsMismatch ? "Passwords don't match yet." : ""}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Navigation */}
                            <div className={`mt-6 grid gap-3 ${step > 0 ? "grid-cols-2" : "grid-cols-1"}`}>
                                {step > 0 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={goBack}
                                        disabled={isSubmitting}
                                        className="gap-2 border-[#1C1D22] bg-transparent text-[#EDEDEF] hover:bg-[#141518] hover:text-[#EDEDEF]"
                                    >
                                        <ArrowLeft size={16} />
                                        Back
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="gap-2 bg-[#D62839] text-white hover:bg-[#B91F2E]"
                                >
                                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                                    {isLastStep ? (isSubmitting ? "Creating account…" : "Create account") : "Continue"}
                                    {!isLastStep && <ArrowRight size={16} />}
                                </Button>
                            </div>
                        </form>

                        <p className="mt-6 text-center text-sm text-[#8A8C94]">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="rounded font-medium text-[#D62839] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D62839]"
                            >
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;