// app/login/page.jsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // REAL project me ye backend se aana chahiye
    const userId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : "USER-" + Math.random().toString(36).slice(2, 10).toUpperCase();

    localStorage.setItem("userId", userId);
    localStorage.setItem("userEmail", email);

    router.push("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto mt-10 border rounded-lg p-6 bg-card">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form className="space-y-3" onSubmit={handleLogin}>
        <Input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          required
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <Button className="w-full" type="submit">
          Login
        </Button>
      </form>
      <p className="text-xs text-muted-foreground mt-3">
        Note: Unique ID abhi frontend se generate ho raha hai. Fake login
        detect karne ke liye production me backend/database se ID validate
        karni hogi.
      </p>
    </div>
  );
}
