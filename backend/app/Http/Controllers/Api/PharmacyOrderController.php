<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PharmacyOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PharmacyOrderController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'address' => 'required|string',
            'email' => 'nullable|email|max:255',
            'note' => 'nullable|string',
            'prescription' => 'required|file|mimes:jpeg,png,pdf|max:10240', // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $path = $request->file('prescription')->store('pharmacy-orders', 'public');

        $order = PharmacyOrder::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'address' => $request->address,
            'email' => $request->email,
            'note' => $request->note,
            'prescription_path' => $path,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Pharmacy order submitted successfully',
            'data' => $order,
        ], 201);
    }
}
