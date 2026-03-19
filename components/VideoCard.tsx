import Image from "next/image";
import Link from "next/link";

type VideoCardProps = {
  id: string;
  youtubeId: string;
  lessonNumber: number;
  title: string;
  chapter?: string | null;
  durationMinutes?: number | null;
};

export default function VideoCard({
  id,
  youtubeId,
  lessonNumber,
  title,
  chapter,
  durationMinutes,
}: VideoCardProps) {
  return (
    <Link
      href={`/ar/videos/${id}`}
      className="group block bg-card border border-border border-t-accent border-t rounded hover:border-accent transition-colors"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Lesson number badge */}
        <span className="absolute top-2 left-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded font-naskh">
          {lessonNumber}
        </span>
        {/* Duration */}
        {durationMinutes && (
          <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-naskh">
            {durationMinutes} د
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-amiri text-sm font-bold text-foreground leading-relaxed line-clamp-2">
          {title}
        </h3>
        {chapter && (
          <p className="font-naskh text-xs text-foreground/60 mt-1 line-clamp-1">
            {chapter}
          </p>
        )}
      </div>
    </Link>
  );
}
