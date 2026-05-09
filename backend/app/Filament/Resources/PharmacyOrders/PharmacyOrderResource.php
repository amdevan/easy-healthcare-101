<?php

namespace App\Filament\Resources\PharmacyOrders;

use App\Filament\Resources\PharmacyOrders\Pages\CreatePharmacyOrder;
use App\Filament\Resources\PharmacyOrders\Pages\EditPharmacyOrder;
use App\Filament\Resources\PharmacyOrders\Pages\ListPharmacyOrders;
use App\Filament\Resources\PharmacyOrders\Schemas\PharmacyOrderForm;
use App\Filament\Resources\PharmacyOrders\Tables\PharmacyOrdersTable;
use App\Models\PharmacyOrder;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class PharmacyOrderResource extends Resource
{
    protected static ?string $model = PharmacyOrder::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'name';
    protected static ?string $navigationLabel = 'Orders';
    
    public static function getNavigationGroup(): string | \UnitEnum | null
    {
        return 'Pharmacy';
    }

    public static function form(Schema $schema): Schema
    {
        return PharmacyOrderForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PharmacyOrdersTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListPharmacyOrders::route('/'),
            'create' => CreatePharmacyOrder::route('/create'),
            'edit' => EditPharmacyOrder::route('/{record}/edit'),
        ];
    }
}
