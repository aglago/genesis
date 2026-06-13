export default function LandingPage() {
  return (
    <main>
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight">Welcome</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          A modern informational website built with Genesis.
        </p>
        <a
          href="#contact"
          className="mt-8 inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground"
        >
          Get in touch
        </a>
      </section>

      <section id="contact" className="border-t py-24">
        <div className="container mx-auto max-w-lg px-6">
          <h2 className="text-3xl font-bold">Contact Us</h2>
          <form className="mt-8 space-y-4">
            <input
              className="flex h-10 w-full rounded-md border px-3 text-sm"
              placeholder="Name"
              type="text"
            />
            <input
              className="flex h-10 w-full rounded-md border px-3 text-sm"
              placeholder="Email"
              type="email"
            />
            <textarea
              className="flex min-h-32 w-full rounded-md border px-3 py-2 text-sm"
              placeholder="Message"
            />
            <button
              type="submit"
              className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
