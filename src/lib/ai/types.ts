import { z } from "zod";
import {
  JobAnalysisSchema,
  GapAnalysisSchema,
  RewriteResultSchema,
  TailorResultSchema,
} from "./schemas";

export type AIJobAnalysis = z.infer<typeof JobAnalysisSchema>;
export type AIGapAnalysis = z.infer<typeof GapAnalysisSchema>;
export type AIRewriteResult = z.infer<typeof RewriteResultSchema>;
export type AITailorResult = z.infer<typeof TailorResultSchema>;
