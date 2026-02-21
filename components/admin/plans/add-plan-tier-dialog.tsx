'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { PlatformPlan } from '@/lib/types/platform-plans'

const formSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    min_active_users: z.coerce.number().min(0, 'Min must be 0 or more'),
    max_active_users: z.union([
      z.literal(''),
      z.coerce.number().min(0),
    ]),
    price_monthly: z.coerce.number().min(0, 'Price must be 0 or more'),
    is_active: z.boolean(),
    overage_threshold: z.union([z.literal(''), z.coerce.number().min(0)]),
    overage_price_per_user: z.coerce.number().min(0),
  })
  .refine(
    data => {
      if (data.max_active_users === '') return true
      return data.max_active_users >= data.min_active_users
    },
    { message: 'Max must be >= min', path: ['max_active_users'] }
  )

type FormValues = z.infer<typeof formSchema>

interface AddPlanTierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdded: (tier: PlatformPlan) => void
  currentTiers: PlatformPlan[]
}

function nextSortOrder(plans: PlatformPlan[]): number {
  if (plans.length === 0) return 1
  return Math.max(...plans.map(p => p.sort_order), 0) + 1
}

export function AddPlanTierDialog({
  open,
  onOpenChange,
  onAdded,
  currentTiers,
}: AddPlanTierDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      min_active_users: 0,
      max_active_users: '',
      price_monthly: 0,
      is_active: true,
      overage_threshold: '',
      overage_price_per_user: 0,
    },
  })

  const onSubmit = (values: FormValues) => {
    const max =
      values.max_active_users === ''
        ? null
        : (values.max_active_users as number)
    const overageThreshold =
      values.overage_threshold === ''
        ? null
        : (values.overage_threshold as number)
    const tier: PlatformPlan = {
      id: Date.now(),
      name: values.name,
      min_active_users: values.min_active_users,
      max_active_users: max,
      price_monthly: values.price_monthly,
      is_active: values.is_active,
      sort_order: nextSortOrder(currentTiers),
      overage_threshold: overageThreshold ?? undefined,
      overage_price_per_user:
        overageThreshold != null && values.overage_price_per_user > 0
          ? values.overage_price_per_user
          : undefined,
    }
    onAdded(tier)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle>Add tier</DialogTitle>
          <DialogDescription>
            Create a new platform tier with active user range and monthly price
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Growth" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="min_active_users"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min active users</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_active_users"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max active users (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="Leave empty for no cap"
                        value={field.value === '' ? '' : field.value}
                        onChange={e =>
                          field.onChange(
                            e.target.value === '' ? '' : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="price_monthly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (monthly)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step={0.01} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="overage_threshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overage threshold (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="e.g. 300"
                        value={field.value === '' ? '' : field.value}
                        onChange={e =>
                          field.onChange(
                            e.target.value === '' ? '' : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="overage_price_per_user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per user over threshold ($)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={0.01} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                  <FormLabel>Active</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add tier</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
