<?php

namespace App\Filament\Resources\PharmacyOrders\Pages;

use App\Filament\Resources\PharmacyOrders\PharmacyOrderResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditPharmacyOrder extends EditRecord
{
    protected static string $resource = PharmacyOrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
