import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Card, CardHeader, CardTitle, CardContent } from "@genesis/ui";

export default function UsersPage() {
  const users = [
    { id: "1", email: "admin@example.com", role: "Admin", status: "Active" },
    { id: "2", email: "user@example.com", role: "Member", status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Users</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Manage team access and customer accounts.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All users</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
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
