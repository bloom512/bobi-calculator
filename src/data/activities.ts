import { supabase } from '@/lib/supabase'
import { Activity } from '@/types'

// 本地 fallback 数据
const fallbackActivities: Activity[] = [
  {
    id: '1',
    name: '春季活动',
    formula_c: 'A*a-B+48',
    formula_d: 'B*b-A+46',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: '夏日挑战',
    formula_c: 'A*a+B*0.5',
    formula_d: 'B*b+A*0.3',
    created_at: '2024-06-01T00:00:00Z'
  },
  {
    id: '3',
    name: '秋季特惠',
    formula_c: '(A+B)*a',
    formula_d: '(B-A)*b+30',
    created_at: '2024-09-01T00:00:00Z'
  }
]

export async function getActivities(): Promise<Activity[]> {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .timeout(5000) // 5秒超时
    
    if (error) {
      console.warn('Supabase connection failed, using fallback data:', error)
      return fallbackActivities
    }
    
    return data && data.length > 0 ? data : fallbackActivities
  } catch {
    console.warn('Network error, using fallback data')
    return fallbackActivities
  }
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
