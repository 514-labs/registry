class PipelineRunner:
    def __init__(self, config: dict):
        self.config = config

    def ping(self) -> bool:
        return True
