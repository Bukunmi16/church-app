// Church logo, or the first letter of the name on navy if there's no logo yet
const ChurchMark = ({ church, className = "h-9 w-9" }) =>
    church.logoUrl ? (
        <img
            src={church.logoUrl}
            alt=""
            className={`shrink-0 rounded-full object-contain ${className}`}
        />
    ) : (
        <span
            aria-hidden="true"
            className={`flex shrink-0 items-center justify-center rounded-full bg-[#12183A] text-sm font-bold text-[#EDEDEF] ${className}`}
        >
            {church.name?.[0] ?? "R"}
        </span>
    );

export default ChurchMark;