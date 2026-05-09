<?php

namespace App\Filament\Resources\PharmacyOrders\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms;

class PharmacyOrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('phone')
                    ->tel()
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('email')
                    ->email()
                    ->maxLength(255),
                Forms\Components\Textarea::make('address')
                    ->required()
                    ->maxLength(65535)
                    ->columnSpanFull(),
                Forms\Components\Textarea::make('note')
                    ->label('Customer Note')
                    ->maxLength(65535)
                    ->columnSpanFull(),
                Forms\Components\FileUpload::make('prescription_path')
                    ->label('Prescription')
                    ->disk('public')
                    ->acceptedFileTypes(['image/*', 'application/pdf'])
                    ->directory('pharmacy-orders')
                    ->required()
                    ->columnSpanFull()
                    ->openable()
                    ->downloadable(),
                Forms\Components\Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'processing' => 'Processing',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                    ])
                    ->required()
                    ->default('pending'),
                Forms\Components\Textarea::make('admin_notes')
                    ->columnSpanFull(),
            ]);
    }
}
