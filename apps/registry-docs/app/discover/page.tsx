import {
  buildDiscoverConnectors,
  buildDiscoverPipelines,
} from "@/lib/discover";
import { DiscoveryGridDetailed } from "./discovery-grids";

export default function DiscoverPage() {
  const [connectors, setConnectors] = useState<DiscoverConnector[]>([]);
  const [pipelines, setPipelines] = useState<DiscoverPipeline[]>([]);
  const [loading, setLoading] = useState({ connectors: true, pipelines: true });

  useEffect(() => {
    // Fetch connectors
    fetch('/api/discover/connectors')
      .then(res => res.json())
      .then(data => {
        setConnectors(data);
        setLoading(prev => ({ ...prev, connectors: false }));
      })
      .catch(() => {
        setLoading(prev => ({ ...prev, connectors: false }));
      });

    // Fetch pipelines
    fetch('/api/discover/pipelines')
      .then(res => res.json())
      .then(data => {
        setPipelines(data);
        setLoading(prev => ({ ...prev, pipelines: false }));
      })
      .catch(() => {
        setLoading(prev => ({ ...prev, pipelines: false }));
      });
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 xl:px-0 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Discover</h1>
        <p className="text-muted-foreground mt-1">
          Browse and discover connectors and pipelines for your data
          infrastructure
        </p>
      </div>
      <DiscoveryGridDetailed connectors={connectors} pipelines={pipelines} />
    </div>
  );
}
