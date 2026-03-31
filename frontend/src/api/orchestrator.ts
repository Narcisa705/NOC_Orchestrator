import axios from "axios";
import type {
  AnalyzeRequest,
  AnalyzeResponse,
  ConvertRequest,
  ConvertResponse,
} from "../types";

const API_BASE = "http://127.0.0.1:8000";

export async function analyzeConfig(
  payload: AnalyzeRequest
): Promise<AnalyzeResponse> {
  const response = await axios.post<AnalyzeResponse>(`${API_BASE}/analyze`, payload);
  return response.data;
}

export async function convertConfig(
  payload: ConvertRequest
): Promise<ConvertResponse> {
  const response = await axios.post<ConvertResponse>(`${API_BASE}/convert`, payload);
  return response.data;
}