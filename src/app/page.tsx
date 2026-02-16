import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden">
        <Image
          src="/images/banner.JPG"
          alt="Banner"
          fill
          className="object-cover"
          priority
        />
      </div>
      <h1 className="text-3xl font-bold">Hey, I&apos;m Mario.</h1>
      <p className="text-foreground/70 leading-relaxed">
        I&apos;m a student studying Economics and Data Science at Northwestern who builds things as a hobby. Welcome to my
        site where I share my current projects and what I&apos;m
        currently into.
      </p>
      <p className="text-foreground/70 leading-relaxed">
        Check out my{" "}
        <a href="/projects" className="underline hover:text-foreground">
          projects
        </a>{" "}
        or see what I&apos;m{" "}
        <a href="/now" className="underline hover:text-foreground">
          consuming at the moment.
        </a>
        .
      </p>
    </div>
  );
}
