import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ejrczxskptcmnkcjpsqe.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqcmN6eHNrcHRjbW5rY2pwc3FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MzY4MDcsImV4cCI6MjA3NzQxMjgwN30.83WjSTYR6pQgv-4t9B1vBreGt2ACI1cS3XudUIVyT2E',
  {
    global: {
      headers: { 'x-webapp-id': '6908336f14985cf56dd63781' }
    }
  }
)

// Simple password hashing (for demo - use proper library in production)
async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export const authHelpers = {
  async signUp(email, password, name) {
    const passwordHash = await hashPassword(password)
    const { data, error } = await supabase
      .from('webapp_users')
      .insert({ 
        webapp_id: '6908336f14985cf56dd63781',
        email, 
        password_hash: passwordHash, 
        name 
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async signIn(email, password) {
    const { data: user, error } = await supabase
      .from('webapp_users')
      .select('*')
      .eq('email', email)
      .single()
    if (error) throw new Error('Invalid credentials')
    
    // Verify password
    const passwordHash = await hashPassword(password)
    if (user.password_hash !== passwordHash) {
      throw new Error('Invalid credentials')
    }
    
    return user
  },

  async signOut() {
    // Clear local session
    return true
  }
}

export const db = {
  async getAll(tableName) {
    const { data, error } = await supabase.from(tableName).select('*')
    if (error) throw error
    return data
  },

  async getByUserId(tableName, userId) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('user_id', userId)
    if (error) throw error
    return data
  },

  async create(tableName, values) {
    // Always include webapp_id for multi-tenant isolation
    const dataWithWebappId = {
      ...values,
      webapp_id: '6908336f14985cf56dd63781'
    }
    const { data, error } = await supabase.from(tableName).insert(dataWithWebappId).select().single()
    if (error) throw error
    return data
  },

  async update(tableName, id, values) {
    const { data, error } = await supabase.from(tableName).update(values).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async delete(tableName, id) {
    const { error } = await supabase.from(tableName).delete().eq('id', id)
    if (error) throw error
  }
}

export default supabase