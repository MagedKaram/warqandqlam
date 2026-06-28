import { AuthLayout } from "@/components/auth/auth-layout";
import { SignupForm } from "@/components/signup/signup-form";

export default function SignupPage() {
  return (
    <AuthLayout artworkSide="right">
      <SignupForm />
    </AuthLayout>
  );
}
