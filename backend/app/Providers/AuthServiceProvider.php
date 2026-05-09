<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\BoardMember;
use App\Policies\BoardMemberPolicy;
use App\Models\ManagementTeam;
use App\Policies\ManagementTeamPolicy;
use App\Models\Inquiry;
use App\Policies\InquiryPolicy;
use App\Models\Driver;
use App\Policies\DriverPolicy;
use App\Models\Faq;
use App\Policies\FaqPolicy;
use App\Models\LabTest;
use App\Policies\LabTestPolicy;
use App\Models\PharmacyOrder;
use App\Policies\PharmacyOrderPolicy;
use App\Models\Staff;
use App\Policies\StaffPolicy;
use App\Models\Vehicle;
use App\Policies\VehiclePolicy;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        BoardMember::class => BoardMemberPolicy::class,
        ManagementTeam::class => ManagementTeamPolicy::class,
        Inquiry::class => InquiryPolicy::class,
        Driver::class => DriverPolicy::class,
        Faq::class => FaqPolicy::class,
        LabTest::class => LabTestPolicy::class,
        PharmacyOrder::class => PharmacyOrderPolicy::class,
        Staff::class => StaffPolicy::class,
        Vehicle::class => VehiclePolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}

