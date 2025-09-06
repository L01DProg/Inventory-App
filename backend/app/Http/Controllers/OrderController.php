<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Order_item;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function purchaseProducts(Request $request)
    {
        try {

            $validatedData = $request->validate([
                'cart_items' => 'required|array|min:1',
                'cart_items.*.product_id' => 'required|uuid|exists:products,id',
                'cart_items.*.quantity' => 'required|integer|min:1',
            ]);


            $user = $request->user();


            DB::beginTransaction();

            $totalPrice = 0;
            $orderItems = [];


            foreach ($validatedData['cart_items'] as $item) {
                $product = Product::with('stocks')->findOrFail($item['product_id']);
                $quantity = $item['quantity'];


                if ($product->stocks->quantity < $quantity) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'Insufficient stock for product: ' . $product->product_name
                    ], Response::HTTP_BAD_REQUEST);
                }


                $totalPrice += $product->price * $quantity;
                $orderItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'list_price' => $product->price,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];


                $product->stocks->decrement('quantity', $quantity);
            }


            $order = Order::create([
                'user_id' => $user->id,
                'total_price' => $totalPrice,
            ]);


            $order->orderItems()->createMany($orderItems);


            DB::commit();

            return response()->json([
                'message' => 'Purchase completed successfully.',
                'order' => $order->load('orderItems.products')
            ], Response::HTTP_CREATED);
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'An error occurred during the purchase.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function customerOrders($userId)
    {

        $user = User::with(['orders' => function ($query) {
            $query->latest();
        }])->find($userId);

        return $user;
    }

    public function totalSales()
    {
        $totalSales = DB::table('orders')
            ->sum('total_price');

        return response()->json([
            'total_sales' => $totalSales,
        ]);
    }

    public function totalRevenue()
    {
        $totalSales = DB::table('orders')->sum('total_price');

        $totalCostOfSold = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->sum(DB::raw('order_items.quantity * products.cost'));

        $revenue = $totalSales - $totalCostOfSold;

        return response()->json([
            'revenue' => $revenue
        ]);
    }

    
}
