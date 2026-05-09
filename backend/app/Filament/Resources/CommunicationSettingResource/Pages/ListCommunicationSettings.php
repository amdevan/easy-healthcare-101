<?php

namespace App\Filament\Resources\CommunicationSettingResource\Pages;

use App\Filament\Resources\CommunicationSettingResource;
use App\Models\UiSetting;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListCommunicationSettings extends ListRecords
{
    protected static string $resource = CommunicationSettingResource::class;

    protected function getHeaderActions(): array
    {
        $record = UiSetting::query()->where('key', 'communication')->first();
        if ($record) {
            return [
                Actions\Action::make('edit')
                    ->label('Edit Communication Settings')
                    ->url(CommunicationSettingResource::getUrl('edit', ['record' => $record->getKey()]))
                    ->color('primary'),
            ];
        }

        return [
            Actions\Action::make('make')
                ->label('Create Defaults')
                ->color('primary')
                ->action(function () {
                    $record = UiSetting::query()->where('key', 'communication')->first();
                    if (!$record) {
                        $record = UiSetting::create([
                            'key' => 'communication',
                            'value' => CommunicationSettingResource::defaultValue(),
                        ]);
                    }
                    $this->redirect(CommunicationSettingResource::getUrl('edit', ['record' => $record->getKey()]));
                }),
            Actions\CreateAction::make()->label('Create (Empty)'),
        ];
    }
}
