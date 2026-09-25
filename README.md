# منظومة المتابعة والقياس والتقييم والتقويم
## المشروع القومي للياقة البدنية بالمعاهد الأزهرية

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/reyada-platform)

---

## 🏗️ Stack التقني

| الطبقة | التقنية |
|--------|---------|
| **Framework** | Next.js 15 (App Router) |
| **قاعدة البيانات** | MongoDB Atlas (Free Tier) |
| **المصادقة** | Supabase Auth |
| **النشر** | Vercel |
| **الأنماط** | TypeScript + Mongoose |

---

## 🚀 خطوات الإعداد والنشر

### 1. إعداد Supabase (مجاناً)

1. انتقل إلى [supabase.com](https://supabase.com) وأنشئ مشروعاً جديداً
2. من **Settings → API** انسخ:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (اسرار - لا تشاركها)
3. من **Authentication → Settings** فعّل Email/Password provider

### 2. إعداد MongoDB Atlas (مجاناً)

1. انتقل إلى [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. أنشئ مشروعاً جديداً واختر **Free Tier (M0)**
3. من **Database → Connect** انسخ connection string
   - استبدل `<username>` و`<password>` ببياناتك
   - مثال: `mongodb+srv://user:pass@cluster.mongodb.net/reyada`
4. من **Network Access** أضف IP: `0.0.0.0/0` للسماح لـ Vercel

### 3. إعداد المشروع محلياً

```bash
# انسخ المشروع
git clone https://github.com/YOUR_USERNAME/reyada-platform
cd reyada-platform

# ثبّت الحزم
npm install

# انسخ ملف البيئة
cp .env.example .env.local

# حرر .env.local وأضف قيمك الحقيقية
# ثم شغّل الخادم
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

### 4. إنشاء أول مستخدم (System Admin)

بعد إعداد Supabase وMongoDB، شغّل سكريبت الإعداد الأولي:

```bash
# أنشئ مستخدماً في Supabase Auth أولاً (من Dashboard → Authentication)
# ثم أضفه إلى MongoDB عبر API:
POST /api/setup/seed
```

> **ملاحظة:** endpoint `/api/setup/seed` متاح فقط في البيئة التطويرية

### 5. النشر على Vercel + GitHub

```bash
# 1. أنشئ repository على GitHub
git init
git add .
git commit -m "feat: initial reyada platform"
git remote add origin https://github.com/YOUR_USERNAME/reyada-platform.git
git push -u origin main

# 2. انتقل إلى vercel.com
# 3. اضغط "Import Project" واختر الـ repo
# 4. أضف متغيرات البيئة في Vercel Dashboard:
#    Settings → Environment Variables
```

المتغيرات البيئية المطلوبة في Vercel:
```
MONGODB_URI
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
JWT_SECRET
NEXT_PUBLIC_APP_URL (عنوان vercel مثل https://reyada.vercel.app)
```

---

## 📁 هيكل المشروع

```
reyada-platform/
├── app/
│   ├── (auth)/              # صفحات المصادقة
│   │   └── login/
│   ├── dashboard/           # لوحات القيادة
│   │   ├── general/         # الإدارة العامة
│   │   ├── region/          # المنطقة الأزهرية
│   │   ├── administration/  # الإدارة التعليمية
│   │   ├── institute/       # المعهد
│   │   ├── corrective-actions/
│   │   ├── field-visits/
│   │   ├── quality/
│   │   ├── students/
│   │   ├── plans/
│   │   └── reports/
│   └── api/                 # REST API endpoints
│       ├── auth/
│       ├── me/
│       ├── regions/
│       ├── administrations/
│       ├── institutes/
│       ├── corrective-actions/
│       ├── field-visits/
│       ├── quality-assessments/
│       ├── students/
│       ├── student-measurements/
│       ├── dashboard/
│       ├── reports/
│       └── notifications/
├── lib/                     # مكتبات مشتركة
│   ├── mongodb.ts           # اتصال MongoDB
│   ├── supabase.ts          # عميل Supabase
│   ├── auth.ts              # RBAC utilities
│   └── utils.ts             # دوال مساعدة
├── models/                  # نماذج Mongoose
│   ├── User.ts
│   ├── Region.ts
│   ├── EducationalAdministration.ts
│   ├── Institute.ts
│   ├── AcademicCycle.ts
│   ├── InstitutePlan.ts
│   ├── FieldVisit.ts
│   ├── QualityAssessment.ts
│   ├── Student.ts
│   ├── StudentMeasurement.ts
│   ├── CorrectiveAction.ts
│   ├── AuditLog.ts
│   └── Notification.ts
├── middleware.ts             # حماية المسارات
└── .env.example
```

---

## 👥 الأدوار والصلاحيات

| الدور | الوصول |
|-------|--------|
| `institute_manager` | معهده فقط |
| `administration_supervisor` | معاهد إدارته فقط |
| `region_manager` | منطقته الأزهرية كاملة |
| `general_admin` | كل البيانات |
| `system_admin` | إدارة المستخدمين والإعدادات |

---

## 📊 المؤشرات المحسوبة تلقائياً

- **مؤشر الانتشار**: معاهد منفذة ÷ إجمالي معاهد × 100
- **مؤشر المشاركة**: طلاب مشاركون ÷ طلاب مستهدفون × 100
- **مؤشر التنفيذ**: أنشطة منفذة ÷ أنشطة مخططة × 100
- **مؤشر إغلاق الفجوات**: إجراءات مغلقة ÷ إجمالي إجراءات × 100

---

## 🔒 الأمان

- JWT Authentication عبر Supabase
- Server-side RBAC في كل API endpoint
- HTTPOnly Cookies
- Audit Log لجميع العمليات الحساسة
- حماية من تجاوز النطاق التنظيمي

---

## 📝 ترخيص

هذا المشروع مخصص للمشروع القومي للياقة البدنية بالمعاهد الأزهرية.
