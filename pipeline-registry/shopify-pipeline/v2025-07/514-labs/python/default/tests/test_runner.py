def test_ping():
    from pipeline_shopify.runner import PipelineRunner
    assert PipelineRunner({}).ping() is True
