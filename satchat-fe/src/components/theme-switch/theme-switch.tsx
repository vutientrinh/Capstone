"use client";

const ThemeSwitch = ({ style }: { style: React.CSSProperties }) => {
    return (
        // @ts-expect-error: Web component is not recognized by TS
        <theme-switch
            style={{
                ...style,
                "--theme-switch-icon-color": "var(--foreground)",
            } as React.CSSProperties}
        />
    );
};

export default ThemeSwitch;
