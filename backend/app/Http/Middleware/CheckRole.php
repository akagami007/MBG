<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     * Usage in routes: ->middleware('role:AUDITOR,SUPERADMIN')
     *
     * SUPERADMIN always passes regardless of the specified roles.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.'
            ], 401);
        }

        // SUPERADMIN bypasses all role checks
        if ($user->role === 'SUPERADMIN') {
            return $next($request);
        }

        if (!in_array($user->role, $roles)) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Role Anda (' . $user->role . ') tidak memiliki hak akses ke resource ini.',
                'required_roles' => $roles
            ], 403);
        }

        return $next($request);
    }
}
