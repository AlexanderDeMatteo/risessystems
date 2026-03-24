'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { BranchesHeader } from '@/components/branches/branches-header'
import { BranchesGrid, type BranchGridItem } from '@/components/branches/branches-grid'
import { AddBranchDialog } from '@/components/branches/add-branch-dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { createBranch } from '@/app/actions/branches'

interface BranchesPageClientProps {
  initialBranches: BranchGridItem[]
  branchesError?: string
}

export function BranchesPageClient({ initialBranches, branchesError }: BranchesPageClientProps) {
  const router = useRouter()
  const t = useTranslations('branches')
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleBranchAdded = async (formData: { name: string; address: string; phone: string; email: string }) => {
    const result = await createBranch({
      name: formData.name,
      address: formData.address || undefined,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
    })
    if (result.ok) {
      setIsDialogOpen(false)
      router.refresh()
    }
  }

  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {branchesError && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('couldNotLoadBranches')}</AlertTitle>
            <AlertDescription>{branchesError}</AlertDescription>
          </Alert>
        )}
        <BranchesHeader
          onAddClick={() => setIsDialogOpen(true)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <BranchesGrid branches={initialBranches} searchTerm={searchTerm} />
        <AddBranchDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onBranchAdded={handleBranchAdded}
        />
      </div>
    </main>
  )
}
