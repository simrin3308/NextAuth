"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const session = useSession();
  // const { data:session } = useSession()
  const router = useRouter();

  if (session.status === "unauthenticated") {
    // Redirect to the login page if user is not authenticated
    router.push("/login");
    return null;
  }
  if (session.status === "loading") {
    // Redirect to the login page if user is not authenticated

    return <h1>Loading</h1>;
  }

  // Render the dashboard content if the user is authenticated
  return (
    <div>
      <h1>Welcome to the Dashboard!</h1>
      {/* Add your dashboard content here */}
      <h1>
        <button onClick={() => signOut()}>sign out</button>
      </h1>
    </div>
  );
}
