import { LoginForm } from '../ui/login-form';

export default function Authorization() {
  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm pb-100">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
