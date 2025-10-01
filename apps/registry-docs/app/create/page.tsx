import CreateContent from "@/content/docs/create.mdx";

export default function CreatePage() {
  return (
    <div className="py-20 p-5">
      <div className="prose dark:prose-invert prose-neutral max-w-2xl mx-auto">
        <CreateContent />
      </div>
    </div>
  );
}
