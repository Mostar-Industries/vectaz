
import React from 'react';
import { ProtocolExplanation } from '@/services/systemExplanation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Beaker, Award, CheckCircle } from 'lucide-react';

interface PrimeOriginExplanationProps {
  protocol: ProtocolExplanation;
}

export const PrimeOriginExplanation: React.FC<PrimeOriginExplanationProps> = ({ protocol }) => {
  return (
    <Card className="border border-primary/20 bg-primary/5">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-primary" />
            <CardTitle>{protocol.title}</CardTitle>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary">Scientific Core</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{protocol.description}</p>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <Award className="h-4 w-4 mr-2 text-primary" />
            {protocol.methodology.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">{protocol.methodology.description}</p>
          
          <Accordion type="single" collapsible className="w-full">
            {protocol.methodology.components.map((component, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-sm font-medium">
                  {component.name}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm">
                    <p className="mb-2">{component.description}</p>
                    <p className="text-xs text-muted-foreground italic">
                      <span className="font-semibold">Scientific basis:</span> {component.scientificBasis}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-primary" />
            {protocol.benefits.title}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {protocol.benefits.items.map((benefit, index) => (
              <div key={index} className="bg-background p-3 rounded border">
                <h4 className="text-sm font-medium">{benefit.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-primary/10 p-4 rounded text-sm">
          <p className="font-medium mb-1">Real-World Impact:</p>
          <p>{protocol.realWorldImpact}</p>
        </div>
      </CardContent>
    </Card>
  );
};
