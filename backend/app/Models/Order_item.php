<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order_item extends Model
{
    protected $fillable = [
        'product_id',
        'quantity',
        'list_price'
    ];

    public function products()
    {
        return $this->belongsTo(Product::class);
    }

    public function orders() {
        return $this->belongsTo(Order::class);
    }

}
