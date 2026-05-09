<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ManagementTeam;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class ManagementTeamController extends Controller
{
    public function index(Request $request)
    {
        $query = ManagementTeam::query();

        if ($request->boolean('active')) {
            $query->where('is_active', true);
        }

        return response()->json(
            $query->orderBy('order')->orderBy('name')->paginate((int) $request->get('per_page', 20))
        );
    }

    public function show(ManagementTeam $managementTeam)
    {
        return response()->json($managementTeam);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'photo_path' => ['nullable', 'string', 'max:1024'],
            'bio' => ['nullable', 'string'],
            'email' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'links' => ['nullable'],
            'order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $data['order'] = (int) Arr::get($data, 'order', 0);
        if (is_string(Arr::get($data, 'links'))) {
            $decoded = json_decode($data['links'], true);
            $data['links'] = is_array($decoded) ? $decoded : [];
        }

        $member = ManagementTeam::create($data);
        return response()->json($member, 201);
    }

    public function update(Request $request, ManagementTeam $managementTeam)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'photo_path' => ['nullable', 'string', 'max:1024'],
            'bio' => ['nullable', 'string'],
            'email' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'links' => ['nullable'],
            'order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        if (array_key_exists('order', $data)) {
            $data['order'] = (int) Arr::get($data, 'order', 0);
        }
        if (array_key_exists('links', $data) && is_string($data['links'])) {
            $decoded = json_decode($data['links'], true);
            $data['links'] = is_array($decoded) ? $decoded : [];
        }

        $managementTeam->update($data);
        return response()->json($managementTeam);
    }

    public function destroy(ManagementTeam $managementTeam)
    {
        $managementTeam->delete();
        return response()->noContent();
    }
}
