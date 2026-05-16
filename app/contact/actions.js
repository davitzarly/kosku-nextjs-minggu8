'use server'

import { z } from 'zod'
import { insertContactMessage } from '@/lib/supabaseContact'

const nullableText = (max, message) =>
  z.preprocess(
    (value) => (typeof value === 'string' ? value.trim() : ''),
    z.string().max(max, message)
  ).transform((value) => value || null)

const contactMessageSchema = z.object({
  name: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim() : ''),
    z.string().min(1, 'Nama wajib diisi').max(100, 'Nama maksimal 100 karakter')
  ),
  email: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim().toLowerCase() : ''),
    z.string().min(1, 'Email wajib diisi').email('Format email tidak valid')
  ),
  phone: nullableText(30, 'Nomor HP maksimal 30 karakter'),
  subject: nullableText(80, 'Subjek maksimal 80 karakter'),
  message: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim() : ''),
    z.string().min(1, 'Pesan wajib diisi').max(1200, 'Pesan maksimal 1200 karakter')
  ),
})

function toContactPayload(formData) {
  return {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  }
}

function formatZodErrors(error) {
  return error.issues.reduce((fields, issue) => {
    const field = issue.path[0]
    if (field && !fields[field]) fields[field] = issue.message
    return fields
  }, {})
}

function getSubmitErrorMessage(error) {
  if (error?.status === 'CONFIG_MISSING') {
    return 'Konfigurasi Supabase di Vercel belum lengkap. Isi SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY, lalu redeploy.'
  }

  if (error?.status === 401 || error?.status === 403) {
    return 'Supabase menolak akses. Periksa API key, RLS policy, dan grant insert tabel contact_messages.'
  }

  if (error?.status === 404) {
    return 'Supabase tidak menemukan endpoint tabel. Pastikan SUPABASE_URL hanya sampai .supabase.co dan tabel contact_messages sudah dibuat.'
  }

  return `Pesan belum berhasil disimpan. Detail: ${error?.message || 'Periksa konfigurasi Supabase.'}`
}

export async function saveContactMessage(formData) {
  const result = contactMessageSchema.safeParse(toContactPayload(formData))

  if (!result.success) {
    return {
      status: 'error',
      message: 'Periksa kembali data yang wajib diisi.',
      errors: formatZodErrors(result.error),
    }
  }

  try {
    await insertContactMessage(result.data)

    return {
      status: 'success',
      message: 'Pesan berhasil tersimpan. Tim KosKu akan membalas dalam 1x24 jam.',
      errors: {},
    }
  } catch (error) {
    return {
      status: 'error',
      message: getSubmitErrorMessage(error),
      errors: {},
    }
  }
}
