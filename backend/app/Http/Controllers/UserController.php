<?php

namespace App\Http\Controllers;

use App\Models\Order_item;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'username' => 'required',
            'email' => 'required|email',
            'password' => 'required',
            'role' => 'required',
            'image' => 'nullable|image|mimes:png,jpeg,gif,svg,webp|max:2048'
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
        }

        $validatedData['password'] = Hash::make($validatedData['password']);

        $users = User::create($validatedData);

        return response()->json([
            'message' => 'Registered Successfully',
            'User' => $users
        ], 200);
    }


    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'Error' => 'Incorrect Username or Password'
            ]);
        }

        $token = $user->createToken('user-auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login Successfully',
            'User' => $user,
            'Token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logout Successfully'
        ]);
    }

    public function index()
    {
        $userProfile = User::find(1);

        if (!$userProfile) {
            return response()->json([
                'error' => 'User not found',
            ], 404);
        }

        return response()->json([
            'user' => $userProfile,
        ]);
    }

    public function updateProfile(Request $request, User $user)
    {
        $updateData = $request->validate([
            'username' => 'required',
            'email' => 'required|email',
            'password' => 'required',
            'role' => 'required',
            'image' => 'nullable|image|mimes:png,jpeg,gif,svg,webp|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
        } else {
            $imagePath = $user->image;
        }

        $user->update($updateData);

        return response()->json([
            'message' => 'Successfully Update Profile',
            'User' => $user
        ]);
    }
}
