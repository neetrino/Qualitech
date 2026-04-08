/**
 * Renders CMS HTML stored for blog posts. Content is authored via admin tools only.
 */
type BlogProseProps = {
  readonly html: string;
};

const PROSE_CLASS =
  "blog-prose max-w-none text-[15px] leading-7 text-[#d4d4d8] [&_a]:text-[#ff6900] [&_a]:underline-offset-2 hover:[&_a]:brightness-110 [&_blockquote]:border-l-2 [&_blockquote]:border-[#ff6900] [&_blockquote]:pl-4 [&_blockquote]:text-[#a1a1aa] [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:uppercase [&_h2]:tracking-tight [&_h2]:text-white [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_li]:marker:text-[#ff6900] [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_p:first-child]:mt-0 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6";

export function BlogProse({ html }: BlogProseProps) {
  return <div className={PROSE_CLASS} dangerouslySetInnerHTML={{ __html: html }} />;
}
