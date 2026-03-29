import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";
import { signOut } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  const handleSignOut = async () => {
    "use server";

    await signOut();
    redirect("/sign-in");
  };

  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
          <h2 className="text-primary-100">PrepWise</h2>
        </Link>

        <details className="relative">
          <summary className="list-none cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-200">
            <div className="size-10 rounded-full bg-pink-300 text-dark-100 font-semibold flex items-center justify-center">
              S
            </div>
          </summary>

          <div className="absolute right-0 mt-3 w-44 rounded-xl border border-light-800 dark-gradient p-2 z-20 shadow-lg">
            <Link
              href="/dashboard"
              className="block w-full rounded-lg px-3 py-2 text-sm text-primary-100 hover:bg-dark-200"
            >
              Dashboard
            </Link>

            <Link
              href="/resources"
              className="block w-full rounded-lg px-3 py-2 text-sm text-primary-100 hover:bg-dark-200"
            >
              Resources
            </Link>

            <form action={handleSignOut}>
              <button
                type="submit"
                className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm text-primary-100 hover:bg-dark-200"
              >
                Logout
              </button>
            </form>
          </div>
        </details>
      </nav>

      {children}
    </div>
  );
};

export default Layout;
