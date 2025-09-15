import EmployeeLeaveRequestForm from '@/components/Employees/EmployeeLeaveRequestForm'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarDays, ClipboardList, User, Clock, CheckCircle, Clock4, XCircle } from 'lucide-react'

export default function EmployeeDashboard() {
  // Static data for the dashboard
  const leaveBalance = [
    { type: 'Annual Leave', used: 5, total: 20 },
    { type: 'Sick Leave', used: 2, total: 10 },
    { type: 'Personal Leave', used: 1, total: 5 }
  ]

  const upcomingLeaves = [
    { id: 1, type: 'Annual Leave', startDate: '2023-12-15', endDate: '2023-12-20', status: 'approved' },
    { id: 2, type: 'Sick Leave', startDate: '2024-01-05', endDate: '2024-01-06', status: 'pending' }
  ]

  const recentActivity = [
    { id: 1, action: 'Leave request submitted', date: '2023-11-15', type: 'Annual Leave' },
    { id: 2, action: 'Leave approved', date: '2023-10-28', type: 'Sick Leave' }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Welcome back, John Doe</span>
          <Button variant="outline" size="sm">
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Quick Stats Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Years of Service</p>
                <p className="text-2xl font-bold">2.5</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Leaves Taken</p>
                <p className="text-2xl font-bold">8/35</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leave Balance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            {leaveBalance.map((leave) => (
              <div key={leave.type} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{leave.type}</span>
                  <span>{leave.total - leave.used} days left</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(leave.used / leave.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Leaves Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Upcoming Leaves</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingLeaves.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming leaves</p>
            ) : (
              upcomingLeaves.map((leave) => (
                <div key={leave.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{leave.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  {leave.status === 'approved' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : leave.status === 'pending' ? (
                    <Clock4 className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Leave Request Form Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Request New Leave</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeeLeaveRequestForm />
        </CardContent>
      </Card>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-gray-100">
                  <ClipboardList className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.type} • {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}