// /app/api/auth/register/route.js
import { NextResponse } from "next/server";
import getDb from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn("JWT_SECRET not set — set it in your environment variables");
}

function validateName(name) {
  if (!name) return false;
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return false; // require at least first + last
  if (name.length < 4 || name.length > 100) return false;
  return true;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { fullName, email, password, phone } = body;

    if (!validateName(fullName)) {
      return NextResponse.json({ error: "Please enter your full name (first and last)." }, { status: 400 });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection("users");

    // prevent duplicate email
    const existing = await users.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // generate a server-side unique id (can't be forged)
    const userId = `edunav_${uuidv4()}`;

    const now = new Date();
    const userDoc = {
      userId,
      fullName: fullName.trim(),
      email: email.toLowerCase(),
      phone: phone || null,
      passwordHash: hashed,
      createdAt: now,
      updatedAt: now,
      verified: false, // email verification optional
      // you can add roles, preferences, etc.
    };

    const insert = await users.insertOne(userDoc);

    // create JWT (short expiry recommended or use refresh tokens)
    const token = jwt.sign(
      { sub: userId, email: userDoc.email, name: userDoc.fullName },
      JWT_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );

    // Return non-sensitive user info
    const result = {
      userId,
      fullName: userDoc.fullName,
      email: userDoc.email,
      token,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
