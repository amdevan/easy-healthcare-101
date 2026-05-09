<?php

namespace App\Filament\Resources\ManagementTeamResource\Pages;

use App\Filament\Resources\ManagementTeamResource;
use Filament\Resources\Pages\ListRecords;
use Filament\Actions\CreateAction;

class ListManagementTeams extends ListRecords
{
    protected static string $resource = ManagementTeamResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()->label('Add Team Member')->icon('heroicon-o-plus'),
        ];
    }
}
