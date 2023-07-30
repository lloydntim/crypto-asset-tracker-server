"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const i18next_http_middleware_1 = require("i18next-http-middleware");
const translation_json_1 = __importDefault(require("./locales/en/translation.json"));
const translation_json_2 = __importDefault(require("./locales/de/translation.json"));
i18next_1.default
    .use(i18next_http_middleware_1.LanguageDetector)
    .init({
    resources: {
        en: {
            translation: translation_json_1.default,
        },
        de: {
            translation: translation_json_2.default,
        },
    },
    fallbackLng: 'en',
    preload: ['en', 'de'],
    saveMissing: true
});
exports.default = i18next_1.default;
//# sourceMappingURL=i18n.js.map