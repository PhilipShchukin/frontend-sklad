import { LoginForm } from '../ui/login-form';
import { AdbPanel } from './AdbPanel';

export default function Authorization() {
  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm pb-100">
          <AdbPanel />
          <LoginForm />
        </div>
      </div>
    </>
  );
}
