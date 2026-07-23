import { useState, useEffect } from 'react';
import { ZeyyaLogo } from '@/components/ZeyyaLogo';
import {
  adminLogin, adminLogout, isAdminLoggedIn,
  getProjects, saveProjects,
  getTestimonials, saveTestimonials,
  getSettings, saveSettings,
  changePassword,
  getPublishConfig, savePublishConfig,
  type AdminProject, type Testimonial, type SiteSettings,
} from '@/lib/storage';
import {
  Lock, LogOut, Plus, Pencil, Trash2, Save, X,
  FolderOpen, MessageSquare, Settings, Eye, ChevronRight,
  Rocket, ExternalLink, Loader2, CheckCircle, AlertCircle,
} from 'lucide-react';

// ─── Helpers ────────────────────────────────────────────────────────────────

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

function Toast({ msg, type = 'success', onClose }: { msg: string; type?: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-[100] text-white px-5 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2 ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
      {type === 'error' ? <AlertCircle size={16} /> : <span className="text-lg">✓</span>}
      {msg}
    </div>
  );
}

// ─── Publish Button ────────────────────────────────────────────────────────────

type PublishState = 'idle' | 'loading' | 'success' | 'error';

function PublishButton({ onToast }: { onToast: (m: string, t?: 'success' | 'error') => void }) {
  const [state, setState] = useState<PublishState>('idle');
  const [commitUrl, setCommitUrl] = useState('');

  const publish = async () => {
    const cfg = getPublishConfig();
    if (!cfg.secret) {
      onToast('Set Publish Secret di tab Pengaturan → GitHub Deploy terlebih dahulu.', 'error');
      return;
    }

    setState('loading');
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projects: getProjects(),
          testimonials: getTestimonials(),
          settings: getSettings(),
          secret: cfg.secret,
        }),
      });

      const data = await res.json() as {
        success?: boolean;
        message?: string;
        commitUrl?: string;
        error?: string;
        detail?: unknown;
      };

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? 'Publish gagal');
      }

      setCommitUrl(data.commitUrl ?? '');
      setState('success');
      onToast(data.message ?? 'Berhasil dipublish!', 'success');
      setTimeout(() => setState('idle'), 8000);
    } catch (err) {
      setState('error');
      onToast(err instanceof Error ? err.message : 'Terjadi kesalahan', 'error');
      setTimeout(() => setState('idle'), 5000);
    }
  };

  if (state === 'loading') {
    return (
      <button disabled className="flex items-center gap-2 px-4 py-2 bg-zeyya-orange/50 text-white rounded-xl text-xs font-bold cursor-not-allowed">
        <Loader2 size={13} className="animate-spin" /> Publishing…
      </button>
    );
  }

  if (state === 'success') {
    return (
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-green-400 text-xs font-semibold">
          <CheckCircle size={13} /> Deploy berjalan!
        </span>
        {commitUrl && (
          <a href={commitUrl} target="_blank" rel="noreferrer"
            className="text-gray-500 hover:text-white transition-colors">
            <ExternalLink size={13} />
          </a>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={publish}
      className="flex items-center gap-2 px-4 py-2 bg-zeyya-orange text-white font-bold rounded-xl hover:bg-[#e66000] transition-colors text-xs"
      title="Publish konten ke GitHub & trigger Vercel deploy"
    >
      <Rocket size={13} /> Publish ke Website
    </button>
  );
}

// ─── Login ───────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(pwd)) {
      onLogin();
    } else {
      setErr('Password salah.');
      setPwd('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <ZeyyaLogo className="h-10 w-auto" />
        </div>
        <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
          <h1 className="text-white font-bold text-xl mb-1">Admin Panel</h1>
          <p className="text-gray-500 text-sm mb-6">Masuk untuk mengelola konten website.</p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={pwd}
                onChange={(e) => { setPwd(e.target.value); setErr(''); }}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-zeyya-orange transition-colors"
                placeholder="••••••••••••"
                autoFocus
              />
              {err && <p className="text-red-400 text-xs mt-2">{err}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-zeyya-orange text-white font-bold py-3 rounded-xl hover:bg-[#e66000] transition-colors flex items-center justify-center gap-2"
            >
              <Lock size={15} /> Masuk
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Empty project template ───────────────────────────────────────────────────

function emptyProject(): AdminProject {
  return {
    id: uid(),
    slug: '',
    category: 'Website Development',
    clientName: '',
    problemSummary: '',
    solutionSummary: '',
    aboutClient: '',
    problemDetail: '',
    analysisDetail: '',
    solutionDetail: '',
    designConcept: '',
    technologies: [],
    features: [],
    result: '',
    previewUrl: '',
    mockupImage: '',
    testimonial: { quote: '', author: '' },
  };
}

// ─── Project Form ─────────────────────────────────────────────────────────────

function ProjectForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: AdminProject;
  onSave: (p: AdminProject) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<AdminProject>(initial);
  const [techInput, setTechInput] = useState(initial.technologies.join(', '));
  const [featInput, setFeatInput] = useState(initial.features.join(', '));

  const set = (field: string, val: string) => setForm((f) => ({ ...f, [field]: val }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug || form.clientName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    onSave({
      ...form,
      slug,
      technologies: techInput.split(',').map((s) => s.trim()).filter(Boolean),
      features: featInput.split(',').map((s) => s.trim()).filter(Boolean),
    });
  };

  const field = (label: string, key: keyof AdminProject, placeholder?: string, multiline?: boolean) => (
    <div>
      <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">{label}</label>
      {multiline ? (
        <textarea
          value={form[key] as string}
          onChange={(e) => set(key, e.target.value)}
          rows={3}
          placeholder={placeholder}
          className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-zeyya-orange transition-colors resize-none"
        />
      ) : (
        <input
          type="text"
          value={form[key] as string}
          onChange={(e) => set(key, e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-zeyya-orange transition-colors"
        />
      )}
    </div>
  );

  return (
    <form onSubmit={submit} className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-4">
      <h3 className="text-white font-bold text-lg mb-4">{initial.clientName ? 'Edit Proyek' : 'Tambah Proyek Baru'}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {field('Nama Klien *', 'clientName', 'e.g. Lila Catering')}
        {field('Kategori', 'category', 'e.g. Website Development')}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {field('Ringkasan Masalah', 'problemSummary', '')}
        {field('Ringkasan Solusi', 'solutionSummary', '')}
      </div>

      {field('Tentang Klien', 'aboutClient', '', true)}
      {field('Detail Masalah', 'problemDetail', '', true)}
      {field('Detail Analisis', 'analysisDetail', '', true)}
      {field('Detail Solusi', 'solutionDetail', '', true)}
      {field('Konsep Desain', 'designConcept', '', true)}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Teknologi (pisah koma)</label>
          <input value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="Next.js, Tailwind CSS, Vercel"
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-zeyya-orange transition-colors" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Fitur (pisah koma)</label>
          <input value={featInput} onChange={(e) => setFeatInput(e.target.value)} placeholder="Menu digital, WhatsApp order, SEO"
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-zeyya-orange transition-colors" />
        </div>
      </div>

      {field('Hasil / Dampak', 'result', '', true)}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {field('URL Preview (tanpa https)', 'previewUrl', 'contoh.vercel.app')}
        {field('URL Foto Mockup', 'mockupImage', 'https://... atau kosongkan')}
      </div>

      <div className="border border-white/5 rounded-xl p-4 space-y-3">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Testimoni</p>
        <input
          type="text"
          value={form.testimonial.quote}
          onChange={(e) => setForm((f) => ({ ...f, testimonial: { ...f.testimonial, quote: e.target.value } }))}
          placeholder="Kutipan testimoni..."
          className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-zeyya-orange transition-colors"
        />
        <input
          type="text"
          value={form.testimonial.author}
          onChange={(e) => setForm((f) => ({ ...f, testimonial: { ...f.testimonial, author: e.target.value } }))}
          placeholder="Nama / jabatan pengirim testimoni"
          className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-zeyya-orange transition-colors"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-zeyya-orange text-white font-bold rounded-xl hover:bg-[#e66000] transition-colors text-sm">
          <Save size={14} /> Simpan
        </button>
        <button type="button" onClick={onCancel} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-sm">
          <X size={14} /> Batal
        </button>
      </div>
    </form>
  );
}

// ─── Projects Tab ─────────────────────────────────────────────────────────────

function ProyekTab({ onToast }: { onToast: (m: string) => void }) {
  const [projects, setProjects] = useState<AdminProject[]>(getProjects);
  const [editing, setEditing] = useState<AdminProject | null>(null);
  const [adding, setAdding] = useState(false);

  const persist = (list: AdminProject[]) => { setProjects(list); saveProjects(list); };

  const handleSave = (p: AdminProject) => {
    if (adding) {
      persist([...projects, p]);
      setAdding(false);
      onToast('Proyek berhasil ditambahkan');
    } else {
      persist(projects.map((x) => (x.id === p.id ? p : x)));
      setEditing(null);
      onToast('Proyek berhasil disimpan');
    }
  };

  const del = (id: string) => {
    if (!confirm('Hapus proyek ini?')) return;
    persist(projects.filter((p) => p.id !== id));
    onToast('Proyek dihapus');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{projects.length} proyek tersimpan</p>
        {!adding && !editing && (
          <button onClick={() => setAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-zeyya-orange text-white font-bold rounded-xl hover:bg-[#e66000] transition-colors text-sm">
            <Plus size={14} /> Tambah Proyek
          </button>
        )}
      </div>

      {adding && (
        <ProjectForm initial={emptyProject()} onSave={handleSave} onCancel={() => setAdding(false)} />
      )}

      {projects.map((p) => (
        editing?.id === p.id ? (
          <ProjectForm key={p.id} initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
        ) : (
          <div key={p.id} className="bg-[#111] border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {p.mockupImage && (
                <img src={p.mockupImage} alt="" className="w-16 h-10 object-cover rounded-lg border border-white/10" />
              )}
              <div>
                <p className="text-white font-bold text-sm">{p.clientName}</p>
                <p className="text-gray-500 text-xs">{p.category} · /{p.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {p.previewUrl && (
                <a href={`https://${p.previewUrl}`} target="_blank" rel="noreferrer"
                  className="p-2 text-gray-500 hover:text-white transition-colors" title="Lihat live">
                  <Eye size={15} />
                </a>
              )}
              <button onClick={() => setEditing(p)} className="p-2 text-gray-500 hover:text-white transition-colors">
                <Pencil size={15} />
              </button>
              <button onClick={() => del(p.id)} className="p-2 text-red-500/70 hover:text-red-400 transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        )
      ))}
    </div>
  );
}

// ─── Testimonials Tab ─────────────────────────────────────────────────────────

function TestimoniTab({ onToast }: { onToast: (m: string) => void }) {
  const [list, setList] = useState<Testimonial[]>(getTestimonials);
  const [form, setForm] = useState<Testimonial | null>(null);

  const persist = (l: Testimonial[]) => { setList(l); saveTestimonials(l); };

  const openNew = () => setForm({ id: uid(), quote: '', author: '', role: '' });

  const saveFn = () => {
    if (!form) return;
    const exists = list.find((t) => t.id === form.id);
    persist(exists ? list.map((t) => (t.id === form.id ? form : t)) : [...list, form]);
    setForm(null);
    onToast('Testimoni disimpan');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{list.length} testimoni</p>
        {!form && (
          <button onClick={openNew}
            className="flex items-center gap-2 px-4 py-2 bg-zeyya-orange text-white font-bold rounded-xl hover:bg-[#e66000] transition-colors text-sm">
            <Plus size={14} /> Tambah
          </button>
        )}
      </div>

      {form && (
        <div className="bg-[#111] border border-white/10 rounded-2xl p-5 space-y-3">
          <textarea rows={3} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })}
            placeholder="Kutipan testimoni klien..."
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-zeyya-orange transition-colors resize-none" />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="Nama / Jabatan (e.g. Owner, Lila Catering)"
              className="bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-zeyya-orange transition-colors" />
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="Kota / Detail (e.g. Kediri)"
              className="bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-zeyya-orange transition-colors" />
          </div>
          <div className="flex gap-3">
            <button onClick={saveFn} className="flex items-center gap-2 px-5 py-2.5 bg-zeyya-orange text-white font-bold rounded-xl hover:bg-[#e66000] transition-colors text-sm">
              <Save size={14} /> Simpan
            </button>
            <button onClick={() => setForm(null)} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-sm">
              <X size={14} /> Batal
            </button>
          </div>
        </div>
      )}

      {list.map((t) => (
        <div key={t.id} className="bg-[#111] border border-white/10 rounded-2xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-gray-300 text-sm italic mb-2">"{t.quote}"</p>
              <p className="text-white font-semibold text-xs">— {t.author}</p>
              {t.role && <p className="text-gray-600 text-xs">{t.role}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setForm(t)} className="p-2 text-gray-500 hover:text-white transition-colors"><Pencil size={14} /></button>
              <button onClick={() => { persist(list.filter((x) => x.id !== t.id)); onToast('Testimoni dihapus'); }}
                className="p-2 text-red-500/70 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function PengaturanTab({ onToast }: { onToast: (m: string) => void }) {
  const [cfg, setCfg] = useState<SiteSettings>(getSettings);
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [publishCfg, setPublishCfg] = useState(getPublishConfig);
  const [showSecret, setShowSecret] = useState(false);

  const saveContact = () => { saveSettings(cfg); onToast('Pengaturan kontak disimpan'); };
  const savePwd = () => {
    if (!newPwd) return;
    if (newPwd !== confirmPwd) { alert('Konfirmasi password tidak cocok.'); return; }
    if (newPwd.length < 8) { alert('Password minimal 8 karakter.'); return; }
    changePassword(newPwd);
    setNewPwd(''); setConfirmPwd('');
    onToast('Password berhasil diubah');
  };
  const savePublish = () => { savePublishConfig(publishCfg); onToast('Publish config disimpan'); };

  const inputClass = "w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-zeyya-orange transition-colors";
  const label = (txt: string) => <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">{txt}</label>;

  return (
    <div className="space-y-6 max-w-xl">
      {/* Contact */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-white font-bold">Informasi Kontak</h3>
        <div>
          {label('WhatsApp (dengan kode negara)')}
          <input value={cfg.whatsapp} onChange={(e) => setCfg({ ...cfg, whatsapp: e.target.value })}
            placeholder="6282199870047" className={inputClass} />
        </div>
        <div>
          {label('Email')}
          <input value={cfg.email} onChange={(e) => setCfg({ ...cfg, email: e.target.value })}
            placeholder="hello@zeyyastudio.com" className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            {label('Facebook (username)')}
            <input value={cfg.facebook} onChange={(e) => setCfg({ ...cfg, facebook: e.target.value })}
              placeholder="zeyyastudio" className={inputClass} />
          </div>
          <div>
            {label('Instagram (username)')}
            <input value={cfg.instagram} onChange={(e) => setCfg({ ...cfg, instagram: e.target.value })}
              placeholder="zeyyastudio" className={inputClass} />
          </div>
        </div>
        <button onClick={saveContact} className="flex items-center gap-2 px-5 py-2.5 bg-zeyya-orange text-white font-bold rounded-xl hover:bg-[#e66000] transition-colors text-sm">
          <Save size={14} /> Simpan Kontak
        </button>
      </div>

      {/* GitHub Deploy */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Rocket size={16} className="text-zeyya-orange" />
          <h3 className="text-white font-bold">GitHub Deploy</h3>
        </div>
        <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 space-y-1">
          <p className="text-gray-400 text-xs leading-relaxed">
            Untuk mengaktifkan fitur <strong className="text-white">Publish ke Website</strong>, kamu perlu:
          </p>
          <ol className="text-gray-500 text-xs space-y-1 list-decimal list-inside leading-relaxed mt-2">
            <li>Push kode ini ke GitHub repo kamu</li>
            <li>Connect repo tersebut ke Vercel</li>
            <li>Buat <strong className="text-gray-300">GitHub Personal Access Token</strong> (scope: <code className="bg-white/10 px-1 rounded">contents:write</code>)</li>
            <li>Set environment variable di Replit Secrets: <code className="bg-white/10 px-1 rounded">GITHUB_TOKEN</code>, <code className="bg-white/10 px-1 rounded">GITHUB_REPO_OWNER</code>, <code className="bg-white/10 px-1 rounded">GITHUB_REPO_NAME</code>, <code className="bg-white/10 px-1 rounded">PUBLISH_SECRET</code></li>
            <li>Masukkan nilai <code className="bg-white/10 px-1 rounded">PUBLISH_SECRET</code> di field di bawah ini</li>
          </ol>
        </div>
        <div>
          {label('Publish Secret')}
          <div className="relative">
            <input
              type={showSecret ? 'text' : 'password'}
              value={publishCfg.secret}
              onChange={(e) => setPublishCfg({ ...publishCfg, secret: e.target.value })}
              placeholder="Sama dengan nilai PUBLISH_SECRET di Replit Secrets"
              className={inputClass + ' pr-20'}
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs font-semibold transition-colors"
            >
              {showSecret ? 'Sembunyikan' : 'Tampilkan'}
            </button>
          </div>
        </div>
        <button onClick={savePublish} className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors text-sm">
          <Save size={14} /> Simpan Config
        </button>
      </div>

      {/* Password */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-white font-bold">Ganti Password Admin</h3>
        <div>
          {label('Password Baru')}
          <input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)}
            placeholder="Min. 8 karakter" className={inputClass} />
        </div>
        <div>
          {label('Konfirmasi Password')}
          <input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)}
            placeholder="Ulangi password baru" className={inputClass} />
        </div>
        <button onClick={savePwd} className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors text-sm">
          <Lock size={14} /> Ganti Password
        </button>
      </div>
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

type Tab = 'proyek' | 'testimoni' | 'pengaturan';

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('proyek');
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast(msg);
    setToastType(type);
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'proyek', label: 'Proyek & Studi Kasus', icon: <FolderOpen size={16} /> },
    { id: 'testimoni', label: 'Testimoni', icon: <MessageSquare size={16} /> },
    { id: 'pengaturan', label: 'Pengaturan', icon: <Settings size={16} /> },
  ];

  const projects = getProjects();
  const testimonials = getTestimonials();

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {toast && <Toast msg={toast} type={toastType} onClose={() => setToast('')} />}

      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0A0A0A]/90 backdrop-blur border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ZeyyaLogo className="h-7 w-auto" />
          <span className="text-gray-600 text-xs font-semibold uppercase tracking-widest hidden sm:block">Admin Panel</span>
        </div>
        <div className="flex items-center gap-3">
          <PublishButton onToast={showToast} />
          <a href="/" target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors text-xs font-semibold">
            <Eye size={13} /> Lihat Website <ChevronRight size={11} />
          </a>
          <button onClick={onLogout}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-colors text-xs font-semibold">
            <LogOut size={13} /> Keluar
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Proyek', value: projects.length },
            { label: 'Testimoni', value: testimonials.length },
            { label: 'Status', value: 'Live ✓' },
          ].map((s) => (
            <div key={s.label} className="bg-[#111] border border-white/10 rounded-xl p-4">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#111] border border-white/10 rounded-xl p-1 mb-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                tab === t.id ? 'bg-zeyya-orange text-white shadow-lg' : 'text-gray-500 hover:text-white'
              }`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'proyek' && <ProyekTab onToast={showToast} />}
        {tab === 'testimoni' && <TestimoniTab onToast={showToast} />}
        {tab === 'pengaturan' && <PengaturanTab onToast={showToast} />}
      </div>
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(isAdminLoggedIn);

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }

  return (
    <Dashboard
      onLogout={() => {
        adminLogout();
        setAuthed(false);
      }}
    />
  );
}
