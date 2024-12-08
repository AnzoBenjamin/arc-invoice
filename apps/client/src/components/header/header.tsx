'use client'

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { jwtDecode } from 'jwt-decode'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
type User = {
  result: {
    _id: string;
    email: string;
    name: string;
    __v: number;
  };
  userProfile: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    businessName: string;
    contactAddress: string;
    logo: string;
    website: string;
    userId: string;
    __v: number;
  };
  token: string;
}
export default function Header() {
  const dispatch = useDispatch()
  const [user, setUser] = useState<User>()
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('profile')
    if (storedUser) {
      // Parse only if not already set to prevent unnecessary re-renders
      if (!user) {
        setUser(JSON.parse(storedUser))
      }
    }
  }, [user]) // Remove user from dependencies

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' })
    navigate('/')
    localStorage.removeItem('profile') // Clear local storage on logout
    setUser(undefined) // Set user to undefined instead of an empty object
  }, [dispatch, navigate])

  useEffect(() => {
    const token = user?.token
    if (token) {
      const decodedToken = jwtDecode(token) as { exp: number }
      if (decodedToken.exp * 1000 < new Date().getTime()) logout()
    }
  }, [user, logout])

  const openLink = (link: string) => {
    navigate(`/${link}`)
  }

  if (!user) {
    return (
      <header className="flex justify-between items-center p-4">
        <img
          src="https://i.postimg.cc/hGZKzdkS/logo.png"
          alt="arc-invoice"
          width={50}
          height={50}
          className="cursor-pointer"
          onClick={() => navigate('/')}
        />
        <Button onClick={() => navigate('/auth')}>Get started</Button>
      </header>
    )
  }

  return (
    <header className="flex justify-end p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{user?.result?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem onClick={() => openLink('settings')}>
            {(user?.result?.name?.split(" ")[0] || "Guest")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}