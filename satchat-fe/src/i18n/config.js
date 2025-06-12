"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Importing translation files
import enCommon from "./en-US/common.json";
import viCommon from "./vi-VN/common.json";
import frCommon from "./fr-FR/common.json";

i18n.use(initReactI18next).init({
    fallbackLng: "en-US",
    resources: {
        "en-US": { common: enCommon },
        "vi-VN": { common: viCommon },
        "fr-FR": { common: frCommon },
    },
    lng: "en-US",
    ns: ["common"],
    defaultNS: "common",
    supportedLngs: ["en-US", "vi-VN", "fr-FR"],
});

i18n.languages = ["en-US", "vi-VN", "fr-FR"];

export default i18n;