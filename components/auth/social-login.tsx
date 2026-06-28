import { FaFacebook } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { AuthButton } from "@/components/ui/auth-button";

export function SocialLogin() {
  return (
    <div className="space-y-4">
      <AuthButton variant="outline">
        <FcGoogle aria-hidden className="text-3xl" />
        سجل مع جوجل
      </AuthButton>
      <AuthButton variant="outline">
        <FaFacebook aria-hidden className="text-3xl text-auth-link" />
        سجل مع فيسبوك
      </AuthButton>
    </div>
  );
}
