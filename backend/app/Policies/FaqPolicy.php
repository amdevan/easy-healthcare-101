<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Faq;

class FaqPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('view_faqs');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Faq $model): bool
    {
        return $user->hasPermission('view_faqs');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('create_faqs');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Faq $model): bool
    {
        return $user->hasPermission('edit_faqs');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Faq $model): bool
    {
        return $user->hasPermission('delete_faqs');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Faq $model): bool
    {
        return $user->hasPermission('edit_faqs');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Faq $model): bool
    {
        return $user->hasPermission('delete_faqs');
    }
}
