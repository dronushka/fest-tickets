'use client'
import React from 'react'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../api/auth/[...nextauth]/route'
import LoginForm from '~/components/loginForm'

export default async function Profile() {
  const session = await getServerSession(authOptions)
  if (!session)
    return <LoginForm />
  return (
    <p>Profile</p>
  )
}