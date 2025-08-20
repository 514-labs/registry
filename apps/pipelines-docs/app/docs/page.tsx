import Thesis from "@/content/docs/introduction.mdx";
import Lineage from "@/content/docs/lineage.mdx";

function Docs() {
  return (
    <div className="prose dark:prose-invert prose-neutral max-w-none space-y-12">
      <Thesis />
      <Lineage />
    </div>
  );
}

export default Docs;
