<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CommunicationSettingResource\Pages;
use App\Models\UiSetting;
use Filament\Actions\EditAction;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class CommunicationSettingResource extends Resource
{
    protected static ?string $model = UiSetting::class;
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-envelope';

    protected static ?string $modelLabel = 'Communication Setting';
    protected static ?string $pluralModelLabel = 'Communication Settings';
    protected static ?string $navigationLabel = 'Mail & SMS';

    public static function getNavigationGroup(): string | \UnitEnum | null
    {
        return 'System';
    }

    public static function getNavigationBadge(): ?string
    {
        return (string) UiSetting::query()->where('key', 'communication')->count();
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('key', 'communication');
    }

    public static function defaultValue(): array
    {
        return [
            'mail' => [
                'enabled' => false,
                'driver' => 'smtp',
                'from_name' => '',
                'from_address' => '',
                'notify_user_on_signup' => true,
                'notify_admin_on_signup' => false,
                'admin_recipients' => '',
                'host' => '',
                'port' => 587,
                'encryption' => 'tls',
                'username' => '',
                'password' => '',
            ],
            'sms' => [
                'enabled' => false,
                'provider' => 'twilio',
                'notify_user_on_signup' => false,
                'notify_admin_on_signup' => false,
                'admin_numbers' => '',
                'twilio' => [
                    'account_sid' => '',
                    'auth_token' => '',
                    'from_number' => '',
                ],
                'sparrow' => [
                    'api_key' => '',
                    'sender' => '',
                    'base_url' => 'https://api.sparrowsms.com/v2/sms/',
                ],
                'other' => [
                    'api_key' => '',
                    'api_secret' => '',
                    'sender' => '',
                    'base_url' => '',
                ],
            ],
        ];
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\Hidden::make('key')->default('communication'),

            Tabs::make('Communication')
                ->tabs([
                    Tab::make('Mail')
                        ->schema([
                            Section::make('Mail Configuration')
                                ->schema([
                                    Forms\Components\Toggle::make('value.mail.enabled')
                                        ->label('Enable Mail')
                                        ->default(false)
                                        ->columnSpanFull()
                                        ->reactive(),

                                    Forms\Components\Select::make('value.mail.driver')
                                        ->label('Driver')
                                        ->options([
                                            'smtp' => 'SMTP',
                                            'sendmail' => 'Sendmail',
                                            'log' => 'Log (Debug)',
                                        ])
                                        ->default('smtp')
                                        ->requiredWith('value.mail.enabled')
                                        ->visible(fn (Get $get) => (bool) $get('value.mail.enabled')),

                                    Forms\Components\TextInput::make('value.mail.from_name')
                                        ->label('From Name')
                                        ->maxLength(255)
                                        ->visible(fn (Get $get) => (bool) $get('value.mail.enabled')),

                                    Forms\Components\TextInput::make('value.mail.from_address')
                                        ->label('From Email')
                                        ->email()
                                        ->maxLength(255)
                                        ->visible(fn (Get $get) => (bool) $get('value.mail.enabled')),

                                    Forms\Components\Toggle::make('value.mail.notify_user_on_signup')
                                        ->label('Send Welcome Email on Signup')
                                        ->default(true)
                                        ->columnSpanFull()
                                        ->visible(fn (Get $get) => (bool) $get('value.mail.enabled')),

                                    Forms\Components\Toggle::make('value.mail.notify_admin_on_signup')
                                        ->label('Notify Admin on Signup (Email)')
                                        ->default(false)
                                        ->columnSpanFull()
                                        ->visible(fn (Get $get) => (bool) $get('value.mail.enabled')),

                                    Forms\Components\Textarea::make('value.mail.admin_recipients')
                                        ->label('Admin Emails (comma/newline separated)')
                                        ->rows(3)
                                        ->maxLength(2000)
                                        ->visible(fn (Get $get) => (bool) $get('value.mail.enabled') && (bool) $get('value.mail.notify_admin_on_signup'))
                                        ->columnSpanFull(),

                                    Forms\Components\TextInput::make('value.mail.host')
                                        ->label('SMTP Host')
                                        ->maxLength(255)
                                        ->requiredWith('value.mail.enabled')
                                        ->visible(fn (Get $get) => (bool) $get('value.mail.enabled') && ($get('value.mail.driver') === 'smtp')),

                                    Forms\Components\TextInput::make('value.mail.port')
                                        ->label('SMTP Port')
                                        ->numeric()
                                        ->default(587)
                                        ->requiredWith('value.mail.enabled')
                                        ->visible(fn (Get $get) => (bool) $get('value.mail.enabled') && ($get('value.mail.driver') === 'smtp')),

                                    Forms\Components\Select::make('value.mail.encryption')
                                        ->label('Encryption')
                                        ->options([
                                            'tls' => 'TLS',
                                            'ssl' => 'SSL',
                                            '' => 'None',
                                        ])
                                        ->default('tls')
                                        ->visible(fn (Get $get) => (bool) $get('value.mail.enabled') && ($get('value.mail.driver') === 'smtp')),

                                    Forms\Components\TextInput::make('value.mail.username')
                                        ->label('SMTP Username')
                                        ->maxLength(255)
                                        ->visible(fn (Get $get) => (bool) $get('value.mail.enabled') && ($get('value.mail.driver') === 'smtp')),

                                    Forms\Components\TextInput::make('value.mail.password')
                                        ->label('SMTP Password')
                                        ->password()
                                        ->revealable()
                                        ->maxLength(255)
                                        ->visible(fn (Get $get) => (bool) $get('value.mail.enabled') && ($get('value.mail.driver') === 'smtp')),
                                ])
                                ->columns(2),
                        ]),

                    Tab::make('SMS')
                        ->schema([
                            Section::make('SMS Configuration')
                                ->schema([
                                    Forms\Components\Toggle::make('value.sms.enabled')
                                        ->label('Enable SMS')
                                        ->default(false)
                                        ->columnSpanFull()
                                        ->reactive(),

                                    Forms\Components\Select::make('value.sms.provider')
                                        ->label('Provider')
                                        ->options([
                                            'twilio' => 'Twilio',
                                            'sparrow' => 'Sparrow SMS',
                                            'other' => 'Other',
                                        ])
                                        ->default('twilio')
                                        ->requiredWith('value.sms.enabled')
                                        ->visible(fn (Get $get) => (bool) $get('value.sms.enabled'))
                                        ->reactive(),

                                    Forms\Components\Toggle::make('value.sms.notify_user_on_signup')
                                        ->label('Send SMS on Signup')
                                        ->default(false)
                                        ->columnSpanFull()
                                        ->visible(fn (Get $get) => (bool) $get('value.sms.enabled')),

                                    Forms\Components\Toggle::make('value.sms.notify_admin_on_signup')
                                        ->label('Notify Admin on Signup (SMS)')
                                        ->default(false)
                                        ->columnSpanFull()
                                        ->visible(fn (Get $get) => (bool) $get('value.sms.enabled')),

                                    Forms\Components\Textarea::make('value.sms.admin_numbers')
                                        ->label('Admin Phone Numbers (comma/newline separated)')
                                        ->rows(3)
                                        ->maxLength(2000)
                                        ->visible(fn (Get $get) => (bool) $get('value.sms.enabled') && (bool) $get('value.sms.notify_admin_on_signup'))
                                        ->columnSpanFull(),

                                    Forms\Components\TextInput::make('value.sms.twilio.account_sid')
                                        ->label('Twilio Account SID')
                                        ->maxLength(255)
                                        ->visible(fn (Get $get) => (bool) $get('value.sms.enabled') && ($get('value.sms.provider') === 'twilio')),

                                    Forms\Components\TextInput::make('value.sms.twilio.auth_token')
                                        ->label('Twilio Auth Token')
                                        ->password()
                                        ->revealable()
                                        ->maxLength(255)
                                        ->visible(fn (Get $get) => (bool) $get('value.sms.enabled') && ($get('value.sms.provider') === 'twilio')),

                                    Forms\Components\TextInput::make('value.sms.twilio.from_number')
                                        ->label('Twilio From Number')
                                        ->tel()
                                        ->maxLength(255)
                                        ->visible(fn (Get $get) => (bool) $get('value.sms.enabled') && ($get('value.sms.provider') === 'twilio')),

                                    Forms\Components\TextInput::make('value.sms.sparrow.api_key')
                                        ->label('Sparrow API Key')
                                        ->password()
                                        ->revealable()
                                        ->maxLength(255)
                                        ->visible(fn (Get $get) => (bool) $get('value.sms.enabled') && ($get('value.sms.provider') === 'sparrow')),

                                    Forms\Components\TextInput::make('value.sms.sparrow.sender')
                                        ->label('Sparrow Sender')
                                        ->maxLength(255)
                                        ->visible(fn (Get $get) => (bool) $get('value.sms.enabled') && ($get('value.sms.provider') === 'sparrow')),

                                    Forms\Components\TextInput::make('value.sms.sparrow.base_url')
                                        ->label('Sparrow Base URL')
                                        ->default('https://api.sparrowsms.com/v2/sms/')
                                        ->maxLength(255)
                                        ->visible(fn (Get $get) => (bool) $get('value.sms.enabled') && ($get('value.sms.provider') === 'sparrow')),

                                    Forms\Components\TextInput::make('value.sms.other.api_key')
                                        ->label('API Key')
                                        ->password()
                                        ->revealable()
                                        ->maxLength(255)
                                        ->visible(fn (Get $get) => (bool) $get('value.sms.enabled') && ($get('value.sms.provider') === 'other')),

                                    Forms\Components\TextInput::make('value.sms.other.api_secret')
                                        ->label('API Secret')
                                        ->password()
                                        ->revealable()
                                        ->maxLength(255)
                                        ->visible(fn (Get $get) => (bool) $get('value.sms.enabled') && ($get('value.sms.provider') === 'other')),

                                    Forms\Components\TextInput::make('value.sms.other.sender')
                                        ->label('Sender / From')
                                        ->maxLength(255)
                                        ->visible(fn (Get $get) => (bool) $get('value.sms.enabled') && ($get('value.sms.provider') === 'other')),

                                    Forms\Components\TextInput::make('value.sms.other.base_url')
                                        ->label('Base URL')
                                        ->maxLength(255)
                                        ->visible(fn (Get $get) => (bool) $get('value.sms.enabled') && ($get('value.sms.provider') === 'other')),
                                ])
                                ->columns(2),
                        ]),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\TextColumn::make('value.mail.enabled')
                ->label('Mail')
                ->formatStateUsing(fn ($state) => $state ? 'Enabled' : 'Disabled')
                ->badge()
                ->color(fn ($state) => $state ? 'success' : 'danger'),
            Tables\Columns\TextColumn::make('value.sms.enabled')
                ->label('SMS')
                ->formatStateUsing(fn ($state) => $state ? 'Enabled' : 'Disabled')
                ->badge()
                ->color(fn ($state) => $state ? 'success' : 'danger'),
            Tables\Columns\TextColumn::make('updated_at')->dateTime(),
        ])->actions([
            EditAction::make(),
        ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCommunicationSettings::route('/'),
            'create' => Pages\CreateCommunicationSetting::route('/create'),
            'edit' => Pages\EditCommunicationSetting::route('/{record}/edit'),
        ];
    }
}
