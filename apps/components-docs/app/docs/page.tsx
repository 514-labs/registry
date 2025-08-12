import Thesis from "@/content/docs/introduction.mdx";

function Docs() {
  return (
    <div
      className="prose dark:prose-invert prose-neutral max-w-none"
      data-pagefind-filter="type:docs"
    >
      <Thesis />
    </div>
  );
}

export default Docs;
