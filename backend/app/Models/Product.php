<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Product extends Model
{
    use HasUuids;
    protected $fillable = [
        'category_id',
        'product_name',
        'description',
        'price',
        'cost',
        'expiration_date',
        'image'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function categories()
    {
        return $this->belongsTo(Category::class);
    }

    public function stocks()
    {
        return $this->hasOne(Stock::class);
    }

    public function order_items() {
        return $this->hasMany(Order_item::class);
    }
}
