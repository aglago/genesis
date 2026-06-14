import { Card, CardHeader, CardTitle, CardContent, Input, Button } from "@genesis/ui";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Update your store profile and support details.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Store name" defaultValue="My Store" />
          <Input placeholder="Support email" defaultValue="support@example.com" />
          <Button>Save changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
