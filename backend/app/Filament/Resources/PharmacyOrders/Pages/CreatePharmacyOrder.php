<?php

namespace App\Filament\Resources\PharmacyOrders\Pages;

use App\Filament\Resources\PharmacyOrders\PharmacyOrderResource;
use Filament\Resources\Pages\CreateRecord;

class CreatePharmacyOrder extends CreateRecord
{
    protected static string $resource = PharmacyOrderResource::class;
}
