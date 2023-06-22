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
