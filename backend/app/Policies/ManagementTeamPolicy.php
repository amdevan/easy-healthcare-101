<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ManagementTeam;
use Illuminate\Auth\Access\Response;

class ManagementTeamPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('view_management_teams');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ManagementTeam $model): bool
    {
        return $user->hasPermission('view_management_teams');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('create_management_teams');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ManagementTeam $model): bool
    {
        return $user->hasPermission('edit_management_teams');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ManagementTeam $model): bool
    {
        return $user->hasPermission('delete_management_teams');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ManagementTeam $model): bool
    {
        return $user->hasPermission('edit_management_teams');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ManagementTeam $model): bool
    {
        return $user->hasPermission('delete_management_teams');
    }
}
