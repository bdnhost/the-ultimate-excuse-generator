<?php
/**
 * Gemini API Proxy - Protects API key from client exposure
 * For: The Ultimate Excuse Generator
 */

// Enable error reporting for debugging (disable in production)
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

// CORS Headers - Allow requests from same origin
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Load API key from config file (more secure than .env on shared hosting)
$configFile = __DIR__ . '/config.php';
if (!file_exists($configFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Server configuration error - config.php not found']);
    exit;
}

require_once $configFile;

if (!defined('GEMINI_API_KEY') || empty(GEMINI_API_KEY)) {
    http_response_code(500);
    echo json_encode(['error' => 'API key not configured']);
    exit;
}

// Get request body
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['prompt'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request - prompt is required']);
    exit;
}

$prompt = $data['prompt'];

// Gemini API configuration
$apiKey = GEMINI_API_KEY;
$model = 'gemini-2.5-flash';
$apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

// Response schema for structured output
$responseSchema = [
    'type' => 'object',
    'properties' => [
        'text' => [
            'type' => 'string',
            'description' => 'The generated excuse text in Hebrew.'
        ],
        'successRate' => [
            'type' => 'integer',
            'description' => 'Estimated percentage chance (0-100) that this excuse will work.'
        ],
        'teacherReaction' => [
            'type' => 'string',
            'description' => 'A short, predicted reaction from the teacher in Hebrew.'
        ],
        'emoji' => [
            'type' => 'string',
            'description' => 'A single emoji representing the excuse vibe.'
        ]
    ],
    'required' => ['text', 'successRate', 'teacherReaction', 'emoji']
];

// Build request payload
$payload = [
    'contents' => [
        [
            'parts' => [
                ['text' => $prompt]
            ]
        ]
    ],
    'generationConfig' => [
        'responseMimeType' => 'application/json',
        'responseSchema' => $responseSchema,
        'temperature' => 1.0
    ]
];

// Make request to Gemini API
$ch = curl_init($apiUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json'
    ],
    CURLOPT_TIMEOUT => 30,
    CURLOPT_SSL_VERIFYPEER => true
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Handle cURL errors
if ($curlError) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to connect to AI service']);
    exit;
}

// Handle API errors
if ($httpCode !== 200) {
    http_response_code($httpCode);
    $errorData = json_decode($response, true);
    $errorMessage = $errorData['error']['message'] ?? 'Unknown API error';
    echo json_encode(['error' => $errorMessage]);
    exit;
}

// Parse and return the response
$responseData = json_decode($response, true);

if (!$responseData || !isset($responseData['candidates'][0]['content']['parts'][0]['text'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Invalid response from AI service']);
    exit;
}

// Extract the generated content
$generatedText = $responseData['candidates'][0]['content']['parts'][0]['text'];
$excuseData = json_decode($generatedText, true);

if (!$excuseData) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to parse AI response']);
    exit;
}

// Return the excuse data
echo json_encode($excuseData);
