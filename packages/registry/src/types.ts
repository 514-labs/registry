export type ConnectorRootMeta = {
  $schema?: string;
  name: string;
  title?: string;
  version?: string;
  category?: string;
  tags?: string[];
  description?: string;
  homepage?: string;
  registryUrl?: string;
};

export type ProviderMeta = {
  $schema?: string;
  name: string;
  author: string;
  // The type of the author/creator. Determines how avatars are fetched.
  authorType?: "user" | "organization";
  // Optional URL to override the avatar source. If set, this URL is used directly.
  avatarUrlOverride?: string;
  version?: string;
  languages?: string[];
  tags?: string[];
  category?: string;
  description?: string;
  homepage?: string;
  registryUrl?: string;
  license?: string;
  source?: Record<string, unknown>;
  capabilities?: Record<string, unknown>;
  maintainers?: Array<Record<string, unknown>>;
  // Map of GitHub issues tracking implementations.
  // Backwards compatible:
  // - { [language]: string } maps a language directly to an issue URL
  // - { [language]: { [implementation]: string } } maps (language, implementation) to URL
  issues?: Record<string, string | Record<string, string>>;
};

export type RegistryConnector = {
  connectorId: string; // e.g. "google-analytics"
  root: {
    path: string;
    meta?: ConnectorRootMeta;
  };
  providers: Array<{
    authorId: string; // e.g. "514-labs"
    path: string;
    meta?: ProviderMeta;
    implementations: Array<{
      language: string; // e.g. "typescript" | "python"
      implementation: string; // e.g. "data-api" | "default"
      path: string;
    }>;
  }>;
};
