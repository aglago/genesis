import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@genesis/ui";
import { ContactForm } from "@/components/contact-form";

export default function LandingPage() {
  return (
    <main>
      <section className="container mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl flex-col items-center justify-center px-6 py-24 text-center">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
            Built with Genesis
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Build something people remember
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            A modern informational website with shadcn-style components, branding, and a contact form
            ready to extend.
          </p>
          <a href="#contact">
            <Button className="mt-10" size="lg">
              Get in touch
            </Button>
          </a>
        </section>

        <section id="contact" className="border-t bg-muted/30 py-24">
          <div className="container mx-auto max-w-lg px-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact us</CardTitle>
                <CardDescription>
                  Send a message — validated server-side. Add{" "}
                  <code className="genesis-inline-code">@genesis/emails</code> to deliver to your inbox.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
  );
}
