import type { Metadata } from "next";
import LoginContent from "@/components/LoginContent";

export const metadata: Metadata = {
  title: "Log In",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginContent />;
}
