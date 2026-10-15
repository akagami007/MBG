<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau Password salah.'
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Akun dinonaktifkan.'
            ], 401);
        }

        // Issue Sanctum Token with role-based abilities
        $abilities = $this->getAbilitiesForRole($user->role);
        $token = $user->createToken('mbg-auth-token', $abilities)->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'organization_id' => $user->organization_id,
                    'abilities' => $abilities
                ]
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.'
        ]);
    }

    public function profile(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user()->load('organization')
        ]);
    }

    // ── Admin: User Management ──

    public function listUsers(Request $request)
    {
        $query = User::with('organization');

        if ($request->has('role')) {
            $query->byRole($request->role);
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'total' => $users->total()
            ]
        ]);
    }

    public function createUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:' . implode(',', User::ALL_ROLES),
            'organization_id' => 'nullable|uuid|exists:organizations,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => $request->role,
            'organization_id' => $request->organization_id,
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil dibuat.',
            'data' => $user->load('organization')
        ], 201);
    }

    public function updateUser(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:8',
            'role' => 'sometimes|in:' . implode(',', User::ALL_ROLES),
            'organization_id' => 'nullable|uuid|exists:organizations,id',
            'is_active' => 'sometimes|boolean',
        ]);

        $data = $request->only(['name', 'email', 'role', 'organization_id', 'is_active']);

        if ($request->has('password')) {
            $data['password'] = $request->password;
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil diperbarui.',
            'data' => $user->fresh()->load('organization')
        ]);
    }

    public function deleteUser(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        // Prevent deleting yourself
        if ($user->id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus akun sendiri.'
            ], 422);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User berhasil dihapus.'
        ]);
    }

    /**
     * Map role to Sanctum token abilities (for fine-grained checks if needed)
     */
    private function getAbilitiesForRole(string $role): array
    {
        return match ($role) {
            'SUPERADMIN' => ['*'],
            'AUDITOR' => [
                'trace:read', 'incidents:read', 'incidents:write',
                'blockchain:read', 'finops:read', 'reports:read',
                'geo:read', 'ai:chat', 'vendors:read',
            ],
            'QUALITY_REVIEWER' => [
                'trace:read', 'incidents:read', 'incidents:write',
                'reports:read', 'geo:read', 'ai:chat', 'vendors:read',
            ],
            'DATA_STEWARD' => [
                'trace:read', 'import:write', 'telemetry:write',
            ],
            'SUPPLIER_CONTACT' => [
                'vendor:read', 'vendor:write',
            ],
            'SPPG' => [
                'vendor:read', 'vendor:write',
                'batches:read', 'batches:write',
            ],
            'PIC_SCHOOL' => [
                'distributions:receive', 'incidents:read', 'incidents:write',
            ],
            default => [],
        };
    }
}
