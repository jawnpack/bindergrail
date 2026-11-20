import MagicLinkForm from "../MagicLinkForm";

export default function LoginPage() {
  return (
    <MagicLinkForm
      title="Sign in"
      intro="Enter your email and we'll send you a magic link."
      sentAction="sign in"
    />
  );
}
