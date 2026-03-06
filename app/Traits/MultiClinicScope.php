<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

trait MultiClinicScope
{
    public static function bootMultiClinicScope()
    {
        static::creating(function (Model $model) {
            if (empty($model->clinic_id) && session()->has('active_clinic_id')) {
                $model->clinic_id = session('active_clinic_id');
            }
        });

        static::addGlobalScope('clinic', function (Builder $builder) {
            if (session()->has('active_clinic_id')) {
                $column = $builder->getModel()->getTable().'.clinic_id';
                $builder->where($column, session('active_clinic_id'));
            }
        });
    }
}
