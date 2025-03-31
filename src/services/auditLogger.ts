
// Audit logging service for tracking DeepCAL decision-making
// Provides transparent record of all algorithm outputs

interface AuditEntry {
  timestamp: string;
  operation: string;
  inputData: any;
  outputData: any;
  parameters: any;
  dataVersion: string;
  datasetHash: string;
  sessionId: string;
}

const auditLog: AuditEntry[] = [];

// Generate a unique session ID
function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Current session ID for tracking operations
let currentSessionId = generateSessionId();

// Reset the session ID (e.g., on user logout)
export function resetSessionId(): void {
  currentSessionId = generateSessionId();
}

// Log an audit trail entry for algorithm operations
export function logAuditTrail(
  operation: string,
  inputData: any,
  outputData: any,
  parameters: any,
  dataVersion: string,
  datasetHash: string
): void {
  const auditEntry: AuditEntry = {
    timestamp: new Date().toISOString(),
    operation,
    inputData,
    outputData,
    parameters,
    dataVersion,
    datasetHash,
    sessionId: currentSessionId
  };
  
  auditLog.push(auditEntry);
  
  // In a production system, this would be persisted to a database
  console.log(`Audit trail: ${operation} at ${auditEntry.timestamp} [${dataVersion}]`);
}

// Get the entire audit log
export function getAuditLog(): AuditEntry[] {
  return [...auditLog];
}

// Get audit entries for a specific operation
export function getAuditEntriesByOperation(operation: string): AuditEntry[] {
  return auditLog.filter(entry => entry.operation === operation);
}

// Get audit entries for a specific data version
export function getAuditEntriesByVersion(dataVersion: string): AuditEntry[] {
  return auditLog.filter(entry => entry.dataVersion === dataVersion);
}

// Clear the audit log (for testing purposes)
export function clearAuditLog(): void {
  auditLog.length = 0;
}

// Get audit statistics
export function getAuditStats(): Record<string, any> {
  const operations: Record<string, number> = {};
  const versions: Record<string, number> = {};
  
  auditLog.forEach(entry => {
    operations[entry.operation] = (operations[entry.operation] || 0) + 1;
    versions[entry.dataVersion] = (versions[entry.dataVersion] || 0) + 1;
  });
  
  return {
    totalEntries: auditLog.length,
    operationBreakdown: operations,
    versionBreakdown: versions,
    firstEntry: auditLog[0]?.timestamp || null,
    lastEntry: auditLog[auditLog.length - 1]?.timestamp || null
  };
}
