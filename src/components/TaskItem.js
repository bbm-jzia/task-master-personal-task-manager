import React from 'react'
import {
  Card,
  CardBody,
  Checkbox,
  Text,
  HStack,
  VStack,
  Button,
  Badge,
  useColorModeValue,
  Flex,
  Spacer,
  Box
} from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { useTasks } from '../context/TaskContext'

const TaskItem = ({ task, onEdit }) => {
  const { toggleTaskCompletion, deleteTask, isLoading } = useTasks()
  
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'white')
  const subTextColor = useColorModeValue('gray.600', 'gray.300')
  
  const handleToggleCompletion = () => {
    toggleTaskCompletion(task.id, task.completed)
  }
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id)
    }
  }
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red'
      case 'medium': return 'orange'
      case 'low': return 'green'
      default: return 'gray'
    }
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }
  
  const isOverdue = () => {
    if (!task.due_date || task.completed) return false
    const dueDate = new Date(task.due_date)
    const today = new Date()
    return dueDate < today
  }

  return (
    <Card 
      bg={cardBg} 
      boxShadow="md" 
      borderRadius="lg"
      borderLeft="4px solid"
      borderLeftColor={task.completed ? 'green.400' : getPriorityColor(task.priority) + '.400'}
      opacity={task.completed ? 0.8 : 1}
    >
      <CardBody>
        <Flex align="start">
          <Checkbox 
            isChecked={task.completed}
            onChange={handleToggleCompletion}
            colorScheme="green"
            size="lg"
            mr={3}
            isDisabled={isLoading}
          />
          
          <VStack align="start" spacing={1} flex="1">
            <Text 
              fontSize="lg" 
              fontWeight="medium" 
              color={textColor}
              textDecoration={task.completed ? 'line-through' : 'none'}
            >
              {task.title}
            </Text>
            
            {task.description && (
              <Text 
                color={subTextColor}
                textDecoration={task.completed ? 'line-through' : 'none'}
              >
                {task.description}
              </Text>
            )}
            
            <HStack spacing={2} mt={1}>
              {task.priority && (
                <Badge colorScheme={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
              )}
              
              {task.due_date && (
                <Badge 
                  colorScheme={isOverdue() ? 'red' : 'blue'}
                >
                  {formatDate(task.due_date)}
                </Badge>
              )}
              
              {task.completed && (
                <Badge colorScheme="green">Completed</Badge>
              )}
            </HStack>
          </VStack>
          
          <Spacer />
          
          <HStack>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="blue"
              leftIcon={<EditIcon />}
              onClick={onEdit}
              isDisabled={isLoading}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="red"
              leftIcon={<DeleteIcon />}
              onClick={handleDelete}
              isDisabled={isLoading}
            >
              Delete
            </Button>
          </HStack>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default TaskItem