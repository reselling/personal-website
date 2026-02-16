export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Hey, I&apos;m Mario.</h1>
      <p className="text-foreground/70 leading-relaxed">
        I&apos;m a developer who builds things for the web. Welcome to my
        corner of the internet where I share my projects and what I&apos;m
        currently into.
      </p>
      <p className="text-foreground/70 leading-relaxed">
        Check out my{" "}
        <a href="/projects" className="underline hover:text-foreground">
          projects
        </a>{" "}
        or see what I&apos;m{" "}
        <a href="/now" className="underline hover:text-foreground">
          up to now
        </a>
        .
      </p>
    </div>
  );
}
