"use client";
import { useSession } from "next-auth/react";

const User = () => {
  const { data: session } = useSession();
  return (
    <div>
      <h1>Client side render</h1>
      <h2>{JSON.stringify(session)}</h2>
    </div>
  );
};

export default User;
