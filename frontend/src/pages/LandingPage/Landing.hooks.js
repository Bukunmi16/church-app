import { useEffect, useMemo, useState } from "react";
import { useChurchInfoStore } from "@/stores/church-info.store";
import { CHURCH_FALLBACK } from "./Landing.config.js";

// Church details from the existing store, with a fallback so the page never looks empty
export const useChurchProfile = () => {
    const churchInfo = useChurchInfoStore((state) => state.churchInfo);
    const fetchChurchInfo = useChurchInfoStore((state) => state.fetchChurchInfo);

    useEffect(() => {
        try {
            Promise.resolve(fetchChurchInfo?.()).catch(() => {});
        } catch {
            /* the fallback below covers this */
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return useMemo(
        () => ({
            name: churchInfo?.name || CHURCH_FALLBACK.name,
            motto: churchInfo?.motto || CHURCH_FALLBACK.motto,
            logoUrl: churchInfo?.logo?.url || "",
            address: churchInfo?.address || CHURCH_FALLBACK.address,
            phone: churchInfo?.phone || CHURCH_FALLBACK.phone,
            email: churchInfo?.email || CHURCH_FALLBACK.email,
            website: churchInfo?.website || CHURCH_FALLBACK.website,
            x: churchInfo.x || CHURCH_FALLBACK.x,
            facebook: churchInfo.facebook || CHURCH_FALLBACK.facebook,
            instagram: churchInfo.instagram || CHURCH_FALLBACK.instagram,
            youtube: churchInfo.youtube || CHURCH_FALLBACK.youtube,
            telegram: churchInfo.telegram || CHURCH_FALLBACK.telegram,
        }),
        [churchInfo]
    );
};

// status: "loading" | "success" | "empty" | "error"
export const useAsyncList = (fetcher) => {
    const [state, setState] = useState({ status: "loading", data: [] });
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let cancelled = false;
        setState((prev) => ({ ...prev, status: "loading" }));

        fetcher()
            .then((data) => {
                if (!cancelled) setState({ status: data.length ? "success" : "empty", data });
            })
            .catch((err) => {
                console.error(err);
                if (!cancelled) setState({ status: "error", data: [] });
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attempt]);

    return { ...state, retry: () => setAttempt((n) => n + 1) };
};

// Highlights the nav link of the section currently in view
export const useActiveSection = (ids) => {
    const [active, setActive] = useState(ids[0]);
    const key = ids.join(",");

    useEffect(() => {
        if (typeof IntersectionObserver === "undefined") return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            },
            { rootMargin: "-40% 0px -55% 0px" }
        );
        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    return active;
};