import React from 'react'
import {
  VStack,
  Text,
  Spinner,
  Box,
  useColorModeValue,
  Heading
} from '@chakra-ui/react'
import { useTasks } from '../context/TaskContext'
import TaskItem from './TaskItem'

const TaskList = ({ onEditTask }) => {
  const { tasks, isLoading, error } = useTasks()
  
  const textColor = useColorModeValue('gray.800', 'white')
  const subTextColor = useColorModeValue('gray.600', 'gray.300')

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
        <Text mt={4} color={subTextColor}>Loading tasks...</Text>
      </Box>
    )
  }

  if (error) {
    return (
      <Box textAlign="center" py={10}>
        <Text color="red.500">Error: {error}</Text>
      </Box>
    )
  }

  if (tasks.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Heading size="md" color={textColor} mb={2}>No tasks found</Heading>
        <Text color={subTextColor}>
          Create a new task to get started
        </Text>
      </Box>
    )
  }

  return (
    <VStack spacing={4} align="stretch" mt={4}>
      {tasks.map(task => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onEdit={() => onEditTask(task)} 
        />
      ))}
    </VStack>
  )
}

export default TaskList