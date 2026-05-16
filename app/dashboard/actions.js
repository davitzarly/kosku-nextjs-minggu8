'use server'

import { cookies } from 'next/headers'
import { z } from 'zod'
import { createKosProperty, deleteKosProperty, updateKosProperty } from '@/lib/supabaseKos'

const availabilityOptions = ['Tersedia', 'Terbatas', 'Penuh']
const SESSION_COOKIE = 'kosku_session'

const updateKosSchema = z.object({
  id: z.string().min(1, 'ID kos tidak valid'),
  price: z.coerce
    .number({ invalid_type_error: 'Harga harus berupa angka' })
    .int('Harga harus berupa angka bulat')
    .min(500000, 'Harga minimal Rp 500.000')
    .max(10000000, 'Harga maksimal Rp 10.000.000'),
  availability: z.enum(availabilityOptions, {
    errorMap: () => ({ message: 'Status ketersediaan tidak valid' }),
  }),
})

const deleteKosSchema = z.string().min(1, 'ID kos tidak valid')

const createKosSchema = z.object({
  name: z.string().trim().min(1, 'Nama kos wajib diisi').max(100, 'Nama kos maksimal 100 karakter'),
  city: z.string().trim().min(1, 'Kota wajib diisi').max(80, 'Kota maksimal 80 karakter'),
  area: z.string().trim().min(1, 'Area wajib diisi').max(120, 'Area maksimal 120 karakter'),
  owner: z.string().trim().min(1, 'Pemilik wajib diisi').max(100, 'Pemilik maksimal 100 karakter'),
  rooms: z.coerce.number().int('Jumlah kamar harus angka bulat').min(1, 'Minimal 1 kamar').max(200, 'Maksimal 200 kamar'),
  price: z.coerce.number().int('Harga harus angka bulat').min(500000, 'Harga minimal Rp 500.000').max(10000000, 'Harga maksimal Rp 10.000.000'),
  availability: z.enum(availabilityOptions, {
    errorMap: () => ({ message: 'Status ketersediaan tidak valid' }),
  }),
  rating: z.coerce.number().min(0, 'Rating minimal 0').max(5, 'Rating maksimal 5'),
})

function isAdminSessionValid() {
  return cookies().get(SESSION_COOKIE)?.value === 'authenticated'
}

function getSubmitErrorMessage(error, fallback) {
  if (error?.status === 'CONFIG_MISSING') {
    return 'Konfigurasi Supabase belum lengkap. Isi SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY.'
  }

  return error?.message || fallback
}

export async function createKosAction(formData) {
  if (!isAdminSessionValid()) {
    return {
      status: 'error',
      message: 'Sesi admin tidak valid. Silakan login ulang.',
    }
  }

  const result = createKosSchema.safeParse({
    name: formData.get('name'),
    city: formData.get('city'),
    area: formData.get('area'),
    owner: formData.get('owner'),
    rooms: formData.get('rooms'),
    price: formData.get('price'),
    availability: formData.get('availability'),
    rating: formData.get('rating'),
  })

  if (!result.success) {
    return {
      status: 'error',
      message: result.error.issues[0]?.message || 'Data kos tidak valid.',
    }
  }

  try {
    const createdProperty = await createKosProperty({
      id: `kos-${Date.now()}`,
      ...result.data,
    })

    return {
      status: 'success',
      message: 'Card kos berhasil ditambahkan.',
      data: createdProperty,
    }
  } catch (error) {
    return {
      status: 'error',
      message: getSubmitErrorMessage(error, 'Data kos belum berhasil ditambahkan.'),
    }
  }
}

export async function updateKosAction(formData) {
  if (!isAdminSessionValid()) {
    return {
      status: 'error',
      message: 'Sesi admin tidak valid. Silakan login ulang.',
    }
  }

  const result = updateKosSchema.safeParse({
    id: formData.get('id'),
    price: formData.get('price'),
    availability: formData.get('availability'),
  })

  if (!result.success) {
    return {
      status: 'error',
      message: result.error.issues[0]?.message || 'Data kos tidak valid.',
    }
  }

  try {
    const updatedProperty = await updateKosProperty(result.data.id, {
      price: result.data.price,
      availability: result.data.availability,
    })

    return {
      status: 'success',
      message: 'Data kos berhasil diperbarui.',
      data: updatedProperty,
    }
  } catch (error) {
    return {
      status: 'error',
      message: getSubmitErrorMessage(error, 'Data kos belum berhasil diperbarui.'),
    }
  }
}

export async function deleteKosAction(id) {
  if (!isAdminSessionValid()) {
    return {
      status: 'error',
      message: 'Sesi admin tidak valid. Silakan login ulang.',
    }
  }

  const result = deleteKosSchema.safeParse(id)

  if (!result.success) {
    return {
      status: 'error',
      message: result.error.issues[0]?.message || 'Data kos tidak valid.',
    }
  }

  try {
    await deleteKosProperty(result.data)

    return {
      status: 'success',
      message: 'Data kos berhasil dihapus.',
      id: result.data,
    }
  } catch (error) {
    return {
      status: 'error',
      message: getSubmitErrorMessage(error, 'Data kos belum berhasil dihapus.'),
    }
  }
}
