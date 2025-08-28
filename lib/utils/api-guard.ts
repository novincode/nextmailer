import { NextRequest, NextResponse } from 'next/server';

// API Guard utility for protecting API routes
export interface ApiGuardOptions {
  key?: string;
  errorMessage?: string;
  errorStatus?: number;
}

export function withApiGuard<T extends any[], R>(
  handler: (req: NextRequest, ...args: T) => Promise<NextResponse<R>>,
  options: ApiGuardOptions = {}
) {
  const {
    key = process.env.API_GUARD_KEY,
    errorMessage = 'Unauthorized',
    errorStatus = 401
  } = options;

  return async (req: NextRequest, ...args: T): Promise<NextResponse<R | { error: string }>> => {
    // Check if API guard key exists
    if (!key) {
      console.error('API_GUARD_KEY not configured');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    // Get authorization header
    const authHeader = req.headers.get('authorization');
    const providedKey = authHeader?.replace('Bearer ', '');

    // Validate API key
    if (!providedKey || providedKey !== key) {
      return NextResponse.json(
        { error: errorMessage },
        { status: errorStatus }
      );
    }

    // Call the original handler
    return handler(req, ...args);
  };
}

// Convenience function for simple API protection
export function requireApiKey(req: NextRequest): boolean {
  const key = process.env.API_GUARD_KEY;
  if (!key) return false;

  const authHeader = req.headers.get('authorization');
  const providedKey = authHeader?.replace('Bearer ', '');

  return providedKey === key;
}

// Type-safe wrapper for API routes with params
export interface ApiRouteParams<T = Record<string, string>> {
  params: T;
}

export function withApiGuardAndParams<T extends Record<string, string>, R>(
  handler: (req: NextRequest, context: ApiRouteParams<T>) => Promise<NextResponse<R>>,
  options: ApiGuardOptions = {}
) {
  return withApiGuard(
    async (req: NextRequest, context: ApiRouteParams<T>) => {
      return handler(req, context);
    },
    options
  );
}
