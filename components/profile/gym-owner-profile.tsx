'use client'

import React from "react"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, MapPin, Building2, User, Edit2, Save, X } from 'lucide-react'

// Mock user data
const mockUser = {
  id: 1,
  name: 'Carlos González',
  email: 'carlos@fitnessgym.com',
  phone: '555-0100',
  gymName: 'FitnessPro Gym',
  location: 'Madrid, Spain',
  joinDate: '2023-01-15',
  status: 'active',
  avatar: 'CG',
}

export function GymOwnerProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(mockUser)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(mockUser)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-2xl">{formData.avatar}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{formData.name}</h1>
                <p className="text-sm text-muted-foreground">{formData.gymName}</p>
                <Badge className="mt-2 bg-green-900 text-green-100">Active</Badge>
              </div>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="border-border"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Personal Information */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your account details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Full Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-secondary border-border"
                />
              ) : (
                <p className="text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  {formData.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-secondary border-border"
                />
              ) : (
                <p className="text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {formData.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">Phone</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-secondary border-border"
                />
              ) : (
                <p className="text-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {formData.phone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gymName" className="text-foreground">Gym Name</Label>
              {isEditing ? (
                <Input
                  id="gymName"
                  name="gymName"
                  value={formData.gymName}
                  onChange={handleChange}
                  className="bg-secondary border-border"
                />
              ) : (
                <p className="text-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  {formData.gymName}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location" className="text-foreground">Location</Label>
              {isEditing ? (
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="bg-secondary border-border"
                />
              ) : (
                <p className="text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  {formData.location}
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button onClick={handleSave} className="bg-primary">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel} className="border-border bg-transparent">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-muted-foreground">Member Since</span>
            <span className="text-foreground font-medium">January 15, 2023</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-muted-foreground">Account Status</span>
            <Badge className="bg-green-900 text-green-100">Active</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Subscription Plan</span>
            <span className="text-foreground font-medium">Premium</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
