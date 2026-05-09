<?php

namespace App\Filament\Resources\ManagementTeamResource\Pages;

use App\Filament\Resources\ManagementTeamResource;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Arr;

class CreateManagementTeam extends CreateRecord
{
    protected static string $resource = ManagementTeamResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['order'] = (int) Arr::get($data, 'order', 0);
        return $data;
    }
}
