type ProjectOverview = {
  id: string;
  projectId: string;
  postgresBytes: number;
  mongoBytes: number;
  restRequestsTotal: number;
  restRead: number;
  restWrite: number;
  authRequests: number;
  errorCount: number;
  totalLatencyMs: number;
  samples: number;
  updatedAt: string; // ISO timestamp
};
export default ProjectOverview;
