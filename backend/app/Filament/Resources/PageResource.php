<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PageResource\Pages;
use App\Models\Page;
use Filament\Forms;
use Filament\Schemas\Schema as FilamentSchema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\BulkActionGroup;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Schema as DbSchema;
use Illuminate\Support\Str;
use Filament\Schemas\Components\Utilities\Set;


use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use App\Models\UiSetting;

class PageResource extends Resource
{
    protected static ?string $model = Page::class;
    protected static ?string $navigationLabel = 'Pages';
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-document-text';
    protected static ?int $navigationSort = 2;

    protected static function iconOptions(): array
    {
        return [
            'ArrowRight' => 'ArrowRight',
            'CheckCircle2' => 'CheckCircle2',
            'HeartPulse' => 'HeartPulse',
            'Stethoscope' => 'Stethoscope',
            'Pill' => 'Pill',
            'Baby' => 'Baby',
            'Activity' => 'Activity',
            'Heart' => 'Heart',
            'ShieldCheck' => 'ShieldCheck',
            'Microscope' => 'Microscope',
            'UserPlus' => 'UserPlus',
            'Calendar' => 'Calendar',
            'Clock' => 'Clock',
            'User' => 'User',
            'Mail' => 'Mail',
            'Phone' => 'Phone',
            'FileText' => 'FileText',
            'Check' => 'Check',
            'MapPin' => 'MapPin',
            'Search' => 'Search',
            'Filter' => 'Filter',
            'Star' => 'Star',
            'Menu' => 'Menu',
            'X' => 'X',
            'Facebook' => 'Facebook',
            'Twitter' => 'Twitter',
            'Instagram' => 'Instagram',
            'Linkedin' => 'Linkedin',
            'Youtube' => 'Youtube',
            'Globe' => 'Globe',
            'Truck' => 'Truck',
            'Leaf' => 'Leaf',
            'Droplet' => 'Droplet',
            'Thermometer' => 'Thermometer',
            'Syringe' => 'Syringe',
            'FlaskConical' => 'FlaskConical',
            'Dna' => 'Dna',
            'Brain' => 'Brain',
            'Bone' => 'Bone',
            'Eye' => 'Eye',
            'Ear' => 'Ear',
            'Smile' => 'Smile',
            'Frown' => 'Frown',
            'Meh' => 'Meh',
            'ThumbsUp' => 'ThumbsUp',
            'ThumbsDown' => 'ThumbsDown',
            'MessageCircle' => 'MessageCircle',
            'MessageSquare' => 'MessageSquare',
            'Send' => 'Send',
            'Paperclip' => 'Paperclip',
            'Image' => 'Image',
            'Camera' => 'Camera',
            'Video' => 'Video',
            'Mic' => 'Mic',
            'MicOff' => 'MicOff',
            'Volume2' => 'Volume2',
            'VolumeX' => 'VolumeX',
            'Settings' => 'Settings',
            'HelpCircle' => 'HelpCircle',
            'Info' => 'Info',
            'AlertCircle' => 'AlertCircle',
            'AlertTriangle' => 'AlertTriangle',
            'Bell' => 'Bell',
            'BellOff' => 'BellOff',
            'Lock' => 'Lock',
            'Unlock' => 'Unlock',
            'Key' => 'Key',
            'CreditCard' => 'CreditCard',
            'DollarSign' => 'DollarSign',
            'ShoppingCart' => 'ShoppingCart',
            'Briefcase' => 'Briefcase',
            'File' => 'File',
            'Folder' => 'Folder',
            'Home' => 'Home',
            'Layout' => 'Layout',
            'Grid' => 'Grid',
            'List' => 'List',
            'MoreHorizontal' => 'MoreHorizontal',
            'MoreVertical' => 'MoreVertical',
            'Plus' => 'Plus',
            'Minus' => 'Minus',
            'Edit' => 'Edit',
            'Trash' => 'Trash',
            'RefreshCw' => 'RefreshCw',
            'Download' => 'Download',
            'Upload' => 'Upload',
            'Share' => 'Share',
            'Printer' => 'Printer',
            'ChevronRight' => 'ChevronRight',
            'ChevronLeft' => 'ChevronLeft',
            'ChevronDown' => 'ChevronDown',
            'ChevronUp' => 'ChevronUp',
            'ExternalLink' => 'ExternalLink',
            'LogOut' => 'LogOut',
            'LogIn' => 'LogIn',
            'Smartphone' => 'Smartphone',
            'Monitor' => 'Monitor',
            'Database' => 'Database',
            'BarChart3' => 'BarChart3',
            'Lightbulb' => 'Lightbulb',
            'Rocket' => 'Rocket',
            'ArrowUpRight' => 'ArrowUpRight',
            'Store' => 'Store',
            'HandHeart' => 'HandHeart',
            'School' => 'School',
            'Megaphone' => 'Megaphone',
            'TrendingUp' => 'TrendingUp',
            'Ambulance' => 'Ambulance',
            'Building' => 'Building',
            'Building2' => 'Building2',
            'Users' => 'Users',
            'GraduationCap' => 'GraduationCap',
        ];
    }

    public static function getNavigationGroup(): string | \UnitEnum | null
    {
        return 'UI Setting';
    }

    public static function form(FilamentSchema $schema): FilamentSchema
    {
        return $schema->schema([
            Group::make()
                ->schema([
                    Section::make('Page Details')
                        ->schema([
                            Forms\Components\TextInput::make('title')
                                ->label('Page Name')
                                ->required()
                                ->live(onBlur: true)
                                ->afterStateUpdated(fn (Set $set, ?string $state) => $set('slug', Str::slug($state)))
                                ->maxLength(255),
                            Forms\Components\TextInput::make('slug')
                                ->label('Page URL')
                                ->required()
                                ->unique(ignoreRecord: true)
                                ->maxLength(255),
                            Forms\Components\Toggle::make('is_active')
                                ->label('Active')
                                ->default(true)
                                ->helperText('Disable to hide this page from the frontend.'),
                            Forms\Components\Toggle::make('open_in_new_tab')
                                ->label('Open in New Tab')
                                ->default(false)
                                ->helperText('When linked, should this page open in a new tab?'),
                        ])->columns(2),

                    Section::make('Hero Section')
                        ->schema([
                            Forms\Components\FileUpload::make('hero_image')
                                ->label('Hero Image')
                                ->image()
                                ->directory('pages/hero')
                                ->maxSize(2048)
                                ->helperText('Default hero image for this page. Can be overridden by a Hero Section block.')
                                ->columnSpanFull(),
                        ]),
                        
                    Section::make('Content Builder')
                        ->schema([
                            Forms\Components\Builder::make('content')
                                ->blocks([
                                    Forms\Components\Builder\Block::make('hero_section')
                                        ->label('Hero Section')
                                        ->icon('heroicon-o-star')
                                        ->schema([
                                            Forms\Components\TextInput::make('title')->required(),
                                            Forms\Components\Textarea::make('subtitle')->rows(3),
                                            Forms\Components\RichEditor::make('description'),
                                            Forms\Components\FileUpload::make('image')
                                                ->image()
                                                ->directory('pages/hero')
                                                ->helperText('Leave empty to use the Page default Hero Image.'),
                                            Forms\Components\TextInput::make('badge'),
                                            Forms\Components\TextInput::make('primary_button_text'),
                                            Forms\Components\TextInput::make('primary_button_link'),
                                            Forms\Components\Toggle::make('primary_button_new_tab')->label('Open Primary Link in New Tab'),
                                            Forms\Components\TextInput::make('secondary_button_text'),
                                            Forms\Components\TextInput::make('secondary_button_link'),
                                            Forms\Components\Toggle::make('secondary_button_new_tab')->label('Open Secondary Link in New Tab'),
                                            Forms\Components\Repeater::make('stats')
                                                ->schema([
                                                    Forms\Components\TextInput::make('value'),
                                                    Forms\Components\TextInput::make('label'),
                                                ])->columns(2),
                                        ]),
                                    Forms\Components\Builder\Block::make('text_block')
                                        ->label('Text Content')
                                        ->icon('heroicon-o-document-text')
                                        ->schema([
                                            Forms\Components\RichEditor::make('content')->label('Body Text')->required(),
                                        ]),
                                    Forms\Components\Builder\Block::make('features_list')
                                        ->label('Features List')
                                        ->icon('heroicon-o-list-bullet')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\TextInput::make('subtitle'),
                                            Forms\Components\Repeater::make('features')
                                                ->schema([
                                                    Forms\Components\TextInput::make('title')->required(),
                                                    Forms\Components\Textarea::make('description'),
                                                    Forms\Components\Select::make('icon')
                                                        ->options(self::iconOptions())
                                                        ->searchable()
                                                        ->preload()
                                                        ->nullable(),
                                                    Forms\Components\FileUpload::make('image')->image()->directory('pages/features'),
                                                    Forms\Components\TextInput::make('url'),
                                                    Forms\Components\Toggle::make('new_tab')->label('Open in New Tab'),
                                                ])->columns(2),
                                        ]),
                                    Forms\Components\Builder\Block::make('features_section')
                                        ->label('Features Section')
                                        ->icon('heroicon-o-list-bullet')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\TextInput::make('subtitle'),
                                            Forms\Components\RichEditor::make('description'),
                                            Forms\Components\Repeater::make('items')
                                                ->schema([
                                                    Forms\Components\TextInput::make('title')->required(),
                                                    Forms\Components\Textarea::make('description'),
                                                    Forms\Components\Select::make('icon')
                                                        ->options(self::iconOptions())
                                                        ->searchable()
                                                        ->preload()
                                                        ->nullable(),
                                                    Forms\Components\Repeater::make('details')->simple(Forms\Components\TextInput::make('detail')),
                                                ])->columns(2),
                                        ]),
                                    Forms\Components\Builder\Block::make('process_section')
                                        ->label('Process Section')
                                        ->icon('heroicon-o-arrow-path')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\Textarea::make('description'),
                                            Forms\Components\Repeater::make('steps')
                                                ->schema([
                                                    Forms\Components\TextInput::make('title')->required(),
                                                    Forms\Components\Textarea::make('description'),
                                                    Forms\Components\Select::make('icon')
                                                        ->options(self::iconOptions())
                                                        ->searchable()
                                                        ->preload()
                                                        ->nullable(),
                                                    Forms\Components\TextInput::make('tone')
                                                        ->label('Color Tone (CSS Class)')
                                                        ->placeholder('from-sky-400 to-sky-600'),
                                                ])->columns(2),
                                        ]),
                                    Forms\Components\Builder\Block::make('services_section')
                                        ->label('Services Section')
                                        ->icon('heroicon-o-squares-2x2')
                                        ->schema([
                                            Forms\Components\TextInput::make('label'),
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\RichEditor::make('description'),
                                            Forms\Components\Repeater::make('items')
                                                ->schema([
                                                    Forms\Components\TextInput::make('title')->required(),
                                                    Forms\Components\Textarea::make('description'),
                                                    Forms\Components\TextInput::make('idealFor')->label('Best For'),
                                                    Forms\Components\Select::make('icon')
                                                        ->options(self::iconOptions())
                                                        ->searchable()
                                                        ->preload()
                                                        ->nullable(),
                                                    Forms\Components\TextInput::make('url'),
                                                    Forms\Components\Toggle::make('new_tab')->label('Open in New Tab'),
                                                ])->columns(2),
                                        ]),
                                    Forms\Components\Builder\Block::make('about_section')
                                        ->label('About Section')
                                        ->icon('heroicon-o-information-circle')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\TextInput::make('subtitle'),
                                            Forms\Components\RichEditor::make('description'),
                                            Forms\Components\FileUpload::make('image_1')->image()->directory('pages/about'),
                                            Forms\Components\FileUpload::make('image_2')->image()->directory('pages/about'),
                                        ]),
                                    Forms\Components\Builder\Block::make('board_members_section')
                                        ->label('Board Members Section')
                                        ->icon('heroicon-o-users')
                                        ->schema([
                                            Forms\Components\TextInput::make('title')->default('Meet Our Board of Directors'),
                                            Forms\Components\Textarea::make('description')->default('Guided by experienced leaders committed to healthcare accessibility, quality, and patient satisfaction.'),
                                            Forms\Components\Repeater::make('members')
                                                ->label('Members')
                                                ->schema([
                                                    Forms\Components\TextInput::make('name')->required(),
                                                    Forms\Components\TextInput::make('role')->required(),
                                                    Forms\Components\FileUpload::make('image')
                                                        ->image()
                                                        ->directory('board-members')
                                                        ->helperText('Upload a new photo to replace the current one.')
                                                        ->columnSpanFull(),
                                                    Forms\Components\RichEditor::make('bio')->columnSpanFull(),
                                                    Forms\Components\TextInput::make('email')->email(),
                                                    Forms\Components\TextInput::make('linkedin_url')->url(),
                                                ])
                                                ->grid(2)
                                                ->columnSpanFull(),
                                        ]),

                                    Forms\Components\Builder\Block::make('core_values')
                                        ->label('Core Values')
                                        ->icon('heroicon-o-heart')
                                        ->schema([
                                            Section::make('Mission')
                                                ->statePath('mission')
                                                ->schema([
                                                    Forms\Components\TextInput::make('title'),
                                                    Forms\Components\Textarea::make('description'),
                                                ]),
                                            Section::make('Vision')
                                                ->statePath('vision')
                                                ->schema([
                                                    Forms\Components\TextInput::make('title'),
                                                    Forms\Components\Textarea::make('description'),
                                                ]),
                                            Forms\Components\Repeater::make('values')
                                                ->schema([
                                                    Forms\Components\TextInput::make('title'),
                                                    Forms\Components\Textarea::make('description'),
                                                    Forms\Components\Select::make('icon')
                                                        ->options(self::iconOptions())
                                                        ->searchable()
                                                        ->preload(),
                                                ]),
                                        ]),
                                    Forms\Components\Builder\Block::make('our_story')
                                        ->label('Our Story')
                                        ->icon('heroicon-o-book-open')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\TextInput::make('subtitle'),
                                            Forms\Components\RichEditor::make('description_1'),
                                            Forms\Components\RichEditor::make('description_2'),
                                            Forms\Components\Textarea::make('quote'),
                                            Forms\Components\FileUpload::make('image')->image()->directory('pages/story'),
                                            Forms\Components\Repeater::make('services')->simple(Forms\Components\TextInput::make('service')),
                                        ]),
                                    Forms\Components\Builder\Block::make('ecosystem_section')
                                        ->label('Ecosystem')
                                        ->icon('heroicon-o-globe-alt')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\TextInput::make('subtitle'),
                                            Forms\Components\Textarea::make('description'),
                                            Forms\Components\Repeater::make('items')
                                                ->schema([
                                                    Forms\Components\TextInput::make('title'),
                                                    Forms\Components\Textarea::make('description'),
                                                    Forms\Components\Select::make('icon')->options(self::iconOptions())->searchable(),
                                                    Forms\Components\Select::make('color')
                                                        ->options([
                                                            'blue' => 'blue',
                                                            'green' => 'green',
                                                            'purple' => 'purple',
                                                            'rose' => 'rose',
                                                        ])->searchable()->nullable(),
                                                ])->columns(2),
                                        ]),
                                    Forms\Components\Builder\Block::make('future_section')
                                        ->label('Future Direction')
                                        ->icon('heroicon-o-arrow-trending-up')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\TextInput::make('subtitle'),
                                            Forms\Components\Textarea::make('description'),
                                            Forms\Components\Repeater::make('steps')
                                                ->schema([
                                                    Forms\Components\TextInput::make('year'),
                                                    Forms\Components\TextInput::make('title'),
                                                    Forms\Components\Textarea::make('description'),
                                                    Forms\Components\Select::make('icon')->options(self::iconOptions())->searchable()->nullable(),
                                                ])->columns(2),
                                        ]),
                                    Forms\Components\Builder\Block::make('impact_section')
                                        ->label('Impact Section')
                                        ->icon('heroicon-o-chart-bar')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\TextInput::make('subtitle'),
                                            Forms\Components\Textarea::make('description'),
                                            Forms\Components\TextInput::make('areas_title'),
                                            Forms\Components\Textarea::make('areas_description'),
                                            Forms\Components\Repeater::make('stats')
                                                ->schema([
                                                    Forms\Components\TextInput::make('icon'),
                                                    Forms\Components\TextInput::make('value'),
                                                    Forms\Components\TextInput::make('label'),
                                                ])->columns(3),
                                            Forms\Components\Repeater::make('areas')
                                                 ->schema([
                                                     Forms\Components\TextInput::make('title'),
                                                     Forms\Components\Textarea::make('description'),
                                                 ])->columns(2),
                                        ]),
                                    Forms\Components\Builder\Block::make('appointment_section')
                                        ->label('Appointment Section')
                                        ->icon('heroicon-o-calendar')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\Textarea::make('subtitle'),
                                            Forms\Components\TextInput::make('success_title'),
                                            Forms\Components\Textarea::make('success_message'),
                                            Forms\Components\KeyValue::make('contact_info'),
                                            Forms\Components\KeyValue::make('labels'),
                                            Forms\Components\KeyValue::make('placeholders'),
                                        ]),


                                    Forms\Components\Builder\Block::make('booking_section')
                                        ->label('Booking Section (NEMT)')
                                        ->icon('heroicon-o-ticket')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\Textarea::make('description'),
                                            Forms\Components\TextInput::make('step_journey_label')->label('Journey Step Label')->default('Journey'),
                                            Forms\Components\TextInput::make('step_vehicle_label')->label('Vehicle Step Label')->default('Vehicle'),
                                            Forms\Components\TextInput::make('step_details_label')->label('Details Step Label')->default('Details'),
                                            Forms\Components\KeyValue::make('labels'),
                                            Forms\Components\KeyValue::make('placeholders'),
                                            Forms\Components\TextInput::make('success_title'),
                                            Forms\Components\Textarea::make('success_message'),
                                            Forms\Components\TextInput::make('success_contact')->label('Success Contact Template'),
                                            Forms\Components\TextInput::make('success_button')->label('Success Button Text'),
                                        ]),

                                    Forms\Components\Builder\Block::make('events_section')
                                        ->label('Events Section')
                                        ->icon('heroicon-o-calendar-days')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\TextInput::make('subtitle'),
                                            Forms\Components\TextInput::make('ctaText'),
                                            Forms\Components\Repeater::make('items')
                                                ->schema([
                                                    Forms\Components\TextInput::make('title'),
                                                    Forms\Components\TextInput::make('date'),
                                                    Forms\Components\TextInput::make('time'),
                                                    Forms\Components\TextInput::make('location'),
                                                    Forms\Components\Textarea::make('description'),
                                                    Forms\Components\TextInput::make('type'),
                                                    Forms\Components\TextInput::make('spots_left'),
                                                ]),
                                        ]),
                                    Forms\Components\Builder\Block::make('volunteer_section')
                                        ->label('Volunteer Section')
                                        ->icon('heroicon-o-hand-raised')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\Textarea::make('description'),
                                            Forms\Components\KeyValue::make('labels'),
                                            Forms\Components\KeyValue::make('placeholders'),
                                            Forms\Components\TextInput::make('success_title'),
                                            Forms\Components\Textarea::make('success_message'),
                                        ]),
                                    Forms\Components\Builder\Block::make('overview_section')
                                        ->label('Overview Section')
                                        ->icon('heroicon-o-eye')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\Textarea::make('description'),
                                            Forms\Components\Repeater::make('items')
                                                ->schema([
                                                    Forms\Components\TextInput::make('title'),
                                                    Forms\Components\Textarea::make('description'),
                                                    Forms\Components\Select::make('icon')
                                                        ->options(self::iconOptions())
                                                        ->searchable()
                                                        ->preload()
                                                        ->nullable(),
                                                    Forms\Components\Select::make('color')
                                                        ->options([
                                                            'blue' => 'blue',
                                                            'green' => 'green',
                                                            'purple' => 'purple',
                                                            'rose' => 'rose',
                                                            'teal' => 'teal',
                                                            'red' => 'red',
                                                        ])
                                                        ->searchable()
                                                        ->nullable(),
                                                ])->columns(2),
                                        ]),
                                    Forms\Components\Builder\Block::make('benefits_section')
                                        ->label('Benefits Section')
                                        ->icon('heroicon-o-sparkles')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\Textarea::make('description'),
                                            Forms\Components\FileUpload::make('image')->image()->directory('pages/benefits'),
                                            Forms\Components\TextInput::make('imageCaption'),
                                            Forms\Components\Repeater::make('items')
                                                ->schema([
                                                    Forms\Components\TextInput::make('title')->required(),
                                                    Forms\Components\Textarea::make('description'),
                                                    Forms\Components\Select::make('icon')
                                                        ->options(self::iconOptions())
                                                        ->searchable()
                                                        ->preload()
                                                        ->nullable(),
                                                ])->columns(2),
                                        ]),
                                    Forms\Components\Builder\Block::make('tech_platform')
                                        ->label('Tech Platform')
                                        ->icon('heroicon-o-cpu-chip')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\Textarea::make('description'),
                                            Forms\Components\FileUpload::make('image')->image()->directory('pages/tech'),
                                            Forms\Components\Repeater::make('items')
                                                ->schema([
                                                    Forms\Components\TextInput::make('title')->required(),
                                                    Forms\Components\Textarea::make('description'),
                                                    Forms\Components\Select::make('icon')
                                                        ->options(self::iconOptions())
                                                        ->searchable()
                                                        ->preload()
                                                        ->nullable(),
                                                ])->columns(2),
                                        ]),
                                    Forms\Components\Builder\Block::make('how_it_works')
                                        ->label('How It Works')
                                        ->icon('heroicon-o-question-mark-circle')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\TextInput::make('subtitle'),
                                            Forms\Components\Repeater::make('steps')
                                                ->schema([
                                                    Forms\Components\TextInput::make('title')->required(),
                                                    Forms\Components\Textarea::make('description'),
                                                    Forms\Components\Select::make('icon')
                                                        ->options(self::iconOptions())
                                                        ->searchable()
                                                        ->preload()
                                                        ->nullable(),
                                                ])->columns(2),
                                        ]),
                                    Forms\Components\Builder\Block::make('upload_section')
                                        ->label('Upload Section (Pharmacy)')
                                        ->icon('heroicon-o-cloud-arrow-up')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\Textarea::make('description'),
                                            Forms\Components\KeyValue::make('labels'),
                                            Forms\Components\KeyValue::make('placeholders'),
                                            Section::make('Messages')
                                                ->statePath('messages')
                                                ->schema([
                                                    Forms\Components\TextInput::make('success'),
                                                    Forms\Components\KeyValue::make('steps')
                                                        ->keyLabel('Step Key (e.g., step1)')
                                                        ->valueLabel('Message'),
                                                ]),
                                        ]),
                                    Forms\Components\Builder\Block::make('coming_soon_section')
                                        ->label('Coming Soon')
                                        ->icon('heroicon-o-clock')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\Textarea::make('description'),
                                            Forms\Components\Repeater::make('features')
                                                ->schema([
                                                    Forms\Components\TextInput::make('title'),
                                                    Forms\Components\Textarea::make('description'),
                                                    Forms\Components\Select::make('icon')->options(self::iconOptions())->searchable(),
                                                    Forms\Components\Select::make('color')
                                                        ->options([
                                                            'bg-blue-50 text-blue-600' => 'Blue',
                                                            'bg-green-50 text-green-600' => 'Green',
                                                            'bg-orange-50 text-orange-600' => 'Orange',
                                                            'bg-red-50 text-red-600' => 'Red',
                                                            'bg-purple-50 text-purple-600' => 'Purple',
                                                        ])
                                                        ->searchable()
                                                        ->nullable(),
                                                ]),
                                        ]),
                                    Forms\Components\Builder\Block::make('value_prop_section')
                                        ->label('Value Proposition')
                                        ->icon('heroicon-o-star')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\TextInput::make('subtitle'),
                                            Forms\Components\Repeater::make('items')
                                                ->schema([
                                                    Forms\Components\TextInput::make('title'),
                                                    Forms\Components\Select::make('icon')
                                                        ->options(self::iconOptions())
                                                        ->searchable()
                                                        ->preload()
                                                        ->nullable(),
                                                    Forms\Components\TagsInput::make('points'),
                                                ])->columns(2),
                                        ]),
                                    Forms\Components\Builder\Block::make('call_to_action')
                                        ->label('Call to Action (About)')
                                        ->icon('heroicon-o-megaphone')
                                        ->schema([
                                            Forms\Components\TextInput::make('badge'),
                                            Forms\Components\TextInput::make('title')->required(),
                                            Forms\Components\RichEditor::make('description'),
                                            Forms\Components\TextInput::make('button_text')->label('Primary Button Text')->required(),
                                            Forms\Components\TextInput::make('button_url')->label('Primary Button URL')->required(),
                                            Forms\Components\Toggle::make('button_new_tab')->label('Open Primary Link in New Tab'),
                                            Forms\Components\Repeater::make('secondary_links')
                                                ->schema([
                                                    Forms\Components\TextInput::make('text'),
                                                    Forms\Components\TextInput::make('link'),
                                                    Forms\Components\Toggle::make('new_tab')->label('Open in New Tab'),
                                                    Forms\Components\Select::make('icon')
                                                        ->options(self::iconOptions())
                                                        ->searchable()
                                                        ->preload()
                                                        ->nullable(),
                                                ])->columns(3),
                                        ]),
                                    Forms\Components\Builder\Block::make('cta_section')
                                        ->label('CTA Section')
                                        ->icon('heroicon-o-megaphone')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\Textarea::make('description'),
                                            Forms\Components\TextInput::make('primary_button_text')->label('Primary Button Text'),
                                            Forms\Components\TextInput::make('primary_button_url')->label('Primary Button URL'),
                                            Forms\Components\Toggle::make('primary_button_new_tab')->label('Open Primary Link in New Tab'),
                                            Forms\Components\TextInput::make('secondary_button_text')->label('Secondary Button Text'),
                                            Forms\Components\TextInput::make('secondary_button_url')->label('Secondary Button URL'),
                                            Forms\Components\Toggle::make('secondary_button_new_tab')->label('Open Secondary Link in New Tab'),
                                        ]),
                                    Forms\Components\Builder\Block::make('online_consultation_section')
                                        ->label('Online Consultation')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\Textarea::make('description'),
                                        ]),
                                    Forms\Components\Builder\Block::make('in_clinic_consultation_section')
                                        ->label('In-Clinic Consultation')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\TextInput::make('subtitle'),
                                        ]),
                                    Forms\Components\Builder\Block::make('diagnostics_section')
                                        ->label('Diagnostics Section')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\Textarea::make('subtitle'),
                                            Forms\Components\FileUpload::make('image')->image(),
                                            Forms\Components\Repeater::make('benefits')
                                                ->schema([
                                                    Forms\Components\TextInput::make('id'),
                                                    Forms\Components\TextInput::make('text'),
                                                ])->columns(2),
                                        ]),
                                    Forms\Components\Builder\Block::make('articles_section')
                                        ->label('Articles Section')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\TextInput::make('subtitle'),
                                            Forms\Components\FileUpload::make('default_image')->image(),
                                        ]),
                                    Forms\Components\Builder\Block::make('testimonials_list')
                                        ->label('Testimonials')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\Repeater::make('testimonials')
                                                ->schema([
                                                    Forms\Components\Textarea::make('quote'),
                                                    Forms\Components\TextInput::make('author'),
                                                    Forms\Components\TextInput::make('role'),
                                                ])->columns(2),
                                        ]),
                                    Forms\Components\Builder\Block::make('testimonials_section')
                                        ->label('Testimonials Section (Dynamic)')
                                        ->icon('heroicon-o-chat-bubble-left-right')
                                        ->schema([
                                            Forms\Components\TextInput::make('title')
                                                ->required(),
                                            Forms\Components\TextInput::make('subtitle')
                                                ->required(),
                                            Forms\Components\TextInput::make('limit')
                                                ->numeric()
                                                ->minValue(1)
                                                ->maxValue(12),
                                            Forms\Components\Repeater::make('testimonials')
                                                ->schema([
                                                    Forms\Components\Textarea::make('content')->required(),
                                                    Forms\Components\TextInput::make('author_name')->required(),
                                                    Forms\Components\TextInput::make('author_role'),
                                                    Forms\Components\TextInput::make('location'),
                                                    Forms\Components\FileUpload::make('image')
                                                        ->image()
                                                        ->directory('pages/testimonials'),
                                                    Forms\Components\TextInput::make('rating')
                                                        ->numeric()
                                                        ->minValue(1)
                                                        ->maxValue(5)
                                                        ->default(5),
                                                ])
                                                ->columns(2),
                                        ]),
                                    Forms\Components\Builder\Block::make('faq_section')
                                        ->label('FAQ Section')
                                        ->icon('heroicon-o-question-mark-circle')
                                        ->schema([
                                            Forms\Components\TextInput::make('title')->required(),
                                            Forms\Components\Textarea::make('subtitle')->rows(2),
                                            Forms\Components\Repeater::make('items')
                                                ->schema([
                                                    Forms\Components\TextInput::make('question')->required(),
                                                    Forms\Components\RichEditor::make('answer')->required(),
                                                ])->columns(2),
                                            Forms\Components\TextInput::make('cta_text'),
                                            Forms\Components\TextInput::make('cta_link'),
                                            Forms\Components\Toggle::make('cta_new_tab')->label('Open CTA Link in New Tab'),
                                        ]),
                                    Forms\Components\Builder\Block::make('download_app_section')
                                        ->label('Download App')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\Textarea::make('description'),
                                            Forms\Components\TextInput::make('cta_text'),
                                            Forms\Components\TextInput::make('google_play_badge'),
                                            Forms\Components\TextInput::make('app_store_badge'),
                                            Forms\Components\FileUpload::make('image')->image(),
                                        ]),
                                    Forms\Components\Builder\Block::make('stats_section')
                                        ->label('Stats Section')
                                        ->schema([
                                            Forms\Components\Repeater::make('items')
                                                ->schema([
                                                    Forms\Components\TextInput::make('value'),
                                                    Forms\Components\TextInput::make('label'),
                                                ])->columns(2),
                                        ]),

                                    Forms\Components\Builder\Block::make('programs_section')
                                        ->label('Programs Section')
                                        ->icon('heroicon-o-rectangle-group')
                                        ->schema([
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\TextInput::make('subtitle')->label('Subtitle (Community)'),
                                            Forms\Components\Textarea::make('description'),
                                            Forms\Components\Repeater::make('items')
                                                ->schema([
                                                    Forms\Components\TextInput::make('title')->required(),
                                                    Forms\Components\Textarea::make('description'),
                                                    Forms\Components\Select::make('icon')
                                                        ->label('Icon (Telemedicine)')
                                                        ->options(self::iconOptions())
                                                        ->searchable()
                                                        ->preload()
                                                        ->nullable(),
                                                    Forms\Components\FileUpload::make('image')
                                                        ->label('Image (Community)')
                                                        ->image()
                                                        ->directory('pages/programs'),
                                                    Forms\Components\TextInput::make('link')
                                                        ->label('Link (Community)')
                                                        ->url(),
                                                    Forms\Components\Toggle::make('new_tab')->label('Open in New Tab'),
                                                ])->columns(2),
                                        ]),
                                    Forms\Components\Builder\Block::make('vehicles_list')
                                        ->label('Vehicles List')
                                        ->schema([
                                            Forms\Components\TextInput::make('label'),
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\Textarea::make('description'),
                                            Forms\Components\TextInput::make('features_label'),
                                            Forms\Components\TextInput::make('cta_text'),
                                            Forms\Components\Repeater::make('vehicles')
                                                ->schema([
                                                    Forms\Components\TextInput::make('id'),
                                                    Forms\Components\TextInput::make('name'),
                                                    Forms\Components\Textarea::make('description'),
                                                    Forms\Components\FileUpload::make('image')->image(),
                                                    Forms\Components\TextInput::make('verified_text')
                                                        ->label('Verified Badge Text')
                                                        ->placeholder('Verified'),
                                                    Forms\Components\TextInput::make('button_text')
                                                        ->label('Button Text (Override)'),
                                                    Forms\Components\TextInput::make('button_url')
                                                        ->label('Button URL (Override)'),
                                                    Forms\Components\Toggle::make('button_new_tab')->label('Open in New Tab'),
                                                    Forms\Components\TagsInput::make('features'),
                                                ])->columns(2),
                                        ]),
                                    Forms\Components\Builder\Block::make('pricing_section')
                                        ->label('Pricing Section')
                                        ->schema([
                                            Forms\Components\TextInput::make('label'),
                                            Forms\Components\TextInput::make('title'),
                                            Forms\Components\TextInput::make('subtitle'),
                                            Forms\Components\Textarea::make('description'),
                                            Forms\Components\TextInput::make('ctaText'),
                                            Forms\Components\TextInput::make('disclaimer'),
                                            Forms\Components\TextInput::make('customPackageTitle'),
                                            Forms\Components\Textarea::make('customPackageDescription'),
                                            Forms\Components\TextInput::make('customPackageButtonText'),
                                            Forms\Components\Repeater::make('tiers')
                                                ->label('Tiers (NEMT)')
                                                ->schema([
                                                    Forms\Components\TextInput::make('name'),
                                                    Forms\Components\TextInput::make('price')
                                                        ->label('Price (USD)')
                                                        ->numeric(),
                                                    Forms\Components\TextInput::make('priceNpr')
                                                        ->label('Price (NPR)')
                                                        ->numeric(),
                                                    Forms\Components\TextInput::make('unit'),
                                                    Forms\Components\TextInput::make('button_url'),
                                                    Forms\Components\Toggle::make('button_new_tab')->label('Open in New Tab'),
                                                    Forms\Components\TagsInput::make('features'),
                                                    Forms\Components\Toggle::make('highlighted'),
                                                ])->columns(2),
                                            Forms\Components\Repeater::make('plans')
                                                ->label('Plans (Easy Care 365)')
                                                ->schema([
                                                    Forms\Components\TextInput::make('id'),
                                                    Forms\Components\TextInput::make('name'),
                                                    Forms\Components\TextInput::make('price')
                                                        ->label('Price (USD)')
                                                        ->numeric(),
                                                    Forms\Components\TextInput::make('priceNpr')
                                                        ->label('Price (NPR)')
                                                        ->numeric(),
                                                    Forms\Components\TextInput::make('period'),
                                                    Forms\Components\Textarea::make('description'),
                                                    Forms\Components\TextInput::make('buttonText'),
                                                    Forms\Components\TextInput::make('button_url'),
                                                    Forms\Components\Toggle::make('button_new_tab')->label('Open in New Tab'),
                                                    Forms\Components\Repeater::make('features')
                                                        ->schema([
                                                            Forms\Components\TextInput::make('text'),
                                                            Forms\Components\Toggle::make('included')->default(true),
                                                        ])->columns(2),
                                                ])->columns(2),
                                        ]),
                                    Forms\Components\Builder\Block::make('packages_section')
                                        ->label('Health Packages Section')
                                        ->schema([
                                            Forms\Components\Repeater::make('packages')
                                                ->schema([
                                                    Forms\Components\TextInput::make('id')->required(),
                                                    Forms\Components\TextInput::make('name')->required(),
                                                    Forms\Components\TextInput::make('price')->numeric()->required(),
                                                    Forms\Components\TextInput::make('priceUsd')->numeric(),
                                                    Forms\Components\Textarea::make('description'),
                                                    Forms\Components\Repeater::make('features')
                                                        ->simple(Forms\Components\TextInput::make('text')),
                                                    Forms\Components\TextInput::make('button_url'),
                                                    Forms\Components\Toggle::make('button_new_tab')->label('Open in New Tab'),
                                                    Forms\Components\Toggle::make('is_popular'),
                                                    Forms\Components\TextInput::make('category'),
                                                ])
                                                ->itemLabel(fn (array $state): ?string => $state['name'] ?? null)
                                                ->collapsed(),
                                            
                                            Section::make('Customization Options (Add-ons)')
                                                ->schema([
                                                    Forms\Components\Repeater::make('add_ons')
                                                        ->schema([
                                                            Forms\Components\TextInput::make('id')->required(),
                                                            Forms\Components\TextInput::make('name')->required(),
                                                            Forms\Components\TextInput::make('price')->numeric()->required(),
                                                        ])->columns(3)
                                                ])
                                        ]),

                                    Forms\Components\Builder\Block::make('basics_section')
                                        ->label('Basics Section (Beyond the Basics)')
                                        ->icon('heroicon-o-plus-circle')
                                        ->schema([
                                            Forms\Components\TextInput::make('title')
                                                ->default('Beyond the Basics'),
                                            Forms\Components\RichEditor::make('description')
                                                ->default('Personalize your healthcare experience with our premium add-on services available across all packages.'),
                                            Forms\Components\Repeater::make('services')
                                                ->label('Services List')
                                                ->simple(Forms\Components\TextInput::make('title'))
                                                ->default(['Home Sample Collection', 'Doctor Consultation', 'Diet Consultation', 'Health Manager Support'])
                                                ->grid(2),
                                        ]),


                                ])
                                ->columnSpanFull(),
                        ]),
                ])->columnSpan(2),

            Group::make()
                ->schema([
                    Section::make('SEO Settings')
                        ->schema([
                            Forms\Components\TextInput::make('seo_title')
                                ->label('SEO Title')
                                ->placeholder('Browser Tab Title')
                                ->maxLength(255),
                            Forms\Components\Textarea::make('seo_description')
                                ->label('Meta Description')
                                ->placeholder('Search engine summary...')
                                ->rows(3)
                                ->maxLength(500),
                        ]),
                    Section::make('Settings')
                        ->schema([
                            Forms\Components\TextInput::make('sort_order')
                                ->numeric()
                                ->default(0)
                                ->label('Sort Order'),
                            Forms\Components\Placeholder::make('created_at')
                                ->label('Created at')
                                ->content(fn (Page $record): ?string => $record->created_at?->diffForHumans()),
                            Forms\Components\Placeholder::make('updated_at')
                                ->label('Last modified')
                                ->content(fn (Page $record): ?string => $record->updated_at?->diffForHumans()),
                        ]),
                ])->columnSpan(1),
        ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\TextColumn::make('title')
                ->searchable()
                ->sortable()
                ->weight('bold'),
            Tables\Columns\TextColumn::make('slug')
                ->searchable()
                ->color('gray'),
            Tables\Columns\IconColumn::make('is_active')
                ->boolean()
                ->label('Active')
                ->sortable(),
            Tables\Columns\TextColumn::make('updated_at')
                ->dateTime()
                ->sortable()
                ->label('Last Updated'),
        ])->filters([
            //
        ])->actions([
            EditAction::make(),
            DeleteAction::make(),
        ])->bulkActions([
            BulkActionGroup::make([
                DeleteBulkAction::make(),
            ]),
        ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPages::route('/'),
            'create' => Pages\CreatePage::route('/create'),
            'edit' => Pages\EditPage::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        self::ensureRequiredPages();
        return parent::getEloquentQuery();
    }

    protected static function ensureRequiredPages(): void
    {
        try {
            if (! DbSchema::hasTable('pages')) {
                return;
            }

            if (! DbSchema::hasColumn('pages', 'slug')) {
                return;
            }

            $content = [
                [
                    'type' => 'hero_section',
                    'data' => [
                        'title' => 'Board of Directors',
                        'subtitle' => 'Leadership team',
                        'image' => 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80',
                    ],
                ],
                [
                    'type' => 'board_members_section',
                    'data' => [
                        'title' => 'Meet Our Board of Directors',
                        'description' => 'Guided by experienced leaders committed to healthcare accessibility, quality, and patient satisfaction.',
                    ],
                ],
            ];

            $pageDefaults = [];
            if (DbSchema::hasColumn('pages', 'title')) {
                $pageDefaults['title'] = 'Board of Directors';
            }
            if (DbSchema::hasColumn('pages', 'seo_title')) {
                $pageDefaults['seo_title'] = 'Board of Directors - Easy Healthcare 101';
            }
            if (DbSchema::hasColumn('pages', 'seo_description')) {
                $pageDefaults['seo_description'] = 'Meet our leadership team committed to healthcare excellence.';
            }
            if (DbSchema::hasColumn('pages', 'hero_image')) {
                $pageDefaults['hero_image'] = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80';
            }
            if (DbSchema::hasColumn('pages', 'content')) {
                $pageDefaults['content'] = $content;
            }
            if (DbSchema::hasColumn('pages', 'is_active')) {
                $pageDefaults['is_active'] = true;
            }

            Page::firstOrCreate(['slug' => 'board-of-director'], $pageDefaults);

            if (! DbSchema::hasTable('ui_settings')) {
                return;
            }

            if (! DbSchema::hasColumn('ui_settings', 'key') || ! DbSchema::hasColumn('ui_settings', 'value')) {
                return;
            }

            UiSetting::firstOrCreate(
                ['key' => 'page.board-of-director'],
                [
                    'value' => [
                        'title' => 'Board of Director',
                        'subtitle' => 'Leadership team',
                        'members_title' => 'Meet Our Board of Directors',
                        'members_description' => 'Guided by experienced leaders committed to healthcare accessibility, quality, and patient satisfaction.',
                    ],
                ]
            );
        } catch (\Throwable) {
            return;
        }
    }
}
