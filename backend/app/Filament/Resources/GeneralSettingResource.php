<?php

namespace App\Filament\Resources;

use App\Filament\Resources\GeneralSettingResource\Pages;
use App\Models\UiSetting;
use App\Models\Page;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Actions\EditAction;
use Illuminate\Database\Eloquent\Builder;
use Filament\Forms\Components\Select;

class GeneralSettingResource extends Resource
{
    protected static ?string $model = UiSetting::class;
    protected static ?string $modelLabel = 'General Setting';
    protected static ?string $pluralModelLabel = 'General Settings';
    protected static ?string $navigationLabel = 'General Setting';

    public static function getNavigationGroup(): string | \UnitEnum | null
    {
        return 'UI Setting';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Select::make('value.home_page_slug')
                ->label('Home Page')
                ->options(Page::all()->pluck('title', 'slug'))
                ->searchable()
                ->helperText('Select which page to serve as the home page. Leave empty for default Home page.'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\TextColumn::make('key')->label('Setting Type'),
            Tables\Columns\TextColumn::make('value.home_page_slug')->label('Home Page Slug'),
            Tables\Columns\TextColumn::make('updated_at')->dateTime(),
        ])
        ->actions([EditAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListGeneralSettings::route('/'),
            'create' => Pages\CreateGeneralSetting::route('/create'),
            'edit' => Pages\EditGeneralSetting::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('key', 'general');
    }
}
