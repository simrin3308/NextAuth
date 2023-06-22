import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import User from "./components/User"
import Link from "next/link"


export default async function Home() {

  const session = await getServerSession(authOptions)

  return (
   <section>
    <h1>home</h1>
    <h1>SSR</h1>
    <h1>{JSON.stringify(session)}</h1>
    <User />

    <Link href="/login">
      <button className="m-5 p-3 bg-black text-white hover:cursor-pointer">Login</button>
    </Link>
    <Link href="/register">
    <button className="m-5 p-3 bg-black text-white hover:cursor-pointer">Register</button>
    </Link>
   </section>
  )
}
