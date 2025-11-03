import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  Select,
  FormErrorMessage,
  Card,
  CardBody,
  CardHeader,
  useColorModeValue,
  HStack
} from '@chakra-ui/react'
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { useTasks } from '../context/TaskContext'

const TaskForm = ({ task, onClose }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [formErrors, setFormErrors] = useState({})
  
  const { createTask, updateTask, isLoading } = useTasks()
  
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'white')
  const inputBg = useColorModeValue('gray.50', 'gray.700')
  const inputBorder = useColorModeValue('gray.300', 'gray.600')

  // If editing, populate form with task data
  useEffect(() => {
    if (task) {
      setTitle(task.title || '')
      setDescription(task.description || '')
      setPriority(task.priority || 'medium')
      
      if (task.due_date) {
        // Format date for input field (YYYY-MM-DD)
        const date = new Date(task.due_date)
        const formattedDate = date.toISOString().split('T')[0]
        setDueDate(formattedDate)
      } else {
        setDueDate('')
      }
    }
  }, [task])

  const validateForm = () => {
    const errors = {}
    
    if (!title.trim()) {
      errors.title = 'Title is required'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      const taskData = {
        title,
        description: description.trim() || null,
        priority,
        due_date: dueDate || null
      }
      
      if (task) {
        // Update existing task
        await updateTask(task.id, taskData)
      } else {
        // Create new task
        await createTask(taskData)
      }
      
      onClose()
    } catch (err) {
      // Error is handled in the task context
    }
  }

  return (
    <Card bg={cardBg} boxShadow="xl" borderRadius="xl" mb={6}>
      <CardHeader>
        <Heading size="md" color={textColor}>
          {task ? 'Edit Task' : 'Create New Task'}
        </Heading>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!formErrors.title}>
              <FormLabel color={textColor}>Title</FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                bg={inputBg}
                borderColor={inputBorder}
              />
              <FormErrorMessage>{formErrors.title}</FormErrorMessage>
            </FormControl>
            
            <FormControl>
              <FormLabel color={textColor}>Description (optional)</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description"
                bg={inputBg}
                borderColor={inputBorder}
                rows={3}
              />
            </FormControl>
            
            <FormControl>
              <FormLabel color={textColor}>Priority</FormLabel>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                bg={inputBg}
                borderColor={inputBorder}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel color={textColor}>Due Date (optional)</FormLabel>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                bg={inputBg}
                borderColor={inputBorder}
              />
            </FormControl>
            
            <HStack spacing={4} pt={2}>
              <Button
                type="submit"
                colorScheme="blue"
                leftIcon={<CheckIcon />}
                isLoading={isLoading}
                flex="1"
              >
                {task ? 'Update Task' : 'Create Task'}
              </Button>
              <Button
                onClick={onClose}
                colorScheme="gray"
                leftIcon={<CloseIcon />}
                isDisabled={isLoading}
                flex="1"
              >
                Cancel
              </Button>
            </HStack>
          </VStack>
        </form>
      </CardBody>
    </Card>
  )
}

export default TaskForm