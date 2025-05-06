interface TaskCardProps {
  task: {
    title: string
    description: string
    dueDate: string
    priority: string
    status: string
    assignedTo: { username: string } | null
    createdBy: string
  }
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="p-4 border rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold">{task.title}</h3>
      <p>{task.description}</p>
      <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
      <p>Priority: {task.priority}</p>
      <p>Status: {task.status}</p>
      <p>Assigned to: {task.assignedTo ? task.assignedTo.username : 'Not assigned'}</p>
    </div>
  )
}
