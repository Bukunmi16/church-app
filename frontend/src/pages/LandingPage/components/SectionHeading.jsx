const SectionHeading = ({ id, eyebrow, title, description, align = "center" }) => (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
        {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D62839]">{eyebrow}</p>
        )}
        <h2 id={id} className="mt-3 text-3xl font-semibold tracking-tight text-[#EDEDEF] sm:text-4xl">
            {title}
        </h2>
        {description && (
            <p className="mt-4 text-base leading-relaxed text-[#8A8C94]">{description}</p>
        )}
    </div>
);

export default SectionHeading;