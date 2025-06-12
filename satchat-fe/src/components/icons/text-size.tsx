import { cn } from '@/lib';
import React from 'react';

type Props = {
  className?: string;
};

export default function TextSize({ className }: Props) {
  return (
    <svg
      className={cn('h-6 w-6 stroke-secondary fill-secondary', className)}
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.92676 20.25V10.999V20.25Z"
      />
      <path
        d="M6.92676 20.25V10.999M22.25 4.75H9.75M12.25 11H1.75M16 5V20.25"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
