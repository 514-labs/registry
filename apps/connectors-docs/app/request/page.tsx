import { Suspense } from "react";
import { RequestConnectorForm } from "./request-form";

export default function RequestPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 xl:px-0 py-6">
      <h1 className="text-2xl font-semibold mb-2">Request a connector</h1>
      <p className="text-muted-foreground mb-6">
        Tell us what you need. We’ll open an issue so others can upvote it.
      </p>
      <Suspense fallback={null}>
        <RequestConnectorForm />
      </Suspense>
    </div>
  );
}
