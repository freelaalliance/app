'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { logout } from './AuthApi'

export async function closeSession() {
  cookies().delete('sessionUser')
  redirect('/')
}
