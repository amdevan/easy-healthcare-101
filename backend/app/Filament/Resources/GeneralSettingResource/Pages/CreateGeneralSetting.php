<?php

namespace App\Filament\Resources\GeneralSettingResource\Pages;

use App\Filament\Resources\GeneralSettingResource;
use Filament\Resources\Pages\CreateRecord;

class CreateGeneralSetting extends CreateRecord
{
    protected static string $resource = GeneralSettingResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['key'] = 'general';
        return $data;
    }
}
