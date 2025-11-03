import React, { createContext, useContext, useState, useEffect } from 'react'
import { db } from '../lib/supabase'
import { useAuth } from './AuthContext'

const TaskContext = createContext()

export const useTasks = () => useContext(TaskContext)

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    status: 'all', // all, completed, active
    priority: 'all', // all, high, medium, low
    search: ''
  })
  
  const { user, isAuthenticated } = useAuth()

  // Fetch tasks when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchTasks()
    } else {
      setTasks([])
      setFilteredTasks([])
    }
  }, [isAuthenticated, user])

  // Apply filters when tasks or filters change
  useEffect(() => {
    applyFilters()
  }, [tasks, filters])

  const fetchTasks = async () => {
    if (!user) return
    
    setIsLoading(true)
    setError(null)
    try {
      const data = await db.getByUserId('tasks', user.id)
      setTasks(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks')
    } finally {
      setIsLoading(false)
    }
  }

  const createTask = async (taskData) => {
    if (!user) return
    
    setIsLoading(true)
    setError(null)
    try {
      const newTask = await db.create('tasks', {
        ...taskData,
        user_id: user.id,
        completed: false
      })
      setTasks(prev => [...prev, newTask])
      return newTask
    } catch (err) {
      setError(err.message || 'Failed to create task')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateTask = async (id, taskData) => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedTask = await db.update('tasks', id, taskData)
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ))
      return updatedTask
    } catch (err) {
      setError(err.message || 'Failed to update task')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTask = async (id) => {
    setIsLoading(true)
    setError(null)
    try {
      await db.delete('tasks', id)
      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (err) {
      setError(err.message || 'Failed to delete task')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTaskCompletion = async (id, currentStatus) => {
    return updateTask(id, { completed: !currentStatus })
  }

  const applyFilters = () => {
    let result = [...tasks]
    
    // Filter by status
    if (filters.status === 'completed') {
      result = result.filter(task => task.completed)
    } else if (filters.status === 'active') {
      result = result.filter(task => !task.completed)
    }
    
    // Filter by priority
    if (filters.priority !== 'all') {
      result = result.filter(task => task.priority === filters.priority)
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchTerm) || 
        (task.description && task.description.toLowerCase().includes(searchTerm))
      )
    }
    
    setFilteredTasks(result)
  }

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const value = {
    tasks: filteredTasks,
    allTasks: tasks,
    isLoading,
    error,
    filters,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    updateFilters,
    refreshTasks: fetchTasks
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}