const LoadingScreen = ({ label = "Loading" }) => {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-[#0A0A0C]">
            {/* Logo with a soft pulse */}
            <img
                src="https://res.cloudinary.com/jkjwwa8p/image/upload/v1788384142/rhema-logo.jpg"
                alt="Rhema Chapel logo"
                className="h-16 w-16 animate-pulse object-contain rounded-full"
            />

            {/* Spinner ring, red accent leading edge */}
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1C1D22] border-t-[#D62839]" />

            <p className="text-sm font-medium tracking-wide text-[#8A8C94]">
                {label}...
            </p>
        </div>
    );
};

export default LoadingScreen;