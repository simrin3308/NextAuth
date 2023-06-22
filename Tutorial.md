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

a> All the pages are treated as a server side in next js.

b> Make the component as async AND Import 2 things

import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"

c> With use of getServerSession, get the session.
const session = await getServerSession(authOptions)

d> <h1>{JSON.stringify(session)}</h1> in return. This will give us the details of user in SSR

<!-- Client side -->

a> Create a client page `User.jsx` in component.

b> app/context/AuthContext.jsx

```js
"use client";

import { SessionProvider } from "next-auth/react";

export default function Provider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

c> In `User.jsx`

```js
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
```

d> Import this in Home page.

# 5. Register page client side in front end.

a> Create a register page in app with page.jsx

b> Create a form.

c> Get the data from input fields with useState.

`const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });`

give onChange to all input fields =>
`onChange={(e) => setData({ ...data, ${input.name}: e.target.value })}`

d> npm i axios

e> On form onSubmit add => `registerUser`

```js

```

# 6. Create a backend route for Register page.

api/register/route.jsx

a> We need to get the data from the register page. So this will be created as a POST request

b> In route files, we give the function name as the http requests.

```js
export async function POST(request) {}
```

c> We get the body from it and destructure it

```js
const body = request.json();
const { name, email, password } = body;
```

d>

```js
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  const { name, email, password } = body;

  // first we will check if all the fields are filled
  if ((!name, !email, !password)) {
    return new NextResponse("Missing Field", {
      status: 400,
    });
  }

  // we will check if the user already exists in the dataBase
  const exist = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  // if it exists we will throw error
  if (exist) {
    return new NextResponse("User already exists");
  }

  // now everything is good, now will will take the email and hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // we hashed the password. Now we need to create the user in the prisma mdb database
  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  });
  return NextResponse.json(user);
}
```

# 7. Connection between backend and frontend.

a> There is no connection of frontend register with the backend register till now.

b> Connection can be created by adding onSubmit function to the FORM. That form creates a post request.

c> npm i axios

d> In function

```js
const registerUser = async (e) => {
  e.preventDefault();

  axios
    .post("api/register", data)
    .then(() => alert("User has been registered"))
    .catch(() => alert("Error occurred"));
};
```

At this point if we click on register in front end page, it must say "user registered". User must also be created in the MongoDb also.

# 8. Front-end login page

we need to same as we did in register page. We will be having a form with submit function. This submit function then can be used to login the user. We need to use the value and useState as we used above but here we need only 2 values. Email and password.

We will not use axios for login because next auth provides us SIGNIN function which can be used to login the user. We need to add the signin function on onClick

# 9. Login backend connect.

a> Login backend code is done in the [...nextauth] file.

b> Earlier in [...nextauth]/route.jsx we created a dummy user. Now we need to add functionality to it.

c> CHECKS

1. If email and password exists
2. If email exists in the database
3. If password match

If all the checks passed, we will return the user

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
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
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
        // Check to see if email and password is there
        if (!credentials.email || !credentials.password) {
          throw new Error("Please enter an Email and Password");
        }

        // If user actually exists in database
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // If no user found
        if (!user || !user?.hashedPassword) {
          throw new Error("No user Found");
        }

        // If user found, we need to check the password match. This can be done by bcrypt compare
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        // If wrong password
        if (!passwordMatch) {
          throw new Error("Password did not match");
        }

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

# 10. Toast notifications

npm i react-hot-toast
app/context/ToasterContext.jsx
* Create another file in Context

```js
'use client'

import { Toaster } from 'react-hot-toast'

const ToasterContext = () => {
    return (
        <div>
            <Toaster />
        </div>
    )
}

export default ToasterContext;
```

Provide in layout file
```js
 <html lang="en">
      <body className={inter.className}>
        <Provider>
          <ToasterContext />
          {children}
        </Provider></body>
    </html>
```