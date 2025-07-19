"use client";

import {
  ExclamationTriangleIcon,
  UserPlusIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  LockClosedIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  BoltIcon,
  TrophyIcon,
  PhoneArrowUpRightIcon,
  HeartIcon,
  CurrencyDollarIcon,
  UserIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  ComputerDesktopIcon,
  UsersIcon,
  WifiIcon,
  PowerIcon,
  EyeSlashIcon,
  FireIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <>
      {/* Small Device Warning - Shows for screens under 250px */}
      <div className="fixed inset-0 bg-[#0A2540] text-white items-center justify-center z-[9999] px-4 text-center hidden">
        <div>
          <div className="text-4xl mb-4">📱</div>
          <h1 className="text-lg font-bold mb-2">
            Your device is too small for Jusur (جسور)
          </h1>
          <p className="text-sm text-gray-300">
            Please use a larger screen or rotate your device
          </p>
        </div>
      </div>

      {/* Header & Navigation - Fixed Top */}
      <header className="bg-white fixed top-0 left-0 right-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center min-h-[64px]">
          {/* Logo - Top Left */}
          <div className="font-extrabold text-xl text-[#0A2540] flex items-center gap-2">
            <span data-lang-en="">Jusur <span className="hide-nav">(جسور)</span></span>
            <span data-lang-ar="" className="hidden">
              جسور
            </span>
            <TrophyIcon className="hide-nav h-4 w-4 text-yellow-700" />
            <span
              className="hide-nav text-yellow-700 text-sm font-semibold"
              data-lang-en=""
            >
              Winner (إن شاء الله)
            </span>
            <span
              className="hide-nav text-yellow-700 text-sm font-semibold"
              data-lang-ar=""
              style={{ display: "none" }}
            >
              فائز (إن شاء الله)
            </span>
          </div>

          {/* Navigation - Top Right */}
          <div className="flex items-center space-x-3">
            {/* Donate Button */}
            <a
              href="/donation"
              className="bg-green-600 text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <CurrencyDollarIcon className="h-4 w-4" />
              <span className="hide-nav" data-lang-en="">
                Donate
              </span>
              <span data-lang-ar="" className="hidden">
                تبرع
              </span>
            </a>

            {/* Language Toggle */}
            <button
              id="lang-toggle"
              className="bg-gray-100 text-gray-700 px-3 py-2 rounded-full font-semibold text-sm hover:bg-gray-200 transition-colors"
            >
              <span data-lang-en="">ع</span>
              <span data-lang-ar="" className="hidden">
                EN
              </span>
            </button>

            {/* User/Login Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-[#0A2540] px-3 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors">
                <UserIcon className="h-4 w-4" />
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <a
                    href="/login/gaza-clinician"
                    className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-[#0A2540] transition-colors"
                  >
                    <span data-lang-en="">Login (Gaza Clinician)</span>
                    <span data-lang-ar="" className="hidden">
                      دخول طبيب غزة
                    </span>
                  </a>
                  <a
                    href="/login/uk-clinician"
                    className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-[#0A2540] transition-colors"
                  >
                    <span data-lang-en="">Login (UK Clinician)</span>
                    <span data-lang-ar="" className="hidden">
                      دخول طبيب بريطاني
                    </span>
                  </a>
                  <a
                    href="/register/uk-clinician"
                    className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-[#0A2540] transition-colors"
                  >
                    <span data-lang-en="">Register (UK Clinician)</span>
                    <span data-lang-ar="" className="hidden">
                      تسجيل طبيب بريطاني
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-green-800 to-green-950 text-white text-center pt-28 pb-20 px-6">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight initial-hidden animate-fadeInUp">
              <span data-lang-en="">
                Their Hospitals Are Beyond Capacity. Your Expertise is Their
                Lifeline.
              </span>
              <span data-lang-ar="" className="hidden">
                نظام صحي على وشك الانهيار
              </span>
            </h1>
            <div className="mt-6 text-lg md:text-xl text-gray-200 max-w-4xl mx-auto initial-hidden animate-fadeInUp animation-delay-200">
              <p>
                <span data-lang-en="">
                  <strong>Jusur (جسور)</strong> is the Arabic word for bridges.
                  Just because we cannot get physical aid into Gaza, it does not
                  mean we cannot provide them support, bridging our knowledge to
                  people who need it the <em>most</em>.
                </span>
                <span data-lang-ar="" className="hidden">
                  <strong>جسور</strong> كلمة عربية تعني الجسور. مجرد أننا لا
                  نستطيع إدخال المساعدات المادية إلى غزة، لا يعني أننا لا نستطيع
                  تقديم الدعم لهم، وربط معرفتنا بالأشخاص الذين يحتاجونها أكثر من
                  غيرهم.
                </span>
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto text-center">
              <div className="bg-white p-6 rounded-xl shadow-md initial-hidden animate-fadeInUp hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-4xl font-extrabold text-red-500">
                  2.3 Million
                </h3>
                <p className="mt-2 font-semibold text-gray-600">
                  <span data-lang-en="">People need urgent healthcare</span>
                  <span data-lang-ar="" className="hidden">
                    شخص بحاجة لرعاية صحية عاجلة
                  </span>
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md initial-hidden animate-fadeInUp animation-delay-200 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-4xl font-extrabold text-red-500">
                  Only 17/36
                </h3>
                <p className="mt-2 font-semibold text-gray-600">
                  <span data-lang-en="">
                    Hospitals{" "}
                    <span className="text-red-500">partially&nbsp;</span>
                    functional
                  </span>
                  <span data-lang-ar="" className="hidden">
                    مستشفى يعمل جزئياً
                  </span>
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md initial-hidden animate-fadeInUp animation-delay-400 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-4xl font-extrabold text-red-500">90%</h3>
                <p className="mt-2 font-semibold text-gray-600">
                  <span data-lang-en="">Shortage of specialists</span>
                  <span data-lang-ar="" className="hidden">
                    نقص في الأخصائيين
                  </span>
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md initial-hidden animate-fadeInUp animation-delay-600 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-4xl font-extrabold text-red-500">
                  Limited
                </h3>
                <p className="mt-2 font-semibold text-gray-600">
                  <span data-lang-en="">Medical supply access</span>
                  <span data-lang-ar="" className="hidden">
                    وصول محدود للإمدادات الطبية
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-8">
              <div className="inline-block bg-red-800/80 text-white font-semibold px-4 py-2 rounded-full mt-4">
                <p>
                  <span data-lang-en="">
                    <strong>UK Doctors Agree*:</strong> Your remote guidance is
                    currently the #1 most impactful intervention.
                  </span>
                  <span data-lang-ar="" className="hidden">
                    <strong>100% من جراحي بريطانيا يوافقون:</strong> إرشادك عن
                    بعد هو التدخل الأكثر تأثيراً.
                  </span>
                </p>
              </div>
            </div>
            <p className="mt-8 text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
              <span data-lang-en="">
                In Gaza, hospitals are overwhelmed, operating at over{" "}
                <strong className="text-red-500">350%&nbsp;</strong>
                capacity with a critical shortage of specialist doctors. Triage
                is happening, but without the right expertise to guide complex
                treatments,{" "}
                <strong>lives that could be saved are being lost</strong>. When
                physical aid cannot get in, knowledge is the <em>most</em>{" "}
                powerful resource we can send.
              </span>
              <span data-lang-ar="" className="hidden">
                في غزة، المستشفيات مكتظة وتعمل بأكثر من 350% من طاقتها مع نقص
                حاد في الأطباء الأخصائيين. يتم الفرز، ولكن بدون الخبرة المناسبة
                لتوجيه العلاجات المعقدة، تُفقد أرواح كان يمكن إنقاذها. عندما لا
                تتمكن المساعدات المادية من الدخول، تكون المعرفة هي أقوى مورد
                يمكننا إرساله.
              </span>
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href="#"
                className="w-full sm:w-auto bg-white text-[#0A2540] px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition-transform transform hover:scale-105 flex items-center justify-center gap-3 initial-hidden animate-slideInLeft animation-delay-800"
              >
                <UserPlusIcon className="h-6 w-6" />
                <span data-lang-en="">Register as UK Doctor</span>
                <span data-lang-ar="" className="hidden">
                  سجل كطبيب بريطاني
                </span>
              </a>
              <a
                href="#"
                className="w-full sm:w-auto bg-red-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-3 initial-hidden animate-slideInRight animation-delay-1000"
              >
                <PhoneArrowUpRightIcon className="h-6 w-6" />
                <span data-lang-en="">Emergency Consultation</span>
                <span data-lang-ar="" className="hidden">
                  استشارة طارئة
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* Why UK Specialists Section */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                <span data-lang-en="">
                  Why UK Medical Specialists Are Critical
                </span>
                <span data-lang-ar="" className="hidden">
                  لماذا يعتبر الأخصائيون الطبيون في بريطانيا حاسمين
                </span>
              </h2>
            </div>

            {/* UK Specialists Benefits - Green Border */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-green-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <VideoCameraIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold">
                    <span data-lang-en="">Remote Consultation Expertise</span>
                    <span data-lang-ar="" className="hidden">
                      خبرة في الاستشارات عن بعد
                    </span>
                  </h3>
                </div>
                <p className="text-gray-600">
                  <span data-lang-en="">
                    UK doctors provide life-saving specialist guidance when
                    local expertise is overwhelmed or unavailable.
                  </span>
                  <span data-lang-ar="" className="hidden">
                    يقدم أطباء بريطانيا إرشادات متخصصة منقذة للحياة عندما تكون
                    الخبرة المحلية مرهقة أو غير متوفرة.
                  </span>
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-green-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <BoltIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold">
                    <span data-lang-en="">
                      Immediate Access, Breaking Barriers
                    </span>
                    <span data-lang-ar="" className="hidden">
                      وصول فوري، كسر الحواجز
                    </span>
                  </h3>
                </div>
                <p className="text-gray-600">
                  <span data-lang-en="">
                    Digital consultations bypass physical restrictions and
                    blockade limitations to deliver urgent medical support.
                  </span>
                  <span data-lang-ar="" className="hidden">
                    تتجاوز الاستشارات الرقمية القيود المادية وقيود الحصار لتقديم
                    دعم طبي عاجل.
                  </span>
                </p>
              </div>
            </div>

            {/* Gaza Healthcare Challenges - Red Border */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                <span data-lang-en="">
                  Critical Challenges in Gaza Healthcare
                </span>
                <span data-lang-ar="" className="hidden">
                  التحديات الحاسمة في الرعاية الصحية في غزة
                </span>
              </h3>

              {/* Medical/Clinical Challenges */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-8">
                <div className="bg-gray-50 p-6 rounded-xl border-2 border-red-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <FireIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <h4 className="text-lg font-bold">
                      <span data-lang-en="">Complex Trauma</span>
                      <span data-lang-ar="" className="hidden">
                        صدمة معقدة
                      </span>
                    </h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    <span data-lang-en="">
                      Limited advanced surgical expertise for complex blast
                      injuries
                    </span>
                    <span data-lang-ar="" className="hidden">
                      خبرة جراحية متقدمة محدودة للإصابات المعقدة من الانفجارات
                    </span>
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border-2 border-red-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <AcademicCapIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <h4 className="text-lg font-bold">
                      <span data-lang-en="">Training Deficit</span>
                      <span data-lang-ar="" className="hidden">
                        نقص التدريب
                      </span>
                    </h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    <span data-lang-en="">
                      Limited opportunities for continuing education and skill
                      development
                    </span>
                    <span data-lang-ar="" className="hidden">
                      فرص محدودة للتعليم المستمر وتطوير المهارات
                    </span>
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border-2 border-red-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <MagnifyingGlassIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <h4 className="text-lg font-bold">
                      <span data-lang-en="">Diagnostic Limitations</span>
                      <span data-lang-ar="" className="hidden">
                        قيود التشخيص
                      </span>
                    </h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    <span data-lang-en="">
                      Lack of diagnostic modalities like pathology and advanced
                      imaging
                    </span>
                    <span data-lang-ar="" className="hidden">
                      نقص في وسائل التشخيص مثل علم الأمراض والتصوير المتقدم
                    </span>
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border-2 border-red-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <UsersIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <h4 className="text-lg font-bold">
                      <span data-lang-en="">Multidisciplinary Gap</span>
                      <span data-lang-ar="" className="hidden">
                        فجوة متعددة التخصصات
                      </span>
                    </h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    <span data-lang-en="">
                      Lack of experts in some specialties which hinders the
                      implementation of multidisciplinary coordinated team-based
                      approaches to complex cases
                    </span>
                    <span data-lang-ar="" className="hidden">
                      نقص الخبراء في بعض التخصصات مما يعيق تنفيذ نُهج فرق متعددة
                      التخصصات منسقة للحالات المعقدة
                    </span>
                  </p>
                </div>
              </div>

              {/* Infrastructure Challenges */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                <div className="bg-gray-50 p-6 rounded-xl border-2 border-red-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <WifiIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <h4 className="text-lg font-bold">
                      <span data-lang-en="">Connectivity Issues</span>
                      <span data-lang-ar="" className="hidden">
                        مشاكل الاتصال
                      </span>
                    </h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    <span data-lang-en="">
                      Internet availability limited to few hours daily with low
                      average speeds
                    </span>
                    <span data-lang-ar="" className="hidden">
                      توفر الإنترنت محدود لساعات قليلة يومياً بسرعات منخفضة
                    </span>
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border-2 border-red-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <ComputerDesktopIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <h4 className="text-lg font-bold">
                      <span data-lang-en="">Device Limitations</span>
                      <span data-lang-ar="" className="hidden">
                        قيود الأجهزة
                      </span>
                    </h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    <span data-lang-en="">
                      Shortage of computing devices, solutions must work on
                      basic smartphones
                    </span>
                    <span data-lang-ar="" className="hidden">
                      نقص في أجهزة الحوسبة، يجب أن تعمل الحلول على الهواتف
                      الذكية الأساسية
                    </span>
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border-2 border-red-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <PowerIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <h4 className="text-lg font-bold">
                      <span data-lang-en="">Power Restrictions</span>
                      <span data-lang-ar="" className="hidden">
                        قيود الطاقة
                      </span>
                    </h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    <span data-lang-en="">
                      Electricity available almost only in hospitals or medical
                      points
                    </span>
                    <span data-lang-ar="" className="hidden">
                      الكهرباء متوفرة تقريباً فقط في المستشفيات أو النقاط الطبية
                    </span>
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border-2 border-red-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <EyeSlashIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <h4 className="text-lg font-bold">
                      <span data-lang-en="">Data Security Concerns</span>
                      <span data-lang-ar="" className="hidden">
                        مخاوف أمن البيانات
                      </span>
                    </h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    <span data-lang-en="">
                      Patient privacy must be maintained despite infrastructure
                      challenges
                    </span>
                    <span data-lang-ar="" className="hidden">
                      يجب الحفاظ على خصوصية المرضى رغم تحديات البنية التحتية
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center mt-12 text-lg text-gray-700 font-semibold">
              <span data-lang-en="">
                Your expertise can bridge the gap between{" "}
                <strong className="text-red-500">critical need</strong>{" "}
                and&nbsp;
                <strong className="text-green-500">life-saving care</strong>.
              </span>
              <span data-lang-ar="" className="hidden">
                خبرتك يمكن أن تسد الفجوة بين الحاجة الماسة والرعاية المنقذة
                للحياة.
              </span>
            </p>
          </div>
        </section>

        {/* Platform Features Section */}
        <section id="features" className="py-20 md:py-28 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                <span data-lang-en="">Platform Features</span>
                <span data-lang-ar="" className="hidden">
                  ميزات المنصة
                </span>
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                <span data-lang-en="">
                  Humanitarian medical technology designed specifically for
                  Gaza&apos;s healthcare crisis.
                </span>
                <span data-lang-ar="" className="hidden">
                  تكنولوجيا طبية إنسانية مصممة خصيصًا لأزمة الرعاية الصحية في
                  غزة.
                </span>
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold">
                  <span data-lang-en="">Emergency Consultation</span>
                  <span data-lang-ar="" className="hidden">
                    استشارة طارئة
                  </span>
                </h3>
                <p className="mt-1 text-gray-600">
                  <span data-lang-en="">
                    24/7 instant access to UK specialists for critical
                    emergencies.
                  </span>
                  <span data-lang-ar="" className="hidden">
                    وصول فوري على مدار الساعة طوال أيام الأسبوع إلى أخصائيين
                    بريطانيين لحالات الطوارئ الحرجة.
                  </span>
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <VideoCameraIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold">
                  <span data-lang-en="">Secure Video Calls</span>
                  <span data-lang-ar="" className="hidden">
                    مكالمات فيديو آمنة
                  </span>
                </h3>
                <p className="mt-1 text-gray-600">
                  <span data-lang-en="">
                    Encrypted video and chat between Gaza clinicians and UK
                    experts.
                  </span>
                  <span data-lang-ar="" className="hidden">
                    مكالمات فيديو ودردشة مشفرة بين أطباء غزة وخبراء بريطانيا.
                  </span>
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <UserGroupIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold">
                  <span data-lang-en="">Expert Matching</span>
                  <span data-lang-ar="" className="hidden">
                    مطابقة الخبراء
                  </span>
                </h3>
                <p className="mt-1 text-gray-600">
                  <span data-lang-en="">
                    Intelligent specialist matching based on medical expertise
                    and availability.
                  </span>
                  <span data-lang-ar="" className="hidden">
                    مطابقة ذكية للأخصائيين بناءً على الخبرة الطبية والتوافر.
                  </span>
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <DocumentTextIcon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold">
                  <span data-lang-en="">Medical Records</span>
                  <span data-lang-ar="" className="hidden">
                    السجلات الطبية
                  </span>
                </h3>
                <p className="mt-1 text-gray-600">
                  <span data-lang-en="">
                    Secure patient data documentation and medical record
                    management.
                  </span>
                  <span data-lang-ar="" className="hidden">
                    توثيق آمن لبيانات المرضى وإدارة السجلات الطبية.
                  </span>
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <DevicePhoneMobileIcon className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold">
                  <span data-lang-en="">Offline Access</span>
                  <span data-lang-ar="" className="hidden">
                    الوصول دون اتصال
                  </span>
                </h3>
                <p className="mt-1 text-gray-600">
                  <span data-lang-en="">
                    Works offline with limited internet - designed for
                    Gaza&apos;s connectivity challenges.
                  </span>
                  <span data-lang-ar="" className="hidden">
                    يعمل دون اتصال بالإنترنت المحدود - مصمم لتحديات الاتصال في
                    غزة.
                  </span>
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <GlobeAltIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold">
                  <span data-lang-en="">Arabic-English Support</span>
                  <span data-lang-ar="" className="hidden">
                    دعم عربي-إنجليزي
                  </span>
                </h3>
                <p className="mt-1 text-gray-600">
                  <span data-lang-en="">
                    Full multilingual interface with medical translation
                    capabilities.
                  </span>
                  <span data-lang-ar="" className="hidden">
                    واجهة متعددة اللغات بالكامل مع إمكانيات الترجمة الطبية.
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-12 text-center text-sm font-semibold text-gray-600 flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
              <span className="flex items-center gap-2">
                <LockClosedIcon className="h-4 w-4" />
                <span data-lang-en="">End-to-End Encrypted</span>
                <span data-lang-ar="" className="hidden">
                  تشفير كامل
                </span>
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheckIcon className="h-4 w-4" />
                <span data-lang-en="">HIPAA Compliant</span>
                <span data-lang-ar="" className="hidden">
                  متوافق مع HIPAA
                </span>
              </span>
              <span className="flex items-center gap-2">
                <GlobeAltIcon className="h-4 w-4" />
                <span data-lang-en="">Globally Accessible</span>
                <span data-lang-ar="" className="hidden">
                  يمكن الوصول إليه عالميًا
                </span>
              </span>
              <span className="flex items-center gap-2">
                <BoltIcon className="h-4 w-4" />
                <span data-lang-en="">Real-time Sync</span>
                <span data-lang-ar="" className="hidden">
                  مزامنة في الوقت الفعلي
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              <span data-lang-en="">Simple, Secure, and Built for Impact</span>
              <span data-lang-ar="" className="hidden">
                بسيط، آمن، ومصمم للتأثير
              </span>
            </h2>
            <div className="mt-16 relative flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto">
              <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 border-t-2 border-dashed border-gray-300"></div>
              <div className="relative flex flex-col items-center text-center z-10 mb-12 md:mb-0">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold border-4 border-white">
                  1
                </div>
                <h3 className="mt-4 text-xl font-bold">
                  <span data-lang-en="">Register & Verify</span>
                  <span data-lang-ar="" className="hidden">
                    سجل وتحقق
                  </span>
                </h3>
                <p className="mt-2 text-gray-600 max-w-xs">
                  <span data-lang-en="">
                    Securely verify your GMC credentials in minutes.
                  </span>
                  <span data-lang-ar="" className="hidden">
                    تحقق من بيانات GMC الخاصة بك بأمان في دقائق.
                  </span>
                </p>
              </div>
              <div className="relative flex flex-col items-center text-center z-10 mb-12 md:mb-0">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold border-4 border-white">
                  2
                </div>
                <h3 className="mt-4 text-xl font-bold">
                  <span data-lang-en="">Connect on Your Terms</span>
                  <span data-lang-ar="" className="hidden">
                    تواصل بشروطك
                  </span>
                </h3>
                <p className="mt-2 text-gray-600 max-w-xs">
                  <span data-lang-en="">
                    Set your availability for on-call pings, MDTs, or forum
                    consults.
                  </span>
                  <span data-lang-ar="" className="hidden">
                    حدد مدى توافرك لنداءات الطوارئ أو اجتماعات الفريق أو
                    استشارات المنتدى.
                  </span>
                </p>
              </div>
              <div className="relative flex flex-col items-center text-center z-10">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold border-4 border-white">
                  3
                </div>
                <h3 className="mt-4 text-xl font-bold">
                  <span data-lang-en="">Guide and Save Lives</span>
                  <span data-lang-ar="" className="hidden">
                    أرشد وأنقذ الأرواح
                  </span>
                </h3>
                <p className="mt-2 text-gray-600 max-w-xs">
                  <span data-lang-en="">
                    Provide life-saving guidance through our secure,
                    low-bandwidth platform.
                  </span>
                  <span data-lang-ar="" className="hidden">
                    قدم إرشادات منقذة للحياة عبر منصتنا الآمنة ومنخفضة النطاق
                    الترددي.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Join Mission CTA */}
        <section id="join" className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              <span data-lang-en="">
                Join the Mission to Save Lives in Gaza
              </span>
              <span data-lang-ar="" className="hidden">
                انضم إلى مهمة إنقاذ الأرواح في غزة
              </span>
            </h2>
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-gray-50 p-8 rounded-xl border-2 border-blue-600 text-center flex flex-col h-full">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <BuildingOffice2Icon className="h-8 w-8 text-blue-600" />
                  <h3 className="text-xl font-bold">
                    <span data-lang-en="">Gaza Clinicians</span>
                    <span data-lang-ar="" className="hidden">
                      للكوادر الطبية في غزة
                    </span>
                  </h3>
                </div>
                <p className="mt-2 text-gray-600 flex-grow">
                  <span data-lang-en="">
                    Register for free, immediate access to verified UK
                    specialists for emergency consultations.
                  </span>
                  <span data-lang-ar="" className="hidden">
                    سجل للحصول على وصول فوري ومجاني إلى أخصائيين بريطانيين
                    معتمدين للاستشارات الطارئة.
                  </span>
                </p>
                <a
                  href="#"
                  className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 flex items-center justify-center gap-2 mx-auto w-fit"
                >
                  <UserPlusIcon className="h-5 w-5 flex-shrink-0" />
                  <span data-lang-en="">Register Now</span>
                  <span data-lang-ar="" className="hidden">
                    سجل الآن
                  </span>
                </a>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl border-2 border-red-600 text-center flex flex-col h-full">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <HeartIcon className="h-8 w-8 text-red-600" />
                  <h3 className="text-xl font-bold">
                    <span data-lang-en="">UK Medical Specialists</span>
                    <span data-lang-ar="" className="hidden">
                      للأخصائيين الطبيين في بريطانيا
                    </span>
                  </h3>
                </div>
                <p className="mt-2 text-gray-600 flex-grow">
                  <span data-lang-en="">
                    Volunteer your expertise to provide critical medical
                    consultations when traditional aid channels are restricted.
                  </span>
                  <span data-lang-ar="" className="hidden">
                    تطوع بخبرتك لتقديم استشارات طبية حاسمة عندما تكون قنوات
                    المساعدات التقليدية مقيدة.
                  </span>
                </p>
                <a
                  href="#"
                  className="mt-6 bg-red-600 text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 flex items-center justify-center gap-2 mx-auto w-fit"
                >
                  <HeartIcon className="h-5 w-5 flex-shrink-0" />
                  <span data-lang-en="">Sign Up to Help</span>
                  <span data-lang-ar="" className="hidden">
                    سجل للمساعدة
                  </span>
                </a>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl border-2 border-green-600 text-center flex flex-col h-full">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                  <h3 className="text-xl font-bold">
                    <span data-lang-en="">Support Gaza</span>
                    <span data-lang-ar="" className="hidden">
                      ادعم غزة
                    </span>
                  </h3>
                </div>
                <p className="mt-2 text-gray-600 flex-grow">
                  <span data-lang-en="">
                    Can&apos;t provide medical expertise? Support our platform
                    and help fund critical medical equipment for Gaza.
                  </span>
                  <span data-lang-ar="" className="hidden">
                    لا تستطيع تقديم خبرة طبية؟ ادعم منصتنا وساعد في تمويل
                    المعدات الطبية الحيوية لغزة.
                  </span>
                </p>
                <a
                  href="/donation"
                  className="mt-6 bg-green-600 text-white px-6 py-3 rounded-full font-bold hover:bg-green-700 flex items-center justify-center gap-2 mx-auto w-fit"
                >
                  <CurrencyDollarIcon className="h-5 w-5 flex-shrink-0" />
                  <span data-lang-en="">Donate Now</span>
                  <span data-lang-ar="" className="hidden">
                    تبرع الآن
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-800 to-green-950 text-white">
        <div className="container mx-auto px-6 py-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-extrabold text-2xl mb-4">
              <span data-lang-en="">Jusur (جسور)</span>
              <span data-lang-ar="" className="hidden">
                جسور
              </span>
            </h3>

            <p className="text-gray-300 mb-4 text-lg">
              <span data-lang-en="">
                Combining research from the &quot;Hack for Gaza 2025
                Hackathon&quot; to inform evidence-based innovation.
              </span>
              <span data-lang-ar="" className="hidden">
                الجمع بين البحث من &quot;هاكاثون غزة 2025&quot; لإعلام الابتكار
                القائم على الأدلة.
              </span>
            </p>

            <div className="text-yellow-400 font-semibold text-center">
              <div className="flex items-center justify-center mb-2">
                <TrophyIcon className="h-5 w-5" />
              </div>
              <div>
                <span data-lang-en="">
                  Hack for Gaza 2025 Winner (إن شاء الله)
                </span>
                <span data-lang-ar="" className="hidden">
                  هاكاثون من أجل غزة 2025
                </span>
              </div>
            </div>

            <div className="mt-6 text-gray-400 text-sm">
              <p>&copy; 2025 Jusur (جسور) Platform. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
