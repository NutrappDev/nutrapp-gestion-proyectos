import ProtectedTemplate from '@/components/layout/protectedTemplate';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedTemplate>{children}</ProtectedTemplate>;
}
