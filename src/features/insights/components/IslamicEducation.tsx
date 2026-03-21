import { useState } from 'react';
import { BookOpen, ChevronRight, Clock, Star, Search, Play, CheckCircle2, Lock } from 'lucide-react';

const categories = [
  { id: 'all', label: 'Semua' },
  { id: 'zakat', label: 'Zakat' },
  { id: 'riba', label: 'Riba' },
  { id: 'halal', label: 'Halal & Haram' },
  { id: 'budgeting', label: 'Budgeting Syariah' },
  { id: 'sedekah', label: 'Sedekah' },
];

const articles = [
  {
    id: 1,
    category: 'zakat',
    title: 'Apa Itu Zakat dan Siapa yang Wajib Membayarnya?',
    description: 'Pelajari pengertian zakat, nisab, haul, dan siapa saja yang wajib menunaikannya sesuai syariat Islam.',
    readTime: '5 menit',
    level: 'Pemula',
    completed: true,
    icon: '🌙',
    color: '#065f46',
    bg: '#f0fdf4',
  },
  {
    id: 2,
    category: 'zakat',
    title: 'Cara Menghitung Zakat Penghasilan dengan Benar',
    description: 'Panduan langkah demi langkah menghitung zakat maal dan zakat penghasilan berdasarkan harta yang kamu miliki.',
    readTime: '7 menit',
    level: 'Pemula',
    completed: true,
    icon: '💰',
    color: '#047857',
    bg: '#ecfdf5',
  },
  {
    id: 3,
    category: 'riba',
    title: 'Mengenal Riba: Jenis dan Bahayanya dalam Islam',
    description: 'Apa itu riba, mengapa diharamkan, dan bagaimana cara menghindarinya dalam kehidupan keuangan sehari-hari.',
    readTime: '8 menit',
    level: 'Pemula',
    completed: false,
    icon: '🚫',
    color: '#dc2626',
    bg: '#fef2f2',
  },
  {
    id: 4,
    category: 'halal',
    title: 'Kategori Pengeluaran Halal dan Haram untuk Muslim',
    description: 'Ketahui mana pengeluaran yang diperbolehkan dan mana yang harus dihindari agar keuangan kamu tetap berkah.',
    readTime: '6 menit',
    level: 'Pemula',
    completed: false,
    icon: '✅',
    color: '#d97706',
    bg: '#fffbeb',
  },
  {
    id: 5,
    category: 'budgeting',
    title: 'Prinsip 1/3 dalam Islam: Panduan Alokasi Keuangan',
    description: 'Nabi Muhammad SAW mengajarkan keseimbangan dalam pengeluaran. Pelajari cara menerapkan prinsip ini di era modern.',
    readTime: '10 menit',
    level: 'Menengah',
    completed: false,
    icon: '⚖️',
    color: '#7c3aed',
    bg: '#faf5ff',
  },
  {
    id: 6,
    category: 'sedekah',
    title: 'Keutamaan Sedekah dan Cara Membiasakan Diri',
    description: 'Mengapa sedekah itu penting, dalil-dalilnya, dan tips praktis membiasakan sedekah walaupun penghasilan terbatas.',
    readTime: '6 menit',
    level: 'Pemula',
    completed: false,
    icon: '❤️',
    color: '#db2777',
    bg: '#fdf2f8',
  },
  {
    id: 7,
    category: 'budgeting',
    title: 'Konsep Kantong Syariah: Pisahkan Dana agar Berkah',
    description: 'Cara mengelola keuangan dengan memisahkan dana ke kantong berbeda agar tidak tercampur dan lebih teratur.',
    readTime: '9 menit',
    level: 'Menengah',
    completed: false,
    icon: '👜',
    color: '#0891b2',
    bg: '#f0f9ff',
  },
  {
    id: 8,
    category: 'riba',
    title: 'Alternatif Halal Pengganti Pinjaman Berbunga',
    description: 'Solusi keuangan syariah yang bisa kamu gunakan sebagai pengganti KTA, kartu kredit, dan pinjaman berbunga lainnya.',
    readTime: '8 menit',
    level: 'Menengah',
    completed: false,
    icon: '🔄',
    color: '#065f46',
    bg: '#f0fdf4',
  },
];

const tips = [
  { icon: '🌟', text: 'Sisihkan minimal 2.5% dari tabungan untuk zakat setiap tahun' },
  { icon: '📖', text: 'Catat setiap pengeluaran agar bisa memastikan kehalalannya' },
  { icon: '💡', text: 'Hindari transaksi dengan bunga, cari alternatif produk syariah' },
  { icon: '🤲', text: 'Biasakan sedekah rutin walaupun jumlahnya kecil' },
];

export function IslamicEducation() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = articles.filter((a) => {
    const matchCategory = activeCategory === 'all' || a.category === activeCategory;
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const completedCount = articles.filter((a) => a.completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-1">Edukasi Keuangan Syariah</h1>
        <p className="text-muted-foreground">Pelajari prinsip keuangan Islam untuk mengelola harta dengan berkah.</p>
      </div>

      {/* Progress Banner */}
      <div className="bg-gradient-to-r from-[#065f46] to-[#047857] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Progress Belajarmu</p>
            <h3 className="text-2xl font-semibold mb-2">{completedCount} dari {articles.length} materi selesai</h3>
            <div className="w-48 bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / articles.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Tips Harian */}
      <div className="bg-gradient-to-br from-[#fef3c7] to-[#fde68a] rounded-2xl p-5 border border-[#d97706]/20">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-[#d97706]" fill="#d97706" />
          Tips Keuangan Islami Hari Ini
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-foreground">
              <span>{tip.icon}</span>
              <span>{tip.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari materi edukasi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#065f46]"
        />
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeCategory === cat.id
                ? 'bg-[#065f46] text-white shadow-md'
                : 'bg-card border border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((article) => (
          <div
            key={article.id}
            className="bg-card rounded-2xl p-5 border border-border hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: article.bg }}
              >
                {article.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: article.bg, color: article.color }}
                  >
                    {article.level}
                  </span>
                  {article.completed && (
                    <CheckCircle2 className="w-4 h-4 text-[#047857]" />
                  )}
                </div>
                <h4 className="font-semibold text-foreground mb-1 leading-snug">{article.title}</h4>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{article.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </div>
                  <button
                    className="flex items-center gap-1 text-xs font-medium group-hover:gap-2 transition-all duration-200"
                    style={{ color: article.color }}
                  >
                    {article.completed ? 'Baca Ulang' : 'Mulai Belajar'}
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Materi tidak ditemukan.</p>
        </div>
      )}
    </div>
  );
}