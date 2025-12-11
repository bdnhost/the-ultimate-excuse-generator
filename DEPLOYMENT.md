# הוראות פריסה לשרת cPanel (PHP Shared Hosting)

## דרישות מקדימות
- שרת cPanel עם תמיכה ב-PHP 7.4+ (מומלץ PHP 8.0+)
- תמיכה ב-cURL (פעיל בדרך כלל כברירת מחדל)
- תמיכה ב-mod_rewrite (Apache)
- מפתח API של Google Gemini

## קבלת מפתח Gemini API
1. היכנס ל: https://makersuite.google.com/app/apikey
2. צור מפתח API חדש
3. שמור את המפתח במקום בטוח

## שלבי הפריסה

### שלב 1: בניית האפליקציה (כבר בוצע)
```bash
npm install
npm run build
```

### שלב 2: העלאת הקבצים
העלה את כל תוכן תיקיית `dist/` לתיקייה `public_html` בשרת:

```
public_html/
├── index.html
├── .htaccess
├── assets/
│   └── index-XXXX.js
└── api/
    ├── generate.php
    └── config.example.php
```

### שלב 3: הגדרת מפתח ה-API
1. בתיקיית `api/` בשרת, צור קובץ חדש בשם `config.php`
2. הוסף את התוכן הבא (החלף את YOUR_API_KEY_HERE במפתח שלך):

```php
<?php
define('GEMINI_API_KEY', 'YOUR_API_KEY_HERE');
```

### שלב 4: בדיקת הרשאות
וודא שההרשאות מוגדרות נכון:
- קבצי PHP: 644
- תיקיות: 755
- קובץ `config.php`: 600 (מומלץ לאבטחה מקסימלית)

### שלב 5: בדיקת האתר
1. גלוש לכתובת האתר שלך
2. נסה ליצור תירוץ
3. אם יש שגיאות, בדוק את לוגי השרת ב-cPanel

## פתרון בעיות נפוצות

### שגיאה: "Server configuration error"
- וודא שקובץ `config.php` קיים בתיקיית `api/`
- וודא שהקובץ מכיל את ה-API key הנכון

### שגיאה: "API key not configured"
- בדוק שה-API key הוזן נכון בקובץ `config.php`
- וודא שאין רווחים מיותרים

### שגיאה: "Failed to connect to AI service"
- וודא ש-cURL פעיל בשרת (בדוק ב-cPanel → PHP Selector)
- בדוק שאין חסימת תעבורה יוצאת בפיירוול השרת

### העמוד לא נטען / שגיאה 500
- בדוק שקובץ `.htaccess` הועלה (לפעמים הוא מוסתר)
- וודא ש-mod_rewrite פעיל בשרת
- בדוק לוגי שגיאות ב-cPanel

### התירוץ לא נוצר
- וודא שה-API key תקף ופעיל ב-Google AI Studio
- בדוק שיש לך מספיק קרדיטים ב-Gemini API

## מבנה הקבצים

```
dist/
├── index.html          # דף הכניסה הראשי
├── .htaccess          # הגדרות Apache לניתוב SPA
├── assets/            # קבצי JavaScript ו-CSS
│   └── index-*.js     # קוד האפליקציה (מכווץ)
└── api/
    ├── generate.php        # PHP Proxy לשמירה על מפתח ה-API
    └── config.example.php  # תבנית לקובץ ההגדרות
```

## אבטחה
- מפתח ה-API מאוחסן בצד השרת בלבד (לא חשוף ללקוח)
- הקובץ `config.php` לא נכלל ב-Git
- מומלץ להגביל גישה לתיקיית `api/` באמצעות .htaccess נוסף אם נדרש

## תמיכה
אם נתקלת בבעיות, בדוק:
1. לוגי שגיאות PHP ב-cPanel
2. לוגי שרת Apache
3. קונסולת המפתחים בדפדפן (F12)
