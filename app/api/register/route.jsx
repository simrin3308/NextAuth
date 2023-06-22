import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

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
