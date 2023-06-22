import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import User from "./components/User"


export default async function Home() {

  const session = await getServerSession(authOptions)

  return (
   <section>
    <h1>home</h1>
    <h1>SSR</h1>
    <h1>{JSON.stringify(session)}</h1>
    <User />
   </section>
  )
}
