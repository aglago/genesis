import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Card, CardHeader, CardTitle, CardContent } from "@genesis/ui";

export default function UsersPage() {
  const users = [
    { id: "1", email: "admin@example.com", role: "admin", status: "Active" },
    { id: "2", email: "user@example.com", role: "user", status: "Active" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Users</h1>
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
