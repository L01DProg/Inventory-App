<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\Email;
use Illuminate\Http\Request;

class MailController extends Controller
{
    public function index()
    {

        $user = User::find(1);
        $data = [
            "hi" => "Hi {$user->username}",
            "message" => "You need to refill the products"
        ];

        $user->notify(new Email($data));

        dd("send notification..");
    }
}
