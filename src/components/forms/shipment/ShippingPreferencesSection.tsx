
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ship, Truck, Plane, Train } from 'lucide-react';

interface ShippingPreferencesSectionProps {
  mode: string;
  priority: string;
  onModeChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
}

const ShippingPreferencesSection: React.FC<ShippingPreferencesSectionProps> = ({
  mode,
  priority,
  onModeChange,
  onPriorityChange
}) => {
  const shippingModes = [
    { value: "sea", label: "Sea", icon: <Ship className="h-4 w-4 mr-2" /> },
    { value: "road", label: "Road", icon: <Truck className="h-4 w-4 mr-2" /> },
    { value: "air", label: "Air", icon: <Plane className="h-4 w-4 mr-2" /> },
    { value: "rail", label: "Rail", icon: <Train className="h-4 w-4 mr-2" /> }
  ];
  
  const priorityLevels = [
    { value: "standard", label: "Standard" },
    { value: "express", label: "Express" },
    { value: "urgent", label: "Urgent" }
  ];

  return (
    <div>
      <h4 className="font-medium text-sm text-muted-foreground mb-4">SHIPPING PREFERENCES</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="shipping-mode">Mode of Transport</Label>
          <Select value={mode} onValueChange={onModeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              {shippingModes.map(mode => (
                <SelectItem key={mode.value} value={mode.value}>
                  <div className="flex items-center">
                    {mode.icon}
                    <span>{mode.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={onPriorityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {priorityLevels.map(level => (
                <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ShippingPreferencesSection;
