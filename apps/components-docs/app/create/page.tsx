import Link from "next/link";

export default function CreatePage() {
  return (
    <div className="py-20">
      <div className="prose dark:prose-invert prose-neutral max-w-2xl mx-auto">
        <h1>Create your own connector</h1>
        <p>
          In order to create your own connector you'll need to do the following:
        </p>
        <ol>
          <li>
            Install the connector factory CLI (includes an MCP to speed up
            development)
          </li>
          <li>
            Initialize a project with your connector scaffold in the language of
            your choice
          </li>
          <li>
            Follow the spec or ask your favorite AI to generate the connector
            for you
          </li>
          <li>
            <Link href="/share">Share</Link> your connector to the connectors
            hub (optional)
          </li>
        </ol>
      </div>
    </div>
  );
}
