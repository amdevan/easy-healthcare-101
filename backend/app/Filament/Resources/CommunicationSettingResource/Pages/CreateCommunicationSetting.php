<?php

namespace App\Filament\Resources\CommunicationSettingResource\Pages;

use App\Filament\Resources\CommunicationSettingResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCommunicationSetting extends CreateRecord
{
    protected static string $resource = CommunicationSettingResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['key'] = 'communication';
        return $data;
    }
}

