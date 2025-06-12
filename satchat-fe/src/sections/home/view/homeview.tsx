import { ProtectedRoute } from "@/components/protected-router";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const HomeView = ({ children, className }: Props) => {
  return <ProtectedRoute>{children}</ProtectedRoute>;
};
