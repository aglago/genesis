import { Card, CardHeader, CardTitle, CardContent, Input, Button } from "@genesis/ui";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="App Name" defaultValue="My App" />
          <Input placeholder="Support Email" defaultValue="support@example.com" />
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
