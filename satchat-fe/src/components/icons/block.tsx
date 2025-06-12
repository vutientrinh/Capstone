function Block({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M18.5407 5.45926C16.8668 3.78534 14.5543 2.75 12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 14.5543 3.78534 16.8668 5.45926 18.5407M18.5407 5.45926C20.2147 7.13318 21.25 9.44568 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C9.44568 21.25 7.13318 20.2147 5.45926 18.5407M18.5407 5.45926L5.45926 18.5407"
        stroke="#F8F8F8"
        strokeOpacity="0.7"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default Block;
