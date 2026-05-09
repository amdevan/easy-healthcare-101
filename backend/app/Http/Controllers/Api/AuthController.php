<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Patient;
use App\Models\Role;
use App\Models\UiSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
        ]);

        $role = Role::where('slug', 'patient')->first();
        
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role_id' => $role ? $role->id : null,
        ]);

        // Create Patient record linked to user
        $patient = Patient::create([
            'user_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $data['phone'] ?? null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $this->sendSignupNotifications($user, $patient);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
            'patient' => $patient,
        ], 201);
    }

    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid login details'], 401);
        }

        $user = User::where('email', $request['email'])->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        // Ensure patient record exists (if user registered via admin panel and is a patient)
        if (!$user->patient) {
             // You might want to check if the user is actually a patient role before auto-creating
             // But for now, if they login to the patient app, we assume they are a patient or become one.
             $patient = Patient::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]);
            $user->refresh();
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
            'patient' => $user->patient,
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        $user->load('patient');
        return response()->json($user);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    private function sendSignupNotifications(User $user, Patient $patient): void
    {
        $settings = UiSetting::query()->where('key', 'communication')->value('value') ?? [];

        $mail = is_array($settings['mail'] ?? null) ? $settings['mail'] : [];
        $sms = is_array($settings['sms'] ?? null) ? $settings['sms'] : [];

        try {
            if (($mail['enabled'] ?? false) && ($mail['notify_user_on_signup'] ?? true) && $user->email) {
                $this->sendMail($mail, [$user->email], 'Welcome to Easy Healthcare', "Hi {$user->name},\n\nYour account has been created successfully.\n\nThanks,\nEasy Healthcare");
            }
        } catch (\Throwable $e) {
        }

        try {
            if (($mail['enabled'] ?? false) && ($mail['notify_admin_on_signup'] ?? false)) {
                $adminRecipients = $this->splitList($mail['admin_recipients'] ?? '');
                if (count($adminRecipients) > 0) {
                    $this->sendMail($mail, $adminRecipients, 'New signup', "New signup:\nName: {$user->name}\nEmail: {$user->email}\nPhone: " . ($patient->phone ?? '-'));
                }
            }
        } catch (\Throwable $e) {
        }

        try {
            if (($sms['enabled'] ?? false) && ($sms['notify_user_on_signup'] ?? false) && $patient->phone) {
                $this->sendSms($sms, $patient->phone, "Welcome {$user->name}! Your Easy Healthcare account is created.");
            }
        } catch (\Throwable $e) {
        }

        try {
            if (($sms['enabled'] ?? false) && ($sms['notify_admin_on_signup'] ?? false)) {
                $adminNumbers = $this->splitList($sms['admin_numbers'] ?? '');
                foreach ($adminNumbers as $to) {
                    $this->sendSms($sms, $to, "New signup: {$user->name} ({$user->email})");
                }
            }
        } catch (\Throwable $e) {
        }
    }

    private function sendMail(array $mail, array $to, string $subject, string $body): void
    {
        $driver = (string) ($mail['driver'] ?? 'smtp');

        config([
            'mail.default' => $driver,
        ]);

        $fromName = trim((string) ($mail['from_name'] ?? ''));
        $fromAddress = trim((string) ($mail['from_address'] ?? ''));
        if ($fromName !== '') {
            config(['mail.from.name' => $fromName]);
        }
        if ($fromAddress !== '') {
            config(['mail.from.address' => $fromAddress]);
        }

        if ($driver === 'smtp') {
            $scheme = trim((string) ($mail['encryption'] ?? ''));
            config([
                'mail.mailers.smtp.host' => (string) ($mail['host'] ?? ''),
                'mail.mailers.smtp.port' => (int) ($mail['port'] ?? 587),
                'mail.mailers.smtp.username' => (string) ($mail['username'] ?? ''),
                'mail.mailers.smtp.password' => (string) ($mail['password'] ?? ''),
                'mail.mailers.smtp.scheme' => $scheme !== '' ? $scheme : null,
                'mail.mailers.smtp.url' => null,
            ]);
        }

        Mail::raw($body, function ($message) use ($to, $subject) {
            $message->to($to)->subject($subject);
        });
    }

    private function sendSms(array $sms, string $to, string $message): void
    {
        $provider = (string) ($sms['provider'] ?? 'twilio');

        if ($provider === 'twilio') {
            $twilio = is_array($sms['twilio'] ?? null) ? $sms['twilio'] : [];
            $sid = (string) ($twilio['account_sid'] ?? '');
            $token = (string) ($twilio['auth_token'] ?? '');
            $from = (string) ($twilio['from_number'] ?? '');
            if ($sid === '' || $token === '' || $from === '') {
                return;
            }

            Http::withBasicAuth($sid, $token)
                ->asForm()
                ->post("https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json", [
                    'From' => $from,
                    'To' => $to,
                    'Body' => $message,
                ]);

            return;
        }

        if ($provider === 'sparrow') {
            $sparrow = is_array($sms['sparrow'] ?? null) ? $sms['sparrow'] : [];
            $apiKey = (string) ($sparrow['api_key'] ?? '');
            $sender = (string) ($sparrow['sender'] ?? '');
            $baseUrl = (string) ($sparrow['base_url'] ?? 'https://api.sparrowsms.com/v2/sms/');
            if ($apiKey === '' || $sender === '' || $baseUrl === '') {
                return;
            }

            Http::asForm()->post($baseUrl, [
                'token' => $apiKey,
                'from' => $sender,
                'to' => $to,
                'text' => $message,
            ]);

            return;
        }

        $other = is_array($sms['other'] ?? null) ? $sms['other'] : [];
        $baseUrl = (string) ($other['base_url'] ?? '');
        if ($baseUrl === '') {
            return;
        }

        Http::asForm()->post($baseUrl, [
            'to' => $to,
            'message' => $message,
            'api_key' => (string) ($other['api_key'] ?? ''),
            'api_secret' => (string) ($other['api_secret'] ?? ''),
            'sender' => (string) ($other['sender'] ?? ''),
        ]);
    }

    private function splitList(string $value): array
    {
        $parts = preg_split("/[,\n\r]+/", $value) ?: [];
        $out = [];
        foreach ($parts as $p) {
            $s = trim($p);
            if ($s !== '') {
                $out[] = $s;
            }
        }
        return array_values(array_unique($out));
    }
}
