import { useState, useEffect } from 'react'
import { Activity } from '@/types'
import { getActivities, createActivity, updateActivity, deleteActivity } from '@/data/activities'
import { ActivityForm } from '@/components/ActivityForm'
import Link from 'next/link'

export default function AdminPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    setIsLoading(true)
    const data = await getActivities()
    setActivities(data)
    setIsLoading(false)
  }

  const handleSubmit = async (data: { name: string; formula_c: string; formula_d: string }) => {
    let success = false

    if (editingActivity) {
      const updated = await updateActivity(editingActivity.id, data)
      success = !!updated
    } else {
      const created = await createActivity(data)
      success = !!created
    }

    if (success) {
      setMessage({ type: 'success', text: editingActivity ? '修改成功' : '创建成功' })
      setShowForm(false)
      setEditingActivity(null)
      await loadActivities()
    } else {
      setMessage({ type: 'error', text: '操作失败，请重试' })
    }

    setTimeout(() => setMessage(null), 3000)
  }

  const handleDelete = async (id: string) => {
    const success = await deleteActivity(id)
    if (success) {
      setMessage({ type: 'success', text: '删除成功' })
      setDeleteConfirm(null)
      await loadActivities()
    } else {
      setMessage({ type: 'error', text: '删除失败，请重试' })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingActivity(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-safe">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <button className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl shadow-soft hover:shadow-hover transition-all duration-200 border border-gray-200">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">活动管理</h1>
          </div>
{!showForm && (
          <button
            onClick={() => {
              setEditingActivity(null)
              setShowForm(true)
            }}
            className="px-4 py-2 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors duration-200 shadow-soft"
          >
            新增活动
          </button>
        )}
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {showForm ? (
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingActivity ? '编辑活动' : '新增活动'}
            </h2>
            <ActivityForm
              activity={editingActivity}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">加载中...</div>
            ) : activities.length === 0 ? (
              <div className="p-8 text-center text-gray-500">暂无活动，点击右上角新增</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {activities.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-gray-100 transition-colors duration-150">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800">{activity.name}</h3>
                        <div className="mt-1 text-sm text-gray-600 space-y-1">
                        <p><span className="text-gray-500">C公式:</span> {activity.formula_c}</p>
                        <p><span className="text-gray-500">D公式:</span> {activity.formula_d}</p>
                      </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(activity)}
                          className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {deleteConfirm === activity.id ? (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleDelete(activity.id)}
                              className="w-10 h-10 flex items-center justify-center bg-red-200 rounded-xl hover:bg-red-300 transition-colors duration-200"
                            >
                              <svg className="w-4 h-4 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors duration-200"
                            >
                              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(activity.id)}
                            className="w-10 h-10 flex items-center justify-center bg-red-100 rounded-xl hover:bg-red-200 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
