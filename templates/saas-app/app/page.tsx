export default function SaasHome() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">SaaS Starter</h1>
      <p className="mt-4 text-muted-foreground">Launch your product faster with Genesis.</p>
      <div className="mt-8 flex gap-4">
        <a href="/register" className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground">
          Get Started
        </a>
        <a href="/login" className="inline-flex h-10 items-center rounded-md border px-6 text-sm font-medium">
          Sign In
        </a>
      </div>
    </main>
  );
}
