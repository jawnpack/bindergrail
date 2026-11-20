import Kicker from "@/components/ui/Kicker";

type Props = {
  title: string;
  tag: string;
  date: string;
  dateTime: string;
  readingMinutes: number;
  lede?: string;
};

// The article title block, set like a printed page: kicker, headline, lede,
// a meta line, and a hairline rule beneath that hands off to the body.
export default function ArticleHero({ title, tag, date, dateTime, readingMinutes, lede }: Props) {
  return (
    <header className="mb-10 border-b border-cream-hairline pb-8">
      <Kicker className="mb-4">{tag}</Kicker>
      <h1 className="font-serif text-display-l text-balance text-on-cream">{title}</h1>
      {lede ? (
        <p className="mt-5 max-w-measure text-lead text-pretty text-on-cream-muted">{lede}</p>
      ) : null}
      <p className="figures mt-6 text-meta text-on-cream-muted">
        <time dateTime={dateTime}>{date}</time>
        <span aria-hidden="true" className="mx-2">·</span>
        {readingMinutes} min read
      </p>
    </header>
  );
}
