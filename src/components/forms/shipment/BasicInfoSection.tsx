
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicInfoSectionProps {
  reference: string;
  description: string;
  category: string;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  reference,
  description,
  category,
  onDescriptionChange,
  onCategoryChange
}) => {
  const categories = [
    "Medical Supplies",
    "Electronics",
    "Automotive Parts",
    "Agricultural Products",
    "Construction Materials",
    "Chemicals",
    "Textiles",
    "Food & Beverages",
    "Consumer Goods",
    "Other"
  ];

  return (
    <div>
      <h4 className="font-medium text-sm text-muted-foreground mb-4">BASIC INFORMATION</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="reference">Reference Number</Label>
          <Input id="reference" value={reference} readOnly />
          <p className="text-xs text-muted-foreground mt-1">Auto-generated shipment reference</p>
        </div>
        
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="description">Cargo Description</Label>
          <Textarea 
            id="description" 
            placeholder="Provide details about the cargo" 
            className="h-24 resize-none"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
