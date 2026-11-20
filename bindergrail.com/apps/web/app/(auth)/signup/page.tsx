import Link from "next/link";
import MagicLinkForm from "../MagicLinkForm";

export default function SignUpPage() {
  return (
    <MagicLinkForm
      title="Create your account"
      intro="Enter your email and we'll send you a magic link to get started."
      sentAction="create your account"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-on-cream underline underline-offset-3 hover:text-amber-deep">
            Sign in
          </Link>
        </>
      }
    />
  );
}
