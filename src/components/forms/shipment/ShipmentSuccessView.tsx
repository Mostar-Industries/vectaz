
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, FileDown, Mail, Loader2, Database } from 'lucide-react';
import { GlassContainer } from '@/components/ui/glass-effects';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from '@/hooks/use-toast';

interface ShipmentSuccessViewProps {
  onCreateAnother: () => void;
  shipmentData?: {
    id?: string;
    reference?: string;
  };
}

const ShipmentSuccessView: React.FC<ShipmentSuccessViewProps> = ({ 
  onCreateAnother,
  shipmentData = {}
}) => {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleDownloadPDF = () => {
    // In a real implementation, this would generate and download a PDF using jsPDF
    // For demo purposes, we'll just show a toast
    toast({
      title: "PDF Downloaded",
      description: "The shipment details have been downloaded as a PDF document."
    });
  };

  const handleOpenEmailDialog = () => {
    setIsEmailDialogOpen(true);
  };

  const handleSendEmail = async () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsSendingEmail(true);
    
    try {
      // Simulate sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Email Sent",
        description: `The shipment details have been sent to ${recipientEmail}`
      });
      
      setIsEmailDialogOpen(false);
      setRecipientEmail('');
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: "Failed to send the email. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const shipmentRef = shipmentData.reference || shipmentData.id || 'New Shipment';

  return (
    <>
      <GlassContainer className="max-w-4xl mx-auto p-8 mt-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="mt-4 text-xl font-medium text-[#00FFD1]">Shipment Successfully Created</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Your new shipment has been registered in the system and saved to the database.
            You can track its progress in the Map view.
          </p>
          <div className="mt-3 flex justify-center">
            <div className="bg-blue-500/10 text-blue-400 rounded-full px-4 py-1 text-sm flex items-center">
              <Database className="h-3.5 w-3.5 mr-1.5" />
              Synced with database
            </div>
          </div>
          <div className="mt-6 flex justify-center space-x-4">
            <Button 
              variant="outline" 
              className="border-[#00FFD1]/30 text-[#00FFD1] hover:bg-[#00FFD1]/10"
              onClick={handleDownloadPDF}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Download Shipment Details
            </Button>
            <Button 
              variant="outline" 
              className="border-[#00FFD1]/30 text-[#00FFD1] hover:bg-[#00FFD1]/10"
              onClick={handleOpenEmailDialog}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email Shipment Details
            </Button>
            <Button 
              variant="outline" 
              className="border-[#00FFD1]/30 text-[#00FFD1] hover:bg-[#00FFD1]/10"
              onClick={onCreateAnother}
            >
              Create Another Shipment
            </Button>
          </div>
        </div>
      </GlassContainer>

      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Shipment Details as PDF</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="email" className="mb-2 block">Recipient Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="recipient@example.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="secondary" 
              onClick={() => setIsEmailDialogOpen(false)}
              disabled={isSendingEmail}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendEmail}
              disabled={!recipientEmail || isSendingEmail}
            >
              {isSendingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Email"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShipmentSuccessView;
