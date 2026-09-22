export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth is enforced by proxy.ts on real navigations to these routes, and each
  // page additionally calls getUser (with RLS guarding every query). This
  // layout deliberately does NOT call getUser: a third session check here runs
  // during render, where a token refresh can't persist its rotated cookie, so
  // it would only reintroduce the refresh-token race that caused the login loop.
  return <>{children}</>;
}
