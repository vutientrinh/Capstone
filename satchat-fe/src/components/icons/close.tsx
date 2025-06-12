export default function CloseIcon({ color = "#F8F8F8" }: { color: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <g opacity="0.8">
        <path
          d="M4.75 4.75L19.25 19.25M19.25 4.75L4.75 19.25"
          stroke={color}
          strokeOpacity="0.7"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
