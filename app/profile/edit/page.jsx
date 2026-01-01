// app/profile/edit/page.jsx
"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditProfile() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("profile");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setName(data.name || "");
        setCourse(data.course || "");
      } catch {
        // ignore
      }
    }
  }, []);

  const save = (e) => {
    e.preventDefault();
    localStorage.setItem("profile", JSON.stringify({ name, course }));
    setMsg("Profile updated");
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h1 className="text-xl font-semibold">Edit Profile</h1>
      <form className="space-y-3" onSubmit={save}>
        <Input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Course (e.g., B.Tech CSE)"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />
        <Button type="submit">Save</Button>
      </form>
      {msg && <p className="text-sm text-green-600">{msg}</p>}
    </div>
  );
}
