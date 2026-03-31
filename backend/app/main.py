from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas.api import (
    AnalyzeRequest,
    AnalyzeResponse,
    ConvertRequest,
    ConvertResponse,
)
from app.core.orchestrator import OrchestratorService

app = FastAPI(
    title="NOC Orchestrator API",
    version="0.1.0",
    description="Multi-vendor network config analyzer and converter"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

service = OrchestratorService()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):
    try:
        vendor, confidence, data = service.analyze(
            raw_config=request.raw_config,
            source_vendor=request.source_vendor
        )
        return AnalyzeResponse(
            detected_vendor=vendor,
            confidence=confidence,
            data=data
        )
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/convert", response_model=ConvertResponse)
def convert(request: ConvertRequest):
    try:
        vendor, confidence, data = service.analyze(
            raw_config=request.raw_config,
            source_vendor=request.source_vendor
        )
        generated = service.generate(data, request.target_vendor)

        return ConvertResponse(
            detected_vendor=vendor,
            confidence=confidence,
            target_vendor=request.target_vendor,
            data=data,
            generated_config=generated
        )
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))