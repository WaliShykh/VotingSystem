import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";

export default function ForgetPassword() {
  return (
    <>
      <PageMeta
        title="Castify - Online Voting Platform"
        description="Castify - A secure and efficient online voting platform"
      />
      <AuthLayout>
        <ForgotPasswordForm />
      </AuthLayout>
    </>
  );
}
