
interface RequestLog {
  timestamp: number;
  type: 'video' | 'upload';
}

interface UserRequestPattern {
  requests: RequestLog[];
  cooldownUntil?: number;
}

const COOLDOWN_DURATION = 600000; // 10 minutes in milliseconds
const MAX_REQUESTS_PER_MINUTE = 2;  // Changed from 1 to 2
const PATTERN_WINDOW = 60000; // 1 minute in milliseconds

class RequestMonitor {
  private static requestPatterns: Record<string, UserRequestPattern> = {};

  static checkRequestAllowed(userId: string, type: 'video' | 'upload'): { allowed: boolean; message?: string } {
    const now = Date.now();
    const pattern = this.requestPatterns[userId] || { requests: [] };

    // Check if user is in cooldown
    if (pattern.cooldownUntil && now < pattern.cooldownUntil) {
      const remainingMinutes = Math.ceil((pattern.cooldownUntil - now) / 60000);
      return {
        allowed: false,
        message: `Please wait ${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'} before making another request.`
      };
    }

    // Clean up old requests
    pattern.requests = pattern.requests.filter(
      req => (now - req.timestamp) < PATTERN_WINDOW
    );

    // Check for rapid succession requests
    if (pattern.requests.length >= MAX_REQUESTS_PER_MINUTE) {
      // Enforce cooldown period
      pattern.cooldownUntil = now + COOLDOWN_DURATION;
      return {
        allowed: false,
        message: "Rate limit exceeded. Please wait 10 minutes before trying again."
      };
    }

    // Log this request
    pattern.requests.push({ timestamp: now, type });
    this.requestPatterns[userId] = pattern;

    return { allowed: true };
  }

  static isUnusualPattern(userId: string): boolean {
    const pattern = this.requestPatterns[userId];
    if (!pattern) return false;

    const now = Date.now();
    const recentRequests = pattern.requests.filter(
      req => (now - req.timestamp) < PATTERN_WINDOW
    );

    // Example of unusual patterns:
    // 1. More than 3 requests within 10 seconds
    const rapidRequests = recentRequests.filter(
      req => (now - req.timestamp) < 10000
    );
    if (rapidRequests.length > 3) return true;

    // 2. Alternating types rapidly (potential automation)
    if (recentRequests.length >= 4) {
      let alternatingCount = 0;
      for (let i = 1; i < recentRequests.length; i++) {
        if (recentRequests[i].type !== recentRequests[i-1].type) {
          alternatingCount++;
        }
      }
      if (alternatingCount >= 3) return true;
    }

    return false;
  }
}

export default RequestMonitor;
