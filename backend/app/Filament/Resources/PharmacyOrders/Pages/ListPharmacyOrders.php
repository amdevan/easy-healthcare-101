<?php

namespace App\Filament\Resources\PharmacyOrders\Pages;

use App\Filament\Resources\PharmacyOrders\PharmacyOrderResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPharmacyOrders extends ListRecords
{
    protected static string $resource = PharmacyOrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
