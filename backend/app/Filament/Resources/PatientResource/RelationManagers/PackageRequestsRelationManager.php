<?php

namespace App\Filament\Resources\PatientResource\RelationManagers;

use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Actions\CreateAction;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;

class PackageRequestsRelationManager extends RelationManager
{
    protected static string $relationship = 'packageRequests';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Request Details')
                    ->schema([
                        Forms\Components\TextInput::make('request_id')
                            ->default(fn () => uniqid())
                            ->disabled()
                            ->dehydrated(),
                        Forms\Components\TextInput::make('package_name')
                            ->required(),
                        Forms\Components\DatePicker::make('requested_date')
                            ->default(now()),
                        Forms\Components\Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'approved' => 'Approved',
                                'rejected' => 'Rejected',
                            ])
                            ->default('pending')
                            ->required(),
                    ])->columns(2),

                Section::make('Patient Information')
                    ->schema([
                        Forms\Components\TextInput::make('patient_name')
                            ->label('Name on Request')
                            ->required(),
                        Forms\Components\TextInput::make('email')
                            ->email(),
                        Forms\Components\TextInput::make('phone'),
                        Forms\Components\TextInput::make('address'),
                    ])->columns(2),

                Section::make('Booking Details')
                    ->schema([
                        Forms\Components\Toggle::make('is_for_self')
                            ->label('Booking for Self')
                            ->default(true)
                            ->reactive(),
                        
                        Group::make([
                            Forms\Components\TextInput::make('booking_name')
                                ->label('Booked By Name'),
                            Forms\Components\TextInput::make('booking_email')
                                ->email()
                                ->label('Booker Email'),
                            Forms\Components\TextInput::make('booking_phone')
                                ->label('Booker Phone'),
                            Forms\Components\TextInput::make('relation')
                                ->label('Relation to Patient'),
                        ])
                        ->visible(fn (Get $get) => ! $get('is_for_self'))
                        ->columns(2),
                    ]),

                Section::make('Package Customization')
                    ->schema([
                        Forms\Components\CheckboxList::make('add_ons')
                            ->options([
                                'home_sample' => 'Home Sample Collection',
                                'hard_copy_report' => 'Hard Copy Report Delivery',
                                'doctor_consult' => 'Specialist Consultation',
                            ])
                            ->columns(2),
                    ]),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('package_name')
            ->columns([
                Tables\Columns\TextColumn::make('package_name'),
                Tables\Columns\TextColumn::make('requested_date')->date(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'approved' => 'success',
                        'rejected' => 'danger',
                        'pending' => 'warning',
                        default => 'gray',
                    }),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                CreateAction::make(),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                DeleteBulkAction::make(),
            ]);
    }
}
