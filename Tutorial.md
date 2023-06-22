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
    url      = env("DATABASE_URL")
    }

d> Go to mongodb site and get the link for the db and paste in .env file.

3> 