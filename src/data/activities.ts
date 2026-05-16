import { supabase } from '@/lib/supabase'
import { Activity } from '@/types'

export async function getActivities(): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching activities:', error)
    return []
  }
  
  return data || []
}

export async function getActivityById(id: string): Promise<Activity | null> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching activity:', error)
    return null
  }
  
  return data
}

export async function createActivity(activity: Omit<Activity, 'id' | 'created_at'>): Promise<Activity | null> {
  const { data, error } = await supabase
    .from('activities')
    .insert([activity])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating activity:', error)
    return null
  }
  
  return data
}

export async function updateActivity(id: string, updates: Partial<Activity>): Promise<Activity | null> {
  const { data, error } = await supabase
    .from('activities')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating activity:', error)
    return null
  }
  
  return data
}

export async function deleteActivity(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting activity:', error)
    return false
  }
  
  return true
}
