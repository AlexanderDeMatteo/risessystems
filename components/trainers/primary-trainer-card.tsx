'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Star, Mail, Phone, MapPin } from 'lucide-react'
import type { Trainer } from './edit-trainer-dialog'
import { MOCK_BRANCHES } from './trainer-form'

interface PrimaryTrainerCardProps {
  trainers: Trainer[]
  primaryTrainerByBranch: Record<string, number>
}

export function PrimaryTrainerCard({
  trainers,
  primaryTrainerByBranch,
}: PrimaryTrainerCardProps) {
  const branchesWithPrimaries = MOCK_BRANCHES.filter(
    (b) => primaryTrainerByBranch[b.name] != null
  )
  const defaultBranch = branchesWithPrimaries[0]?.name ?? MOCK_BRANCHES[0]?.name ?? ''
  const [selectedBranch, setSelectedBranch] = useState(defaultBranch)

  const primaryTrainerId = primaryTrainerByBranch[selectedBranch]
  const primaryTrainer = trainers.find((t) => t.id === primaryTrainerId)

  return (
    <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 shrink-0" />
            <h3 className="text-lg font-semibold text-foreground">Primary Trainer</h3>
          </div>
          <Select
            value={selectedBranch}
            onValueChange={setSelectedBranch}
          >
            <SelectTrigger className="h-8 w-[140px] bg-primary/10 border-primary/30 text-xs">
              <MapPin className="w-3 h-3 mr-1 shrink-0" />
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_BRANCHES.map((branch) => (
                <SelectItem key={branch.id} value={branch.name}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {primaryTrainer ? (
          <>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 bg-primary/30 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                  {primaryTrainer.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 space-y-2">
                <div>
                  <h4 className="text-lg font-semibold text-foreground">{primaryTrainer.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Oversees all trainers at this branch
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {primaryTrainer.specialties.split(', ').map((specialty) => (
                    <Badge key={specialty} className="bg-primary/30 text-primary hover:bg-primary/40">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-primary/20 pt-4 space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground break-all">
                  {primaryTrainer.email}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">{primaryTrainer.phone}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No primary trainer assigned for this branch
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Edit a trainer and check &quot;Primary trainer for this branch&quot;
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
