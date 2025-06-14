
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/auth';
import { Plus, Mail, Calendar, Trash2 } from 'lucide-react';

const TeamManagement = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load employees from localStorage
    const savedEmployees = localStorage.getItem('baratcx_employees');
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }
  }, []);

  const generateTempCredentials = () => {
    return {
      email: newEmployee.email,
      password: 'temp123', // Temporary password
      tempId: Math.random().toString(36).substr(2, 9)
    };
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmployee.name || !newEmployee.email) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    // Check if email already exists
    if (employees.some(emp => emp.email === newEmployee.email)) {
      toast({
        title: "Error",
        description: "An employee with this email already exists",
        variant: "destructive"
      });
      return;
    }

    const tempCredentials = generateTempCredentials();
    const employee: User = {
      id: `emp-${Date.now()}`,
      name: newEmployee.name,
      email: newEmployee.email,
      role: 'employee',
      isTemporary: true,
      createdAt: new Date().toISOString()
    };

    const updatedEmployees = [...employees, employee];
    setEmployees(updatedEmployees);
    localStorage.setItem('baratcx_employees', JSON.stringify(updatedEmployees));

    toast({
      title: "Employee Added",
      description: `${employee.name} has been added with temporary password: ${tempCredentials.password}`,
    });

    setNewEmployee({ name: '', email: '' });
    setShowAddForm(false);
  };

  const handleRemoveEmployee = (employeeId: string) => {
    const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
    setEmployees(updatedEmployees);
    localStorage.setItem('baratcx_employees', JSON.stringify(updatedEmployees));

    toast({
      title: "Employee Removed",
      description: "Employee has been removed from the team",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Management</h2>
          <p className="text-muted-foreground">Manage your team members and their access</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Employee</CardTitle>
            <CardDescription>Create a new team member account with temporary credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter employee name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter employee email"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">Add Employee</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                * Employee will receive temporary password: <code>temp123</code>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Team Members ({employees.length})</CardTitle>
          <CardDescription>Manage your team members and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No team members yet. Add your first employee to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {employees.map((employee) => (
                <div key={employee.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                        {employee.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-medium">{employee.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {employee.email}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={employee.isTemporary ? 'destructive' : 'default'}>
                        {employee.isTemporary ? 'Temporary' : 'Active'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveEmployee(employee.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Role</p>
                      <p className="font-medium capitalize">{employee.role}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Joined</p>
                      <p className="font-medium">
                        {new Date(employee.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Login</p>
                      <p className="font-medium">
                        {employee.lastLogin 
                          ? new Date(employee.lastLogin).toLocaleDateString()
                          : 'Never'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagement;
