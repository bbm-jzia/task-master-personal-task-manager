import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  FormErrorMessage,
  Card,
  CardBody,
  CardHeader,
  Divider,
  HStack
} from '@chakra-ui/react'
import { useAuth } from '../context/AuthContext'

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [formErrors, setFormErrors] = useState({})
  
  const { signIn, signUp, isLoading, error } = useAuth()
  
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'white')
  const subTextColor = useColorModeValue('gray.600', 'gray.300')

  const validateForm = () => {
    const errors = {}
    
    if (!email) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid'
    
    if (!password) errors.password = 'Password is required'
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters'
    
    if (isSignUp && !name) errors.name = 'Name is required'
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      if (isSignUp) {
        await signUp(email, password, name)
      } else {
        await signIn(email, password)
      }
    } catch (err) {
      // Error is handled in the auth context
    }
  }

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp)
    setFormErrors({})
  }

  return (
    <Card bg={cardBg} boxShadow="xl" borderRadius="xl" maxW="md" mx="auto">
      <CardHeader>
        <Heading size="lg" color={textColor} textAlign="center">
          {isSignUp ? 'Create an Account' : 'Sign In'}
        </Heading>
        <Text color={subTextColor} textAlign="center" mt={2}>
          {isSignUp 
            ? 'Create your account to start managing tasks' 
            : 'Sign in to access your tasks'}
        </Text>
      </CardHeader>
      <Divider />
      <CardBody>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            {isSignUp && (
              <FormControl isInvalid={!!formErrors.name}>
                <FormLabel color={textColor}>Name</FormLabel>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  borderColor={useColorModeValue('gray.300', 'gray.600')}
                />
                <FormErrorMessage>{formErrors.name}</FormErrorMessage>
              </FormControl>
            )}
            
            <FormControl isInvalid={!!formErrors.email}>
              <FormLabel color={textColor}>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                bg={useColorModeValue('gray.50', 'gray.700')}
                borderColor={useColorModeValue('gray.300', 'gray.600')}
              />
              <FormErrorMessage>{formErrors.email}</FormErrorMessage>
            </FormControl>
            
            <FormControl isInvalid={!!formErrors.password}>
              <FormLabel color={textColor}>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg={useColorModeValue('gray.50', 'gray.700')}
                borderColor={useColorModeValue('gray.300', 'gray.600')}
              />
              <FormErrorMessage>{formErrors.password}</FormErrorMessage>
            </FormControl>
            
            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}
            
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="full"
              isLoading={isLoading}
              mt={2}
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
            
            <HStack justify="center" width="full" pt={2}>
              <Text color={subTextColor}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </Text>
              <Button
                variant="link"
                colorScheme="blue"
                onClick={toggleAuthMode}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Button>
            </HStack>
          </VStack>
        </form>
      </CardBody>
    </Card>
  )
}

export default AuthForm