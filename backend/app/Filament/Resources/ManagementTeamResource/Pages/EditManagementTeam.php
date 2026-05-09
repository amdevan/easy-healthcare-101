<?php

namespace App\Filament\Resources\ManagementTeamResource\Pages;

use App\Filament\Resources\ManagementTeamResource;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Arr;

class EditManagementTeam extends EditRecord
{
    protected static string $resource = ManagementTeamResource::class;

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $data['order'] = (int) Arr::get($data, 'order', 0);
        return $data;
    }
}
