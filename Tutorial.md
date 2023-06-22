<!-- START OF TUTORIAL -->

# 1. Set Up Environment

app/api
app/(site)/register
app/(site)/dashboard
app/(site)/login

# 2. Connect Mongodb and prisma

a> npm i -D prisma
b> initialize prisma
npx prisma init

    By this prisma folder will be created with schema file plus with .env file.

c> Add mongodb in schema
datasource db {
provider = "mongodb"
url = env("DATABASE_URL")
}

d> Go to mongodb site and get the link for the db and paste in .env file.

# 3. Set the user schema

a> Create the user schema in prisma schema file.

b> npm i @prisma/client

c> Initialize the prisma client and make it a global state

app/libs/prismadb.js

```js
import { PrismaClient } from "@prisma/client";

const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV === "production") globalThis.prisma = client;

export default prisma;
```

# 3. Set the NextAuth catch all routes

api/auth/[...nextauth]/route.jsx

This route.jsx is the main entry point for the next auth application

a> Set up route.jsx

```js
import NextAuth from "next-auth/next";
import prisma from "../../../libs/prismadb";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcrypt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // for all the providers
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // this is tough one
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Sam@gmail.com" },
        password: { label: "Password", type: "password" },
        username: {
          label: "Username",
          type: "text",
          placeholder: "John Smith",
        },
      },
      async authorize(credentials) {
        // this is dummy user because we don't have database set
        const user = {
          id: 1,
          email: "sam@gmail.com",
          name: "sam",
        };

        return user;
      },
    }),
  ],
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

<!-- TEST -->

api/auth/signin => Gives pre-build login page.

Check is to give email name and password and given above in dummy user and it will redirect to the home page



# 4. Retrieve the session data.

<!-- server side -->





<!-- Client side -->