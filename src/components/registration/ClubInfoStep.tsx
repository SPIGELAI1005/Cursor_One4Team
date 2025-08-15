import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Globe, MapPin } from "lucide-react"
import type { RegistrationData } from "@/pages/Registration"

interface ClubInfoStepProps {
  data: RegistrationData
  updateData: (data: Partial<RegistrationData>) => void
}

const clubTypes = [
  "Football",
  "Basketball", 
  "Tennis",
  "Volleyball",
  "Swimming",
  "Athletics",
  "Handball",
  "Rugby",
  "Multi-sport",
  "Other"
]

const countries = [
  "United States",
  "United Kingdom", 
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Belgium",
  "Canada",
  "Australia",
  "Other"
]

export function ClubInfoStep({ data, updateData }: ClubInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:gap-6">
        {/* Club Name */}
        <div className="space-y-2">
          <Label htmlFor="clubName" className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Club Name *
          </Label>
          <Input
            id="clubName"
            value={data.clubName}
            onChange={(e) => updateData({ clubName: e.target.value })}
            placeholder="Enter your club's name"
            className="text-base"
            required
          />
        </div>

        {/* Club Type and Country Row */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="clubType" className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Club Type *
            </Label>
            <Select
              value={data.clubType}
              onValueChange={(value) => updateData({ clubType: value })}
            >
              <SelectTrigger className="text-base">
                <SelectValue placeholder="Select club type" />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground border shadow-md z-50">
                {clubTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Country *
            </Label>
            <Select
              value={data.country}
              onValueChange={(value) => updateData({ country: value })}
            >
              <SelectTrigger className="text-base">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground border shadow-md z-50">
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Club Website */}
        <div className="space-y-2">
          <Label htmlFor="clubWebsite" className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            Club Website (Optional)
          </Label>
          <Input
            id="clubWebsite"
            type="url"
            value={data.clubWebsite}
            onChange={(e) => updateData({ clubWebsite: e.target.value })}
            placeholder="https://yourclub.com"
            className="text-base"
          />
          <p className="text-sm text-muted-foreground">
            Help members find you online
          </p>
        </div>
      </div>

      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Why we need this information</h3>
        <p className="text-sm text-muted-foreground">
          Club details help us customize your experience and connect you with relevant features for your sport and region.
        </p>
      </div>
    </div>
  )
}