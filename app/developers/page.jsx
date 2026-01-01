"use client";
import React from "react";
import { Mail, Github, Linkedin } from "lucide-react";

const devs = [
  {
    id: 1,
    name: "Ashwani Kumar",
    role: "Fullstack Developer",
    bio: "Expert in React, Next.js, UI performance & smooth user interactions.",
    skills: ["React.js", "Mongodb","Next.js", "JavaScript"],
    location: "Noida, India",
    img: "/devs/ashwani.jpg",
    email: "#",
    github: "#",
    linkedin: "#",
  },
  {
    id: 2,
    name: "Saloni Goyal",
    role: "Frontend & UI/UX Developer",
    bio: "Node.js & MongoDB specialist — super fast API architect.",
    skills: ["React.js", "TailwindCSS","Javascript","UI/UX"],
    location: "Noida, India",
    img: "/devs/saloni.jpg",
    email: "#",
    github: "#",
    linkedin: "#",
  },
  {
    id: 3,
    name: "Archit",
    role: "Fullstack Developer",
    bio: "Fullstack problem-solver — connects frontend, backend & infra.",
    skills: ["React.js", "Node.js", "Sql","Javascript"],
    location: "Noida, India",
    img: "/devs/archit.jpg",
    email: "#",
    github: "#",
    linkedin: "#",
  },
  {
    id: 4,
    name: "Amir Hussain",
    role: "Frontend Developer",
    bio: "Designs clean UI, UX flows, animations and design systems.",
    skills: ["React.js", "TailwindCSS", "Javascript"],
    location: "Noida, India",
    img: "/devs/amir.jpg",
    email: "#",
    github: "#",
    linkedin: "#",
  },
];

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Heading */}
      <div className="text-center pt-20">
        <h1 className="text-5xl font-bold text-gray-900">Our Developers</h1>
        <p className="text-gray-600 mt-3 text-lg">
          Meet the amazing team behind EduNav - creative, passionate and innavative.
        </p>
      </div>

      {/* CENTERED WRAPPER */}
      <div className="w-full flex justify-center mt-12">
        <div className="flex flex-wrap justify-center gap-10 max-w-[1400px]">
          {devs.map((d) => (
            <div
              key={d.id}
              className="
                w-[310px] bg-white rounded-2xl p-6 text-center border 
                border-gray-200 shadow-sm
                transition-all duration-300

                hover:shadow-xl hover:border-indigo-400
                hover:bg-indigo-50 hover:-translate-y-2
              "
            >
              {/* Avatar */}
              <img
                src={d.img}
                alt={d.name}
                className="w-28 h-28 rounded-full mx-auto object-cover border-2 border-gray-300"
              />

              {/* Name & Role */}
              <h2 className="text-xl font-semibold mt-4">{d.name}</h2>
              <p className="text-sm text-gray-500">{d.role}</p>

              {/* Bio */}
              <p className="text-gray-600 text-sm mt-3">{d.bio}</p>

              {/* Location */}
              <p className="text-gray-500 text-xs mt-1">{d.location}</p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {d.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Social Icons */}
              <div className="flex justify-center gap-6 mt-5">
                {/* Email opens Gmail compose automatically */}
                <a
                  href={`mailto:${d.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Mail size={22} className="text-gray-600 hover:text-blue-700 cursor-pointer" />
                </a>

                {/* GitHub Profile */}
                <a
                  href={d.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={22} className="text-gray-600 hover:text-blue-700 cursor-pointer" />
                </a>

                {/* LinkedIn Profile */}
                <a
                  href={d.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin size={22} className="text-gray-600 hover:text-blue-700 cursor-pointer" />
                </a>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-10 text-gray-500 text-sm mt-20 border-t">
        © 2025 EduNav. All rights reserved.
      </footer>
    </div>
  );
}
