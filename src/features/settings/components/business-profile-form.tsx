// biome-ignore-all lint/performance/noImgElement: images are stored as data URLs in the database

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlus, PenLine, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { TextField } from '@/components/ui/text-field'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/server/orpc/client'
import type { BusinessProfile } from '../types'
import {
  type BusinessProfileFormValues,
  businessProfileFormSchema,
} from '../utils/settings-schema'

const MAX_IMAGE_SIZE = 1024 * 1024

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function ImagePicker({
  label,
  hint,
  icon,
  value,
  onChange,
}: {
  label: string
  hint: string
  icon: React.ReactNode
  value: string
  onChange: (value: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('فقط فایل تصویر انتخاب کنید.')
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('حجم تصویر حداکثر ۱ مگابایت باشد.')
      return
    }

    try {
      onChange(await readFileAsDataUrl(file))
    } catch {
      toast.error('خواندن تصویر ناموفق بود.')
    }
  }

  return (
    <div className="space-y-2">
      <span className="font-medium text-sm">{label}</span>
      <div className="flex items-center gap-3 rounded-xl border p-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
        <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-dashed bg-muted/50 text-muted-foreground">
          {value ? (
            <img
              src={value}
              alt={label}
              className={`object-contain ${label === 'امضا' ? 'size-full p-1' : 'size-10'}`}
            />
          ) : (
            icon
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="text-muted-foreground text-xs">{hint}</span>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              <ImagePlus />
              {value ? 'تغییر تصویر' : 'افزودن'}
            </Button>
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange('')}
              >
                حذف
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function BusinessProfileForm({ profile }: { profile: BusinessProfile }) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BusinessProfileFormValues>({
    resolver: zodResolver(businessProfileFormSchema),
    defaultValues: {
      name: profile.name ?? '',
      title: profile.title ?? '',
      description: profile.description ?? '',
      logo: profile.logo ?? '',
      signature: profile.signature ?? '',
    },
  })

  const logo = watch('logo') ?? ''
  const signature = watch('signature') ?? ''

  async function onSubmit(values: BusinessProfileFormValues) {
    try {
      await api.settings.update(values)
      toast.success('پروفایل با موفقیت ذخیره شد.')
      router.refresh()
    } catch {
      toast.error('ذخیره پروفایل ناموفق بود. دوباره تلاش کنید.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-5 sm:grid-cols-2"
    >
      <ImagePicker
        label="لوگو"
        hint="در بالای فاکتورها نمایش داده می‌شود"
        icon={<Upload className="size-5" />}
        value={logo}
        onChange={(value) => setValue('logo', value)}
      />
      <ImagePicker
        label="امضا"
        hint="روی فاکتور در محل امضا نمایش داده می‌شود"
        icon={<PenLine className="size-5" />}
        value={signature}
        onChange={(value) => setValue('signature', value)}
      />
      <TextField
        label="نام کسب‌وکار"
        placeholder="مثلاً: فروشگاه آفتاب"
        error={errors.name?.message}
        {...register('name')}
      />
      <TextField
        label="عنوان"
        placeholder="مثلاً: فروش عمده و خرده"
        error={errors.title?.message}
        {...register('title')}
      />
      <div className="grid gap-2 sm:col-span-2">
        <label className="font-medium text-sm">توضیحات</label>
        <Textarea
          placeholder="توضیح کوتاهی درباره کسب‌وکار خود..."
          aria-invalid={!!errors.description}
          {...register('description')}
        />
        {errors.description && (
          <span className="font-medium text-destructive text-xs">
            {errors.description.message}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 sm:col-span-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'در حال ذخیره…' : 'ذخیره تغییرات'}
        </Button>
      </div>
    </form>
  )
}
