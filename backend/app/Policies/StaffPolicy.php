<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Staff;

class StaffPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('view_staff');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Staff $model): bool
    {
        return $user->hasPermission('view_staff');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('create_staff');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Staff $model): bool
    {
        return $user->hasPermission('edit_staff');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Staff $model): bool
    {
        return $user->hasPermission('delete_staff');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Staff $model): bool
    {
        return $user->hasPermission('edit_staff');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Staff $model): bool
    {
        return $user->hasPermission('delete_staff');
    }
}
