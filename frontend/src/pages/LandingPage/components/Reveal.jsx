import { useEffect, useRef, useState } from "react";

// Fades and lifts its children into view once, when scrolled to.
// Visible immediately for people who prefer reduced motion.
const Reveal = ({ as: Tag = "div", delay = 0, className = "", children, ...props }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (typeof IntersectionObserver === "undefined") {
            setVisible(true);
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <Tag
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none ${
                visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            } ${className}`}
            {...props}
        >
            {children}
        </Tag>
    );
};

export default Reveal;