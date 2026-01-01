"use client"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cd_user")
      if (raw) setUser(JSON.parse(raw))
    } catch {}
  }, [])

  const login = (data) => {
    setUser(data)
    try {
      localStorage.setItem("cd_user", JSON.stringify(data))
    } catch {}
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem("cd_user")
    } catch {}
  }

  const value = useMemo(() => ({ user, login, logout }), [user])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)
