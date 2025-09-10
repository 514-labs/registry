import ApiDocs from "@/content/docs/api.mdx";

function ApiPage() {
  return (
    <div className="prose dark:prose-invert prose-neutral max-w-none">
      <ApiDocs />
    </div>
  );
}

export default ApiPage;
