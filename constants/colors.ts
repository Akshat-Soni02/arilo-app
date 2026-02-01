// constants/colors.ts

export const palette = {
    // Light Theme (Warm Journal Aesthetic)
    light: {
        background: "#FAF9F6", // Softer warm off-white (less yellow)
        btnHighlight: "#3A4953",
        surface: "#FEFDFB",
        surfaceMint: "#D1E3D7",
        primary: "#F07E54",
        text: "#2d2d2d",
        textWhite: "#ffffff",
        textMuted: "#717171",
        border: "#E8E4D9",
        accent: "#E6C17A", // Soft gold
        visualizerBase: "#E0DCD0",
        visualizerActive: "#4A4A4A",
        stopBtn: "#3A4953",
        // New Warm UI Tokens
        quickSearchBg: "#F0EAE0", // Warm light grey for search
        cardUserBg: "#FFFFFF",    // White for user cards
        cardAssistantBg: "#F9F0E0", // Warm beige/gold tint for assistant
        chipToday: "#F0EAE0",     // Matches search bg
        error: "#EF4444",
        // Gray scale colors
        gray50: "#f9fafb",
        gray100: "#f3f4f6",
        gray200: "#e5e7eb",
        gray300: "#d1d5db",
        gray400: "#9ca3af",
        gray500: "#6b7280",
        gray600: "#4b5563",
        gray700: "#374151",
        gray800: "#1f2937",
        gray900: "#111827",
        // Semantic background colors
        errorBg: "#fee2e2",
        warningBg: "#fff7ed",
        infoBg: "#eff6ff",
        // UI specific colors
        iconBg: "#f3f4f6",
        chevronColor: "#9ca3af",
        placeholderText: "#9ca3af",
    },
    // Dark Theme (Deep Warm Night Journal)
    dark: {
        background: "#1A1916", // Deep warm charcoal (darker, warmer)
        btnHighlight: "#4A5560", // Slightly lighter for dark mode
        surface: "#252320", // Warm dark surface (like aged paper at night)
        surfaceMint: "#2A3630", // Dark muted forest green
        primary: "#FF9B7A", // Warmer, more vibrant coral for dark mode
        text: "#EAE5DA", // Warm off-white (like cream paper)
        textWhite: "#FEFDFB", // Slightly warm white
        textMuted: "#9B9388", // Warm muted grey (like faded ink)
        border: "#3A3630", // Warm dark border
        accent: "#D9B76A", // Warm gold accent
        visualizerBase: "#3A3630",
        visualizerActive: "#EAE5DA",
        stopBtn: "#D9B76A",
        // New Warm UI Tokens (Dark Mode)
        quickSearchBg: "#2A2722", // Warm dark search bg
        cardUserBg: "#252320", // Matches surface
        cardAssistantBg: "#332F28", // Warmer dark beige
        chipToday: "#3A3630", // Matches border
        error: "#FF6B6B", // Softer red for dark mode
        // Gray scale colors (warm greys for dark mode)
        gray50: "#1A1916",
        gray100: "#252320",
        gray200: "#2F2C28",
        gray300: "#3A3630",
        gray400: "#6B6560",
        gray500: "#9B9388",
        gray600: "#C4BFB5",
        gray700: "#D9D4CA",
        gray800: "#EAE5DA",
        gray900: "#F5F2E9",
        // Semantic background colors (dark variants with warmth)
        errorBg: "#3D2626", // Warm dark red
        warningBg: "#3D3426", // Warm dark orange
        infoBg: "#26303D", // Warm dark blue
        // UI specific colors
        iconBg: "#2F2C28",
        chevronColor: "#9B9388",
        placeholderText: "#6B6560",
    }
};