import React, { createContext, useContext, useState, useEffect } from 'react'
import { authHelpers } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('taskmaster_user')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (err) {
        localStorage.removeItem('taskmaster_user')
      }
    }
  }, [])

  const signUp = async (email, password, name) => {
    setIsLoading(true)
    setError(null)
    try {
      const newUser = await authHelpers.signUp(email, password, name)
      setUser(newUser)
      setIsAuthenticated(true)
      localStorage.setItem('taskmaster_user', JSON.stringify(newUser))
      return newUser
    } catch (err) {
      setError(err.message || 'Failed to sign up')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email, password) => {
    setIsLoading(true)
    setError(null)
    try {
      const user = await authHelpers.signIn(email, password)
      setUser(user)
      setIsAuthenticated(true)
      localStorage.setItem('taskmaster_user', JSON.stringify(user))
      return user
    } catch (err) {
      setError(err.message || 'Invalid credentials')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      await authHelpers.signOut()
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('taskmaster_user')
    } catch (err) {
      setError(err.message || 'Failed to sign out')
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    signUp,
    signIn,
    signOut
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}