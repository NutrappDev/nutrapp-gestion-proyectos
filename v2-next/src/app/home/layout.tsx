import ProtectedTemplate from '@/components/layout/protectedTemplate';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedTemplate>{children}</ProtectedTemplate>;
}
