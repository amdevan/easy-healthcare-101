<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Driver;

class DriverPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('view_drivers');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Driver $model): bool
    {
        return $user->hasPermission('view_drivers');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('create_drivers');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Driver $model): bool
    {
        return $user->hasPermission('edit_drivers');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Driver $model): bool
    {
        return $user->hasPermission('delete_drivers');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Driver $model): bool
    {
        return $user->hasPermission('edit_drivers');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Driver $model): bool
    {
        return $user->hasPermission('delete_drivers');
    }
}
