import Image from "next/image";
import { Project } from "@/types/project";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group rounded-lg border border-foreground/10 overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative aspect-video bg-foreground/5">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold">{project.title}</h3>
        <p className="text-sm text-foreground/60">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/70"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-3 pt-1">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline hover:text-foreground text-foreground/60"
            >
              Live
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline hover:text-foreground text-foreground/60"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
