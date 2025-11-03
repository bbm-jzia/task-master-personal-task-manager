import React from 'react'
import {
  Box,
  HStack,
  Select,
  Input,
  FormControl,
  FormLabel,
  SimpleGrid,
  useColorModeValue,
  Card,
  CardBody
} from '@chakra-ui/react'
import { useTasks } from '../context/TaskContext'

const TaskFilters = () => {
  const { filters, updateFilters } = useTasks()
  
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'white')
  const inputBg = useColorModeValue('gray.50', 'gray.700')
  const inputBorder = useColorModeValue('gray.300', 'gray.600')

  const handleStatusChange = (e) => {
    updateFilters({ status: e.target.value })
  }

  const handlePriorityChange = (e) => {
    updateFilters({ priority: e.target.value })
  }

  const handleSearchChange = (e) => {
    updateFilters({ search: e.target.value })
  }

  return (
    <Card bg={cardBg} boxShadow="md" borderRadius="lg" mb={6}>
      <CardBody>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <FormControl>
            <FormLabel color={textColor} fontSize="sm">Status</FormLabel>
            <Select
              value={filters.status}
              onChange={handleStatusChange}
              size="md"
              bg={inputBg}
              borderColor={inputBorder}
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </Select>
          </FormControl>
          
          <FormControl>
            <FormLabel color={textColor} fontSize="sm">Priority</FormLabel>
            <Select
              value={filters.priority}
              onChange={handlePriorityChange}
              size="md"
              bg={inputBg}
              borderColor={inputBorder}
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </FormControl>
          
          <FormControl>
            <FormLabel color={textColor} fontSize="sm">Search</FormLabel>
            <Input
              placeholder="Search tasks..."
              value={filters.search}
              onChange={handleSearchChange}
              size="md"
              bg={inputBg}
              borderColor={inputBorder}
            />
          </FormControl>
        </SimpleGrid>
      </CardBody>
    </Card>
  )
}

export default TaskFilters