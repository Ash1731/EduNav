// app/dashboard/page.jsx
"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [uid, setUid] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    setUid(localStorage.getItem("userId"));
    setEmail(localStorage.getItem("userEmail"));
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <p className="text-sm text-muted-foreground">
        Logged in as: {email || "Unknown user"}
      </p>

      {uid ? (
        <div className="border rounded-md p-4 bg-card">
          <p className="font-medium text-lg">Your Unique ID:</p>
          <p className="font-mono text-sm select-all break-all">{uid}</p>
          <p className="text-xs text-muted-foreground mt-2">
            
          </p>
        </div>
      ) : (
        <p className="text-sm text-red-500">
          No user ID found. Pehle login karke aao.
        </p>
      )}
    </div>
  );
}
